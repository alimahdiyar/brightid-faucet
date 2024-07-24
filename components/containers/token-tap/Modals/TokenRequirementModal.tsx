"use client";

import { appInfos } from "@/app/incentive-center/constants/integrations";
import { ClaimAndEnrollButton } from "@/components/ui/Button/button";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { Permission, Token, UserConnection } from "@/types";
import { replacePlaceholders } from "@/utils";
import { getTokenConstraintsVerifications } from "@/utils/api";
import { getAllConnections } from "@/utils/serverApis";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import Lottie from "react-lottie";
import loadingAnimation from "@/lotties/loadingDot.json";

export const loadingAnimationRequirementsOption = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const requirementsConnections: { [key: string]: string | null } = {
  IsFollowinTwitterUser: "Twitter",
  DidQuoteTweet: "Twitter",
  DidRetweetTweet: "Twitter",
  BridgeEthToArb: null, // 25
  IsFollowingFarcasterChannel: "Farcaster", // 24
  HasFarcasterProfile: "Farcaster", // 23
  IsFollowingFarcasterUser: "Farcaster", // 22
  DidLikedFarcasterCast: "Farcaster", // 21
  HasMinimumFarcasterFollower: "Farcaster", // 20
  HasTokenTransferVerification: null, // 19
  DidRecastFarcasterCast: "Farcaster", // 18
  BeFollowedByFarcasterUser: "Farcaster", // 17
  HasMinimumLensFollower: "Lens", // 16
  DidMirrorOnLensPublication: "Lens", // 15
  DidCollectLensPublication: "Lens", // 14
  HasMinimumLensPost: "Lens", // 13
  BeFollowedByLensUser: "Lens", // 12
  IsFollowingLensUser: "Lens", // 11
  HasLensProfile: "Lens", // 10
  HasENSVerification: "ENS", // 9
  HasTokenVerification: null, // 8
  AllowListVerification: null, // 7
  HasNFTVerification: null, // 6
  OptimismClaimingGasConstraint: null, // 5
  OptimismDonationConstraint: null, // 4
  HaveUnitapPass: null, // 3
  BrightIDAuraVerification: "BrightID", // 2
  BrightIDMeetVerification: "BrightID", // 1
};

export const requirementWithoutApps: {
  [key: string]: (params: any, name: string) => string;
} = {
  BridgeEthToArb: (params, name) => {
    return "https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum";
  },
};

export const renderLinkValue = (
  appName: string,
  params: { [key: string]: any },
) => {
  if (appName?.toLowerCase() === "twitter") {
    if (params["TWEET_ID"]) {
      return `https://twitter.com/i/status/${params["TWEET_ID"]}`;
    }

    if (params["TWITTER_USERNAME"]) {
      return `https://x.com/${params["TWITTER_USERNAME"]})`;
    }
  }

  return "#";
};

export function checkConnections(
  userConnections: UserConnection,
  requirementName: string,
) {
  const requiredConnection =
    requirementsConnections[requirementName.split(".").splice(1).join(".")];
  if (!requiredConnection) {
    return true;
  }

  return userConnections[requiredConnection]?.isConnected;
}

const Sidebar: FC<{
  token: Token;
  permissions: (Permission & { isVerified: boolean })[];
}> = ({ token, permissions }) => {
  const { currentRequirementIndex, setCurrentRequirementIndex, setMethod } =
    useTokenTapContext();

  useEffect(() => {
    setCurrentRequirementIndex(
      token.constraints.findIndex((item) => item.type === "VER"),
    );
  }, []);

  return (
    <aside className="h-full w-44 overflow-auto rounded-lg bg-gray20 p-2 text-sm">
      <div className="mt-3">
        <div className="mb-2 rounded-xl border-2 border-dark-space-green bg-dark-space-green/30 p-2 text-center font-semibold">
          {
            (!!permissions.length ? permissions : token.constraints).filter(
              (item: any) => item.isVerified,
            ).length
          }
          /{(!!permissions.length ? permissions : token.constraints).length}{" "}
          Done
        </div>
        {(!!permissions.length ? permissions : token.constraints).map(
          (constraint: any, index) => (
            <Fragment key={index}>
              <button
                onClick={() => setCurrentRequirementIndex(index)}
                className={`block w-full rounded-xl border-2 border-gray50 p-2 text-center text-gray100 ${index === currentRequirementIndex ? "!border-gray100 bg-gray70 text-white" : constraint.isVerified ? "!border-dark-space-green" : ""}`}
              >
                {constraint.title}
              </button>
              {index === token.constraints.length - 1 || (
                <div className="mx-auto h-3 w-[2px] bg-gray80"></div>
              )}
            </Fragment>
          ),
        )}

        <button
          disabled={
            (!!permissions.length ? permissions : token.constraints).length !==
            (!!permissions.length ? permissions : token.constraints).filter(
              (item: any) => item.isVerified,
            ).length
          }
          className={`mt-3 block w-full rounded-xl border-2 border-space-green p-2 text-center disabled:border-gray50 disabled:opacity-60`}
          style={{
            background: "url('/assets/images/prize-tap/enroll.svg')",
          }}
          onClick={() => setMethod("claim")}
        >
          Claim
        </button>
      </div>
    </aside>
  );
};

