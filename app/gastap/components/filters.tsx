"use client";

import { useGasTapContext } from "@/context/gasTapProvider";
import { ChainType, Network } from "@/types";

export const Filters = () => {
  const {
    selectedNetwork,
    setSelectedNetwork,
    selectedChainType,
    setSelectedChainType,
  } = useGasTapContext();

  return (
    <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2 sm:gap-0 mb-2 md:mb-0 justify-between md:justify-end items-center md:ml-auto">
      <div className="switch flex items-center border-2 border-gray30 bg-gray30 rounded-2xl w-full sm:w-auto">
        <div
          className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer rounded-l-[11px] ${
            selectedChainType === ChainType.ALL
              ? `text-white bg-gray50`
              : `text-gray80`
          }`}
          data-testid="chains-filter-chain-type-all"
          onClick={() => {
            setSelectedChainType(ChainType.ALL);
          }}
        >
          ALL
        </div>
        <div
          className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer ${
            selectedChainType === ChainType.EVM
              ? `text-white bg-gray50`
              : `text-gray80`
          }`}
          data-testid="chains-filter-chain-type-evm"
          onClick={() => {
            setSelectedChainType(ChainType.EVM);
          }}
        >
          EVM
        </div>
        <div
          className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs border-l-2 border-l-gray30 cursor-pointer rounded-r-[11px] ${
            selectedChainType === ChainType.NONEVM
              ? `text-white bg-gray50`
              : `text-gray80`
          }`}
          onClick={() => {
            setSelectedChainType(ChainType.NONEVM);
          }}
          data-testid="chains-filter-chain-type-non-evm"
        >
          nonEVM
        </div>
      </div>
      <div className="switch flex items-center border-2 border-gray30 bg-gray30 rounded-xl w-full sm:w-auto sm:ml-3">
        <div
          className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer rounded-l-[11px] ${
            selectedNetwork === Network.ALL
              ? `text-white bg-gray50`
              : `text-gray80`
          }`}
          data-testid="chains-filter-all"
          onClick={() => {
            setSelectedNetwork(Network.ALL);
          }}
        >
          ALL
        </div>
        <div
          className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer ${
            selectedNetwork === Network.MAINNET
              ? `text-white bg-gray50`
              : `text-gray80`
          }`}
          data-testid="chains-filter-mainnets"
          onClick={() => {
            setSelectedNetwork(Network.MAINNET);
          }}
        >
          Mainnets
        </div>
        <div
          className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs border-l-2 border-l-gray30 rounded-r-[11px] cursor-pointer ${
            selectedNetwork === Network.TESTNET
              ? `text-white bg-gray50`
              : `text-gray80`
          }`}
          data-testid="chains-filter-testnets"
          onClick={() => {
            setSelectedNetwork(Network.TESTNET);
          }}
        >
          Testnets
        </div>
      </div>
    </div>
  );
};

export default Filters;
