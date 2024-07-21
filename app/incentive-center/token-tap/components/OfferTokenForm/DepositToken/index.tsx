"use client";

import { ProviderFormPaginationProp } from "@/types";
import DepositContent from "./components/DepositContent";
import DisplaySelectedTokenOrNft from "./components/DisplaySelectedTokenOrNft";
import Pagination from "@/app/incentive-center/components/pagination";
import { useCallback, useEffect, useMemo } from "react";
import ShowPreviewModal from "./components/ShowPreviewModal";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import { ProviderDashboardButtonSubmit } from "@/app/incentive-center/components/Buttons";
import {
  useNetworkSwitcher,
  useWalletAccount,
  useWalletNetwork,
} from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";
import DisplayRequirement from "@/app/incentive-center/prize-tap/components/OfferPrizeForm/DepositPrize/components/DisplayRequirement/DisplayRequirments";
import Icon from "@/components/ui/Icon";

const nftDescription = {
  title: "Deposit Selected NFT",
  description: `Please proceed with depositing the NFT for which you have completed the corresponding form. Please wait
	momentarily as we validate your request. In the event of rejection, the token will promptly returned to
	your designated wallet.`,
  icon: "/assets/images/provider-dashboard/Subtract.svg",
};

const tokenDescription = {
  title: "Deposit Selected Token",
  description: `Please proceed with depositing the Token for which you have completed the corresponding form. Please wait
	momentarily as we validate your request. In the event of rejection, the token will promptly returned to
	your designated wallet.`,
  icon: "/assets/images/provider-dashboard/deposit-token.png",
};