const TokenRequirementBody: FC<{
  permissions: (Permission & { isVerified: boolean })[];
  refreshPermissions: () => void;
  loading: boolean;
}> = ({ permissions, refreshPermissions, loading }) => {
  const {
    selectedTokenForClaim,
    currentRequirementIndex,
    setCurrentRequirementIndex,
    setMethod,
  } = useTokenTapContext();

  const { userToken } = useUserProfileContext();

  const [connections, setConnections] = useState<UserConnection>({});

  const constraint =
    currentRequirementIndex !== undefined
      ? selectedTokenForClaim?.constraints[currentRequirementIndex]
      : null;

  const params = useMemo(
    () =>
      selectedTokenForClaim
        ? JSON.parse(selectedTokenForClaim.constraintParams || "{}")
        : {},
    [selectedTokenForClaim],
  );

  useEffect(() => {
    if (!constraint || !userToken || !selectedTokenForClaim) return;

    getAllConnections(userToken).then(setConnections);
  }, [constraint, selectedTokenForClaim, userToken]);

  if (!constraint)
    return (
      <main className="h-full flex-1 rounded-lg bg-gray20 p-2 text-sm"></main>
    );

  const appName = constraint.name.split(".").splice(1).join(".");

  const app = appInfos[requirementsConnections[appName]!];

  const link = renderLinkValue(
    requirementsConnections[appName]!,
    params[constraint.name],
  );

  const linkWithoutApp = requirementWithoutApps[appName]?.(params, appName);

  return (
    <main className="flex h-full flex-1 flex-col rounded-lg bg-gray20 p-2 text-center text-sm text-white">
      {app && (
        <Image
          className="mx-auto"
          src={app.logo}
          width={70}
          height={70}
          alt={app.label}
        />
      )}
      <h3 className="mt-4 text-base text-white">{constraint.title}</h3>
      <p className="mt-2 text-sm text-gray100">
        <ReactMarkdown className="markdown">
          {replacePlaceholders(
            (constraint.isReversed
              ? constraint.negativeDescription
              : constraint.description)!,
            params[constraint.name],
          )}
        </ReactMarkdown>
      </p>
      <div className="mt-auto flex w-full items-center p-2">
        {checkConnections(connections, constraint.name) ? (
          permissions.find((item) => item.name === constraint.name)
            ?.isVerified ? (
            currentRequirementIndex === permissions.length - 1 ? (
              <button
                disabled={
                  (!!permissions.length
                    ? permissions
                    : selectedTokenForClaim!.constraints
                  ).length !==
                  (!!permissions.length
                    ? permissions
                    : selectedTokenForClaim!.constraints
                  ).filter((item: any) => item.isVerified).length
                }
                className={`mx-auto mt-3 block w-52 rounded-xl border-2 border-space-green p-2 text-center disabled:border-gray50 disabled:opacity-60`}
                style={{
                  background: "url('/assets/images/prize-tap/enroll.svg')",
                }}
                onClick={() => setMethod("claim")}
              >
                Claim
              </button>
            ) : (
              <button
                className="w-full rounded-lg border border-dark-space-green bg-dark-space-green/10 px-5 py-2 text-sm font-semibold text-space-green"
                onClick={() =>
                  setCurrentRequirementIndex(currentRequirementIndex + 1)
                }
                disabled={loading}
              >
                Verified
              </button>
            )
          ) : (
            <div className="flex w-full items-center justify-end gap-3">
              {link === "#" || (
                <Link target="_blank" href={link} className="w-full">
                  <ClaimAndEnrollButton className="!w-full flex-1">
                    <p>Let{"'"}s Do it</p>
                  </ClaimAndEnrollButton>
                </Link>
              )}

              {!!linkWithoutApp && (
                <Link target="_blank" href={linkWithoutApp} className="w-full">
                  <ClaimAndEnrollButton className="!w-full flex-1">
                    <p>Let{"'"}s Do it</p>
                  </ClaimAndEnrollButton>
                </Link>
              )}

              <button
                onClick={refreshPermissions}
                disabled={loading}
                className="ml-auto w-20 rounded-xl border-gray100 bg-gray70 px-2 py-2 disabled:opacity-50"
              >
                {loading ? (
                  <Lottie
                    width={40}
                    height={20}
                    options={loadingAnimationRequirementsOption}
                  ></Lottie>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          )
        ) : (
          <Link href="/profile" className="w-full">
            <ClaimAndEnrollButton className="!w-full">
              <p>Connect {app?.label}</p>
            </ClaimAndEnrollButton>
          </Link>
        )}
      </div>
    </main>
  );
};

const TokenRequirementModal: FC<{
  token: Token;
}> = ({ token }) => {
  const { userToken } = useUserProfileContext();
  const [loading, setLoading] = useState(false);

  const [permissions, SetPermissions] = useState<
    (Permission & { isVerified: boolean })[]
  >([]);

  const refreshPermissions = () => {
    if (!userToken) return;
    setLoading(true);
    getTokenConstraintsVerifications(token.id, userToken)
      .then((res) => {
        SetPermissions(res.constraints);
      })
      .catch(() => {
        SetPermissions(
          token.constraints.map((constraint) => ({
            ...constraint,
            isVerified: false,
          })),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!userToken) return;
    setLoading(true);
    getTokenConstraintsVerifications(token.id, userToken)
      .then((res) => {
        SetPermissions(res.constraints);
      })
      .catch(() => {
        SetPermissions(
          token.constraints.map((constraint) => ({
            ...constraint,
            isVerified: false,
          })),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userToken]);

  return (
    <div className="-mt-3 flex h-72 w-full items-center justify-start gap-2 overflow-y-auto">
      <Sidebar permissions={permissions} token={token} />
      <TokenRequirementBody
        loading={loading}
        permissions={permissions}
        refreshPermissions={refreshPermissions}
      />
    </div>
  );
};

export default TokenRequirementModal;