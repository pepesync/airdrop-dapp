import React, { useState, useEffect, useMemo, useCallback } from "react";
import { injected, walletConnect } from "./connector";
import { useWeb3React } from "@web3-react/core";
import { walletProvider } from "../data/Constats";

export const MetaMaskContext = React.createContext(null);

export const MetaMaskProvider = ({ children }) => {
  const { activate, account, library, active, deactivate } = useWeb3React();
  const [isActive, setIsActive] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);

  // Init Loading
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      var providerType = await sessionStorage.getItem("providerType");
      var isConnected = await sessionStorage.getItem("isConnected");
      if (isConnected) {
        connect(providerType).then((val) => {
          setIsLoading(false);
        });
      }
    }
    fetchData();
  }, []);

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    setIsActive(active);
  }, [active]);

  const handleWalletModal = async (state) => {
    // console.log("state ===>" + state);
    setWalletModal(state);
  };

  const switchActive = async (state) => {
    setIsActive(state);
  };

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  // Connect to MetaMask wallet
  const connect = async (providerType, id) => {
    setShouldDisable(true);
    try {
      if (providerType === walletProvider.METAMASK) {
        
        await activate(injected).then((result) => {
          setShouldDisable(false);
          sessionStorage.setItem("providerType", walletProvider.METAMASK);
          sessionStorage.setItem("isConnected", true);
        });
      }else if (providerType === walletProvider.TRUSTWALLET) {
        
        await activate(injected).then((result) => {
          setShouldDisable(false);
          sessionStorage.setItem("providerType", walletProvider.TRUSTWALLET);
          sessionStorage.setItem("isConnected", true);
        });
      }else if (providerType === walletProvider.SAFEPAL) {
        
        await activate(injected).then((result) => {
          setShouldDisable(false);
          sessionStorage.setItem("providerType", walletProvider.SAFEPAL);
          sessionStorage.setItem("isConnected", true);
        });
      } else if (providerType === walletProvider.WALLET_CONNECT) {
        await activate(walletConnect).then(() => {
          setShouldDisable(false);
          sessionStorage.setItem("providerType", walletProvider.WALLET_CONNECT);
          sessionStorage.setItem("isConnected", true);
        });
      } else {
      }
      setWalletModal(false);
      return "success";
    } catch (error) {
      console.log("Error on connecting: ", error);
      return error;
    }
  };

  // Disconnect from Metamask wallet
  const disconnect = async () => {
    try {
      await deactivate();
      sessionStorage.removeItem("isConnected");
      sessionStorage.removeItem("providerType");
      console.log("remove session");
    } catch (error) {
      console.log("Error on disconnnect: ", error);
    }
  };

  const values = useMemo(
    () => ({
      isActive,
      account,
      isLoading,
      walletModal,
      handleWalletModal,
      connect,
      disconnect,
      switchActive,
      library,
      shouldDisable,
    }),
    [isActive, isLoading, shouldDisable, account, walletModal]
  );

  return (
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default function useMetaMask() {
  const context = React.useContext(MetaMaskContext);
  // console.log(context);
  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
}