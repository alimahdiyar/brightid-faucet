"use client";

import { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  RequirementProps,
  ConstraintProps,
  Chain,
  LensUserProfile,
  FarcasterProfile,
} from "@/types";
import useAddRequirement from "@/components/containers/provider-dashboard/hooks/useAddRequirement";
import Icon from "@/components/ui/Icon";
import ChainList from "@/app/contribution-hub/ChainList";
import SelectMethodInput from "@/app/contribution-hub/SelectMethodInput";
import { useWalletProvider } from "@/utils/wallet";
import { isAddress, zeroAddress } from "viem";
import {
  checkNftCollectionAddress,
  checkTokenContractAddress,
} from "@/components/containers/provider-dashboard/helpers/checkCollectionAddress";
import CsvFileInput from "./CsvFileInput";
import Input from "@/components/ui/input";
import {
  fetchFarcasterProfiles,
  fetchLensProfileUsers,
} from "@/utils/api/lens";
import { useOutsideClick } from "@/utils/hooks/dom";

interface CreateModalParam {
  constraint: ConstraintProps;
  setRequirementParamsList: any;
  requirementParamsList: any;
  constraintFile: any;
  allChainList: Chain[];
  setConstraintFile: (item: any) => void;
  requirementList: RequirementProps[];
  isCollectionValid: boolean;
  setIsCollectionValid: (e: boolean) => void;
  setErrorMessage: (message: string) => void;
  decimals: number | undefined;
  setDecimals: (decimal: number | undefined) => void;
}

interface DetailsModal {
  constraint: ConstraintProps;
  handleBackToConstraintListModal: any;
  requirementList: RequirementProps[];
  insertRequirement: any;
  updateRequirement: any;
  allChainList: Chain[];
}

