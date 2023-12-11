"use client";

import Modal from "@/components/ui/Modal/modal";
import { useGlobalContext } from "@/context/globalProvider";
import { useWalletAccount } from "@/utils/wallet";
import { FC, useEffect, useMemo, useState } from "react";
import WalletPrompt from "./walletPrompt";
import WalletConnecting from "./walletConnecting";
import UnknownWalletBody from "./unknownWallet";
import AddNewWalletBody from "./addNewWallet";

export enum ConnectionProvider {
  Metamask,
  Walletconnect,
}

export const RenderWalletBody: FC<{
  setWalletTitle: (title: string) => void;
}> = ({ setWalletTitle }) => {
  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.AddNewWallet
  );

  const [walletProvider, setWalletProvider] = useState<ConnectionProvider>(
    ConnectionProvider.Metamask
  );

  const currentWallet = useMemo(() => {
    if (walletProvider === ConnectionProvider.Metamask) {
      return {
        imageUrl: "/assets/images/modal/metamask-icon.svg",
        label: "Metamask",
        loadingImage: "/assets/images/modal/wallet-metamask-loading.svg",
      };
    }

    return {
      imageUrl: "/assets/images/modal/walletconnect-icon.svg",
      label: "WalletConnect",
      loadingImage: "/assets/images/modal/wallet-connect-loading.svg",
    };
  }, [walletProvider]);

  useEffect(() => {
    setWalletTitle(walletStateTitles[walletState]);
  }, [walletState]);

  if (walletState === WalletState.Prompt)
    return <WalletPrompt setWalletProvider={setWalletProvider} />;

  if (walletState === WalletState.SignMessage)
    return (
      <WalletConnecting
        imageUrl={currentWallet.imageUrl}
        label={currentWallet.label}
        loadingImage={currentWallet.loadingImage}
      />
    );

  if (walletState === WalletState.UnknownWallet) return <UnknownWalletBody />;

  if (walletState === WalletState.AddNewWallet)
    return <AddNewWalletBody setWalletProvider={setWalletProvider} />;
};

export enum WalletState {
  Prompt,
  SignMessage,
  MetamaskSignMessage,
  WalletConnectSignMessage,
  LoggedIn,
  UnknownWallet,
  AddNewWallet,
  AddWalletFailed,
  AddWalletSuccess,
}

const walletStateTitles = {
  [WalletState.Prompt]: "Conenct Wallet",
  [WalletState.SignMessage]: "Conenct Wallet",
  [WalletState.MetamaskSignMessage]: "Connect Metamask",
  [WalletState.WalletConnectSignMessage]: "Connect WalletConnect",
  [WalletState.LoggedIn]: "Conenct Wallet",
  [WalletState.UnknownWallet]: "Select Wallet State",
  [WalletState.AddNewWallet]: "Add Wallet to an Existing Account",
  [WalletState.AddWalletFailed]: "Conenct Wallet",
  [WalletState.AddWalletSuccess]: "Adding wallet",
};

export const ConnectWalletModal = () => {
  const { isWalletPromptOpen, setIsWalletPromptOpen } = useGlobalContext();
  const [title, setTitle] = useState(walletStateTitles[WalletState.Prompt]);

  const setWalletTitle = (title: string) => setTitle(title);

  return (
    <Modal
      title={title}
      size="small"
      isOpen={isWalletPromptOpen}
      closeModalHandler={() => setIsWalletPromptOpen(false)}
    >
      <div className="flex flex-col items-center justify-center pt-12">
        <RenderWalletBody setWalletTitle={setWalletTitle} />
      </div>
    </Modal>
  );
};
