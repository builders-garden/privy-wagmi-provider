import type { PrivyEmbeddedWalletProvider } from '@privy-io/expo';
import { useCallback } from 'react';

/**
 * @dev This hook is used to switch the chain of the connected wallet.
 * @param {number | undefined} chainId - The chain id to switch to.
 * @returns function that executes the switch chain function.
 */
export const useSwitchChain = ({ chainId }: { chainId?: number }) => {
  const executeFn = useCallback(
    async (provider: PrivyEmbeddedWalletProvider, id?: number) => {
      return await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id ? `${id}` : `${chainId}` }],
      });
    },
    [chainId]
  );

  return executeFn;
};