const ConstraintDetailsModal: FC<DetailsModal> = ({
  constraint,
  handleBackToConstraintListModal,
  requirementList,
  insertRequirement,
  updateRequirement,
  allChainList,
}) => {
  const addRequirements = useAddRequirement(
    handleBackToConstraintListModal,
    insertRequirement,
    updateRequirement,
  );

  const [existRequirement, setExistRequirement] =
    useState<RequirementProps | null>(null);

  const [requirementParamsList, setRequirementParamsList] = useState<any>();

  const [isNotSatisfy, setIsNotSatisfy] = useState<boolean>(false);

  const [constraintFile, setConstraintFile] = useState<any>();

  const [isCollectionValid, setIsCollectionValid] = useState<boolean>(false);

  const [decimals, setDecimals] = useState<number | undefined>();

  const createRequirementParamsList = () => {
    if (constraint.params.length > 0) {
      setRequirementParamsList(
        constraint.params.reduce((obj: any, item: any, index: any) => {
          obj[item] = "";
          return obj;
        }, {}),
      );
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>();

  useEffect(() => {
    const requirement = requirementList.find(
      (item) => item.pk == constraint.pk,
    );

    setExistRequirement(requirement ? requirement : null);

    if (requirement) {
      setIsNotSatisfy(requirement.isNotSatisfy);
      setRequirementParamsList(requirement.params);
    } else {
      createRequirementParamsList();
    }
  }, []);

  const checkingParamsValidation = () => {
    if (!requirementParamsList) return false;
    if (
      !requirementParamsList.ADDRESS ||
      !requirementParamsList.CHAIN ||
      !requirementParamsList.MINIMUM ||
      Number(requirementParamsList.MINIMUM) <= 0
    ) {
      !requirementParamsList.ADDRESS
        ? setErrorMessage("Please enter collection address.")
        : !requirementParamsList.CHAIN
          ? setErrorMessage("Please select chain.")
          : setErrorMessage("Please select minimum amount.");
      return false;
    }

    if (!isCollectionValid) return false;
    return true;
  };

  const checkCsvFileUploadedValidation = () => {
    if (!requirementParamsList) return false;
    if (!requirementParamsList.CSV_FILE) {
      setErrorMessage("Please upload a csv file.");
      return false;
    }
    return true;
  };

  const handleAddRequirement = () => {
    if (
      constraint.name === "core.HasNFTVerification" ||
      constraint.name === "core.HasTokenVerification"
    ) {
      const res = checkingParamsValidation();
      if (!res) return;
    }

    if (constraint.name === "core.AllowListVerification") {
      const res = checkCsvFileUploadedValidation();
      if (!res) return;
    }

    addRequirements(
      existRequirement,
      constraint.pk,
      constraint.name,
      constraint.title,
      isNotSatisfy,
      requirementParamsList,
      constraintFile,
      decimals,
    );
  };

  const handleSelectNotSatisfy = (isSatisfy: boolean) => {
    setIsNotSatisfy(isSatisfy);
  };

  return (
    <div className="relative mt-5 flex flex-col gap-2">
      <div
        className="absolute -top-14 z-[999] cursor-pointer"
        onClick={handleBackToConstraintListModal}
      >
        <Icon
          iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          className="cursor-pointer"
        />
      </div>
      <div className="mb-2 flex h-[32px] w-full gap-4">
        <div
          onClick={() => handleSelectNotSatisfy(false)}
          className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-white`}
        >
          <div
            className={`${
              !isNotSatisfy ? "bg-dark-space-green opacity-30" : "bg-gray50"
            } absolute h-full w-full`}
          ></div>
          <p className="absolute text-white">Should satisfy</p>
        </div>
        <div
          onClick={() => handleSelectNotSatisfy(true)}
          className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-white`}
        >
          <div
            className={`${
              isNotSatisfy ? "bg-error opacity-50" : "bg-gray50"
            } absolute h-full w-full `}
          ></div>
          <p className="absolute text-white">Should not satisfy</p>
        </div>
      </div>
      <CreateParams
        constraint={constraint}
        setRequirementParamsList={setRequirementParamsList}
        requirementParamsList={requirementParamsList}
        constraintFile={constraintFile}
        setConstraintFile={setConstraintFile}
        allChainList={allChainList}
        requirementList={requirementList}
        isCollectionValid={isCollectionValid}
        setIsCollectionValid={setIsCollectionValid}
        setErrorMessage={setErrorMessage}
        decimals={decimals}
        setDecimals={setDecimals}
      />
      <div className="mb-4">{constraint.description}</div>
      <div className="min-h-[15px] text-2xs text-error">{errorMessage}</div>
      <div
        onClick={handleAddRequirement}
        className="mb-2 flex  h-[44px] cursor-pointer items-center justify-center rounded-xl border-2 border-gray70 bg-gray40 text-sm font-semibold text-white"
      >
        Add Requirement
      </div>
    </div>
  );
};

const CreateParams: FC<CreateModalParam> = ({
  constraint,
  setRequirementParamsList,
  requirementParamsList,
  constraintFile,
  setConstraintFile,
  allChainList,
  requirementList,
  isCollectionValid,
  setIsCollectionValid,
  setErrorMessage,
  decimals,
  setDecimals,
}) => {
  const [collectionAddress, setCollectionAddress] = useState("");
  const [isNativeToken, setIsNativeToken] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<Chain | undefined>();
  const requirement = requirementList.find((item) => item.pk == constraint.pk);

  const provider = useWalletProvider();

  useEffect(() => {
    if (requirement) {
      if (!requirement.params) return;
      setCollectionAddress(requirement.params.ADDRESS);
      if (requirement.params.ADDRESS === zeroAddress) {
        setIsNativeToken(true);
      } else {
        checkCollectionContract();
      }
    }
  }, []);

  useEffect(() => {
    if (!collectionAddress) return;
    const isAddressValid = isAddress(collectionAddress);
    !isAddressValid && setErrorMessage("Invalid contract address.");
    isAddressValid && setErrorMessage("");
    if (isAddressValid) {
      if (collectionAddress === zeroAddress) {
        setIsCollectionValid(true);
        setDecimals(18);
        return;
      } else {
        checkCollectionContract();
      }
    } else {
      setIsCollectionValid(false);
    }
  }, [collectionAddress, selectedChain, isNativeToken]);

  const checkCollectionContract = async () => {
    if (!selectedChain) return;
    let res = false;

    if (constraint.name === "core.HasNFTVerification") {
      res = await checkNftCollectionAddress(
        provider!,
        requirementParamsList.ADDRESS,
        Number(selectedChain.chainId),
      );
      setDecimals(18);
    }

    if (constraint.name === "core.HasTokenVerification") {
      if (requirementParamsList.ADDRESS == zeroAddress) {
        setDecimals(18);
        return true;
      }
      res = await checkTokenContractAddress(
        provider!,
        requirementParamsList.ADDRESS,
        Number(selectedChain.chainId),
        setDecimals,
      );
    }
    !res && setErrorMessage("Invalid contract address.");
    setIsCollectionValid(res);
  };

  const handleChangeCollection = (address: string) => {
    setCollectionAddress(address);
    setRequirementParamsList({
      ...requirementParamsList,
      ["ADDRESS"]: address,
    });
  };

  if (constraint.params.length === 0) return null;

  if (
    constraint.name === "core.HasNFTVerification" ||
    constraint.name === "core.HasTokenVerification"
  ) {
    const isNft: boolean = constraint.name === "core.HasNFTVerification";

    const handleSelectNativeToken = (isNative: boolean) => {
      if (!selectedChain) return;
      setIsNativeToken((prev) => !prev);
      !isNative ? setCollectionAddress(zeroAddress) : setCollectionAddress("");
      setRequirementParamsList({
        ...requirementParamsList,
        ["ADDRESS"]: !isNative ? zeroAddress : "",
      });
    };

    return (
      <div className="flex flex-col gap-3">
        <ChainList
          setRequirementParamsList={setRequirementParamsList}
          requirementParamsList={requirementParamsList}
          allChainList={allChainList}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
        />

        {!isNft && (
          <div
            onClick={() => handleSelectNativeToken(isNativeToken)}
            className={`${
              !selectedChain ? "opacity-50" : "opacity-1 cursor-pointer"
            } -mb-1 mt-2 flex min-h-[20px] max-w-[110px] items-center gap-2`}
          >
            <Icon
              iconSrc={
                isNativeToken
                  ? "/assets/images/provider-dashboard/check-true.svg"
                  : "/assets/images/provider-dashboard/checkbox.svg"
              }
            />
            is native token
          </div>
        )}

        <div
          className={`${
            isNativeToken || !selectedChain ? "opacity-50" : "opacity-1"
          } nftAddress_requirement_input flex h-[43px] items-center overflow-hidden rounded-2xl border border-gray50 bg-gray40 pl-4`}
        >
          <input
            name={isNft ? "nftAddressRequirement" : "tokenAddressRequirement"}
            disabled={isNativeToken || !selectedChain}
            placeholder={isNft ? "Paste NFT address" : "Paste Token address"}
            className="h-full w-full bg-inherit"
            value={
              collectionAddress && collectionAddress != zeroAddress
                ? collectionAddress
                : ""
            }
            onChange={(e) => handleChangeCollection(e.target.value)}
          />
        </div>

        <SelectMethodInput
          setRequirementParamsList={setRequirementParamsList}
          requirementParamsList={requirementParamsList}
          isNft={isNft}
          requirement={requirement}
          isDisabled={!collectionAddress}
          decimals={decimals}
        />
      </div>
    );
  }

  if (constraint.name === "core.AllowListVerification") {
    return (
      <CsvFileInput
        setRequirementParamsList={setRequirementParamsList}
        requirementParamsList={requirementParamsList}
        setConstraintFile={setConstraintFile}
        constraintFile={constraintFile}
        requirement={requirement}
      />
    );
  }

  if (
    constraint.name === "core.IsFollowingLensUser" ||
    constraint.name == "core.BeFollowedByLensUser"
  ) {
    return (
      <LensUserFinder
        onAddRequirementParam={(params: any) =>
          setRequirementParamsList({ ...requirementParamsList, ...params })
        }
        featuredName={Object.keys(requirementParamsList ?? [])[0] as string}
        params={requirementParamsList}
      />
    );
  }

  console.log(requirementList);

  if (
    constraint.name == "core.HasMinimumLensPost" ||
    constraint.name === "core.HasMinimumLensFollower"
  ) {
    const featuredName = Object.keys(requirementParamsList ?? [])[0] as string;

    return (
      <MinimumLensAction
        featuredName={featuredName}
        onChange={(value: any) =>
          setRequirementParamsList({
            ...requirementParamsList,
            [featuredName]: value,
          })
        }
        value={requirementParamsList?.[featuredName]}
      />
    );
  }

  console.log(constraint);

  if (constraint.params.includes("FARCASTER_FID")) {
    return (
      <FarcasterUserFinder
        onAddRequirementParam={(params: any) =>
          setRequirementParamsList({ ...requirementParamsList, ...params })
        }
        featuredName={Object.keys(requirementParamsList ?? [])[0] as string}
        params={requirementParamsList}
      />
    );
  }

  return <></>;
};

const MinimumLensAction: FC<{
  featuredName: string;
  onChange: (arg: any) => void;
  value: any;
}> = ({ featuredName, onChange, value }) => {
  return (
    <Input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Number of followers/Post"
      className="bg-gray40 text-lg font-normal placeholder:text-gray80"
    />
  );
};

export type UserParams = {
  onAddRequirementParam: (param: any) => void;
  params: any;
  featuredName: string;
};

const FarcasterUserFinder: FC<UserParams> = ({
  featuredName,
  onAddRequirementParam,
  params,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<FarcasterProfile[]>([]);
  const [query, setQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    setShowResults(false);
  });

  useEffect(() => {
    const handleSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const results = await fetchFarcasterProfiles(query);
        setSearchResults(results);
        setLoading(false);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const onUserClick = (profileId: number, displayName: string) => {
    onAddRequirementParam({ [featuredName]: profileId });
    setQuery(displayName);
    setShowResults(false);
  };

  return (
    <div className="mb-20">
      <div onClick={() => setShowResults(true)} ref={ref}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a user to follow/Paste Farcaster link/Paste Farcaster link"
          className="bg-gray40 text-lg font-normal placeholder:text-gray80"
        />

        {showResults && (
          <div className="absolute z-10 w-full overflow-hidden rounded-lg border border-gray70 bg-gray20 shadow-md">
            {loading ? (
              <div className="h-40 divide-y divide-gray70 overflow-auto">
                {Array.from(new Array(3)).map((user) => (
                  <div
                    key={user}
                    className="flex cursor-pointer items-center p-4 transition-colors hover:bg-gray60"
                  >
                    <div>
                      <div className="skeleton-item h-2 w-20 rounded bg-gray100"></div>
                      <div className="skeleton-item mt-2 h-2 w-10 rounded bg-gray100"></div>
                      <div className="skeleton-item mt-2 h-2 w-10 rounded bg-gray100"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-gray100">No results found.</div>
            ) : (
              <div className="h-40 divide-y divide-gray70 overflow-auto">
                {searchResults.map((user, key) => (
                  <div
                    onClickCapture={() => onUserClick(user.fid, user.username)}
                    key={key}
                    className={`flex cursor-pointer items-center p-4 transition-colors hover:bg-gray60 ${
                      params[featuredName] == user.fid ? "bg-gray60" : ""
                    }`}
                  >
                    <div>
                      <div className="text font-semibold">{user.username}</div>
                      <div className="text-gray-400 text-xs">
                        Followers: {user.follower_count}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Following: {user.following_count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const LensUserFinder: FC<UserParams> = ({
  onAddRequirementParam,
  params,
  featuredName,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LensUserProfile[]>([]);
  const [query, setQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    setShowResults(false);
  });

  useEffect(() => {
    const handleSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const results = await fetchLensProfileUsers(query);
        setSearchResults(results);
        setLoading(false);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const onUserClick = (profileId: string, displayName: string) => {
    onAddRequirementParam({ [featuredName]: profileId });
    setQuery(displayName);
    setShowResults(false);
  };

  return (
    <div className="mb-20">
      <div onClick={() => setShowResults(true)} ref={ref}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a user to follow/Paste Lenster link/Paste Lenster link"
          className="bg-gray40 text-lg font-normal placeholder:text-gray80"
        />

        {showResults && (
          <div className="absolute z-10 w-full overflow-hidden rounded-lg border border-gray70 bg-gray20 shadow-md">
            {loading ? (
              <div className="h-40 divide-y divide-gray70 overflow-auto">
                {Array.from(new Array(3)).map((user) => (
                  <div
                    key={user}
                    className="flex cursor-pointer items-center p-4 transition-colors hover:bg-gray60"
                  >
                    <div className="skeleton-item mr-4 h-10 w-10 rounded-full bg-gray100" />

                    <div>
                      <div className="skeleton-item h-2 w-20 rounded bg-gray100"></div>
                      <div className="skeleton-item mt-2 h-2 w-10 rounded bg-gray100"></div>
                      <div className="skeleton-item mt-2 h-2 w-10 rounded bg-gray100"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-gray100">No results found.</div>
            ) : (
              <div className="h-40 divide-y divide-gray70 overflow-auto">
                {searchResults.map((user, key) =>
                  user.metadata ? (
                    <div
                      onClickCapture={() =>
                        onUserClick(user.id, user.metadata!.displayName)
                      }
                      key={user.id}
                      className={`flex cursor-pointer items-center p-4 transition-colors hover:bg-gray60 ${
                        params[featuredName] == user.id ? "bg-gray60" : ""
                      }`}
                    >
                      <img
                        src={
                          user.metadata.picture
                            ? user.metadata.picture.optimized.uri
                            : "/assets/images/profile.png"
                        }
                        alt={user.metadata.displayName}
                        className="mr-4 h-10 w-10 rounded-full bg-gray100"
                      />

                      <div>
                        <div className="text font-semibold">
                          {user.metadata.displayName}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Followers: {user.stats.followers}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Following: {user.stats.following}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Fragment key={key}></Fragment>
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstraintDetailsModal;