const DepositToken = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const {
    openShowPreviewModal,
    data,
    page,
    createRaffleResponse,
    isErc20Approved,
    handleApproveErc20Token,
    approveLoading,
    isShowingDetails,
    requirementList,
    selectedToken,
    handleCreateDistribution,
    createRaffleLoading,
  } = useTokenTapFromContext();

  const handleNextPage = () => {
    if (isShowingDetails) handleChangeFormPageNext();
    else {
      openShowPreviewModal();
    }
  };

  const { address, isConnected } = useWalletAccount();
  const { chain } = useWalletNetwork();

  const chainId = chain?.id;
  const { switchChain } = useNetworkSwitcher();
  const { setIsWalletPromptOpen } = useGlobalContext();

  const isRightChain = useMemo(() => {
    if (!isConnected || !chainId || !data.selectedChain) return false;
    return chainId === Number(data.selectedChain.chainId);
  }, [data.selectedChain, isConnected, chainId]);
  const handleCheckConnection = useCallback(async () => {
    if (!isConnected) {
      setIsWalletPromptOpen(true);
      return;
    }
    if (!chainId || !data.selectedChain || !address) return;
    if (!isRightChain) {
      await switchChain(Number(data.selectedChain.chainId));
      return;
    }
  }, [
    isConnected,
    chainId,
    data.selectedChain,
    address,
    isRightChain,
    switchChain,
    setIsWalletPromptOpen,
  ]);

  const approve = data.isNativeToken ? true : isErc20Approved;
  useEffect(() => {
    createRaffleResponse?.state === "Done" ? handleChangeFormPageNext() : null;
  }, [createRaffleResponse, handleChangeFormPageNext]);

  return (
    <div className="flex w-full animate-fadeIn flex-col items-center justify-center">
      <div className="flex min-h-[424px] w-full min-w-[300px] max-w-[452px] flex-col gap-5">
        <div className="no-scrollbar mb-5 flex max-h-[555px] min-h-[424px] w-full min-w-[300px] max-w-[452px] flex-col gap-2 overflow-auto px-1">
          <p>Please check the prize info and confirm it:</p>
          {requirementList.length > 0 && (
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className=" text-sm text-space-green">Requirement</p>
                <div className="h-[1px] w-full bg-space-green"></div>
              </div>
              {requirementList.map((requirement, key) => (
                <DisplayRequirement key={key} requirement={requirement} />
              ))}
            </div>
          )}

          <div className="prize-information mt-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className=" w-full max-w-[120px] text-sm text-space-green">
                Token Information
              </p>
              <div className="h-[1px] w-full bg-space-green"></div>
            </div>
            <div className="flex gap-3">
              <div className="mb-3 h-[74px] w-full rounded-xl bg-gray30 px-4 py-3">
                <p className="mb-3 text-xs text-gray90">Chain</p>
                <div className="flex items-center gap-2">
                  <img src={data.selectedChain?.logoUrl} width={"24px"} />
                  <div className="text-sm font-normal text-white">
                    {data.selectedChain?.chainName}
                  </div>
                </div>
              </div>
              <div className="h-[74px] w-full rounded-xl bg-gray30 px-4 py-3">
                <p className="mb-3 text-xs text-gray90">Token</p>
                <div className="flex items-center gap-2">
                  <img src={selectedToken?.logoUrl} width={"24px"} />
                  <div className="text-sm font-normal text-white">
                    {selectedToken?.tokenName}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-[74px] items-center justify-between overflow-hidden rounded-lg bg-gray30">
              <div className="flex h-full w-full flex-col justify-center bg-gray40 pl-3">
                <p className="mb-3 text-xs text-gray90">Number of claims</p>
                <p className="text-sm">{data.winnersCount}</p>
              </div>
              <div className="flex min-w-[20px] items-center justify-center">
                x
              </div>
              <div className="flex h-full w-full flex-col justify-center bg-gray40 pl-3">
                <p className="mb-3 text-xs text-gray90">Amount Per claim</p>
                <p className="text-sm">{data.tokenAmount}</p>
              </div>
              <div className="flex min-w-[20px] items-center justify-center">
                =
              </div>
              <div className="flex h-full w-full flex-col justify-center bg-gray40 pl-3">
                <p className="mb-3 text-xs text-gray90">Total Amount</p>
                <p className="text-sm">{data.totalAmount}</p>
              </div>
            </div>
          </div>

          <div className="time-limitation mt-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className=" w-full max-w-[165px] text-sm text-space-green">
                Time/Claiming Limitation
              </p>
              <div className="h-[1px] w-full bg-space-green"></div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-full w-full flex-col justify-center rounded-xl bg-gray40 p-3">
                <p className="mb-3 text-xs text-gray90">Start Claiming Time</p>
                <p className="text-sm">
                  {new Date(data.startTimeStamp * 1000).toLocaleString()}
                </p>
              </div>
              <div className="flex h-full w-full flex-col justify-center rounded-xl bg-gray40 p-3">
                <p className="mb-3 text-xs text-gray90">End Time</p>
                <p className="text-sm">
                  {new Date(data.endTimeStamp * 1000).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-3 h-[74px] rounded-xl bg-gray30 px-4 py-3">
              <p className="mb-3 text-xs text-gray90">Claiming Type</p>
              <p>OneTime-Claimable (Each person can claim once.)</p>
            </div>
          </div>

          <div className="social mt-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="w-full max-w-[178px] text-sm text-space-green">
                Social Media & Contact Info
              </p>
              <div className="h-[1px] w-full bg-space-green"></div>
            </div>
            <div className="mb-3">
              <div className="flex h-[74px] flex-col justify-center gap-2 rounded-xl bg-gray30 pl-3">
                <p className="text-xs text-gray90">
                  Provider (will be shown on card)
                </p>
                <p className="text-sm">{data.provider}</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex min-h-[74px] flex-col justify-center gap-2 rounded-xl bg-gray30 pl-3">
                <p className="text-xs text-gray90">
                  Description (will be shown on card)
                </p>
                <p className="text-sm">{data.description}</p>
              </div>
            </div>

            {data.creatorUrl && (
              <div className="mb-3 flex h-11 items-center gap-2 rounded-xl bg-gray30 pl-3">
                <Icon iconSrc="/assets/images/provider-dashboard/creatorUrl.svg" />
                <p className="text-xs">{data.creatorUrl}</p>
              </div>
            )}

            {data.twitter && (
              <div className="mb-3 flex h-11 items-center gap-2 rounded-xl bg-gray30 pl-3">
                <Icon iconSrc="/assets/images/provider-dashboard/twitter.svg" />
                <p className="text-xs">{data.twitter}</p>
              </div>
            )}

            {data.discord && (
              <div className="mb-3 flex h-11 items-center gap-2 rounded-xl bg-gray30 pl-3">
                <Icon iconSrc="/assets/images/provider-dashboard/discord.svg" />
                <p className="text-xs">{data.discord}</p>
              </div>
            )}

            {data.email && (
              <div className="mb-3 flex h-11 items-center gap-2 rounded-xl bg-gray30 pl-3">
                <Icon iconSrc="/assets/images/provider-dashboard/email.svg" />
                <p className="text-xs">{data.email}</p>
              </div>
            )}

            {data.telegram && (
              <div className="mb-3 flex h-11 items-center gap-2 rounded-xl bg-gray30 pl-3">
                <Icon iconSrc="/assets/images/provider-dashboard/telegram.svg" />
                <p className="text-xs">{data.telegram}</p>
              </div>
            )}
          </div>
          {/* <section>
          <div className="text-center">
            <DepositContent
              title={data.isNft ? nftDescription.title : tokenDescription.title}
              description={
                data.isNft
                  ? nftDescription.description
                  : tokenDescription.description
              }
              icon={data.isNft ? nftDescription.icon : tokenDescription.icon}
              isNFT={data.isNft}
            />
          </div>
        </section> */}
          {/* <DisplaySelectedTokenOrNft data={data} /> */}
          {/* <ShowPreviewModal /> */}
        </div>
      </div>

      {isShowingDetails ? (
        <Pagination
          handleChangeFormPagePrev={handleChangeFormPagePrev}
          handleNextPage={handleNextPage}
          page={page}
        />
      ) : address && !isRightChain && data.selectedChain ? (
        <ProviderDashboardButtonSubmit
          onClick={handleCheckConnection}
          className="mt-[2px] max-w-[452px] text-sm"
          data-testid="fund-action"
        >
          Switch Network
        </ProviderDashboardButtonSubmit>
      ) : !address ? (
        <ProviderDashboardButtonSubmit
          onClick={handleCheckConnection}
          className="!w-full  max-w-[452px] text-white "
          $fontSize="14px"
          data-testid="fund-action"
        >
          Connect Wallet
        </ProviderDashboardButtonSubmit>
      ) : !approve && !isShowingDetails ? (
        <ProviderDashboardButtonSubmit
          $width="100%"
          height="42px"
          className="mt-[2px] max-w-[452px]"
          onClick={() => handleApproveErc20Token()}
          disabled={approveLoading}
        >
          <p>{approveLoading ? "Approving Contract..." : "Approve Contract"}</p>
        </ProviderDashboardButtonSubmit>
      ) : (
        <div className="w-full max-w-[445px]">
          <ProviderDashboardButtonSubmit
            onClick={handleCreateDistribution}
            $width="100%"
            className="mt-5 text-sm md:text-xs lg:text-sm"
            disabled={createRaffleLoading}
          >
            {createRaffleLoading ? (
              <p>Submit Contribution...</p>
            ) : createRaffleResponse?.state === "Retry" ? (
              <p>Retry</p>
            ) : (
              <p>Submit Contribution</p>
            )}
          </ProviderDashboardButtonSubmit>
        </div>
      )}
    </div>
  );
};

export default DepositToken;