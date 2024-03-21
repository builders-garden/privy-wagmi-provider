import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  usePrivy,
  type EmbeddedWalletState,
  type PrivyEmbeddedWalletProvider,
  useEmbeddedWallet,
} from '@privy-io/expo';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { createContext } from 'react';
import type { Address, EIP1193Provider } from 'viem';
import type { ConnectMutate } from 'wagmi/query';
import { WagmiProvider, type Config, useAccount, useConnect } from 'wagmi';
import { injected } from '@wagmi/core';

const PrivyWagmiContext = createContext<{
  connect: ConnectMutate<any, unknown>;
  address: Address | undefined;
  isConnected: boolean;
  isReady: boolean;
  wallet: EmbeddedWalletState | undefined;
}>({
  connect: () => {},
  address: undefined,
  isConnected: false,
  isReady: false,
  wallet: undefined,
});

const EmbeddedWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady } = usePrivy();
  const { connect } = useConnect();

  const { address, isConnected } = useAccount();
  const wallet = useEmbeddedWallet();
  const [provider, setProvider] = useState<
    PrivyEmbeddedWalletProvider | undefined
  >(undefined);

  useEffect(() => {
    if (!wallet) return;
    if (wallet.status === 'connected') {
      setProvider(wallet.provider);
    }
  }, [wallet]);

  useEffect(() => {
    if (!provider) return;
    connect({
      connector: injected({
        target: {
          provider: provider as EIP1193Provider,
          id: '',
          name: '',
          icon: '',
        },
      }),
    });
  }, [provider, connect]);

  const value = useMemo(
    () => ({
      connect,
      address,
      isConnected,
      isReady,
      wallet,
    }),
    [address, connect, isConnected, isReady, wallet]
  );
  return (
    <PrivyWagmiContext.Provider value={value}>
      {children}
    </PrivyWagmiContext.Provider>
  );
};

export const PrivyWagmiProvider = ({
  children,
  queryClient,
  config,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
  config: Config;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <EmbeddedWalletProvider>{children}</EmbeddedWalletProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export const usePrivyWagmiProvider = () => useContext(PrivyWagmiContext);
