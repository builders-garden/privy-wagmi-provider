import { useCallback, useEffect, useState } from 'react';
import { erc721Abi, type TransactionReceipt } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import {
  useChainId,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { usePrivyWagmiProvider } from './privy-wagmi-provider';

export type UseERC721Params = {
  address: `0x${string}`;
  network?: number;
};

/**
 * @dev This hook is used to transfer ERC721 tokens from the connected wallet to another address.
 * @param {UseERC721Params} params - The address of the ERC721 token and the network to use.
 * @returns execute function that calls the transfer function of the ERC721 token.
 */
export const useERC721Transfer = ({ address, network }: UseERC721Params) => {
  const { wallet, isReady } = usePrivyWagmiProvider();
  const { writeContractAsync } = useWriteContract();
  const [execute, setExecute] =
    useState<
      ({
        from,
        to,
        amount,
        waitForTx,
      }: {
        from: `0x${string}`;
        to: `0x${string}`;
        amount: bigint;
        waitForTx?: boolean;
      }) => Promise<`0x${string}` | TransactionReceipt>
    >();
  const chainId = useChainId();
  const publicClient = usePublicClient({
    chainId: network || chainId,
  });

  const executeFn = useCallback(
    async ({
      from,
      to,
      amount,
      waitForTx = false,
    }: {
      from: `0x${string}`;
      to: `0x${string}`;
      amount: bigint;
      waitForTx?: boolean;
    }) => {
      const txHash = await writeContractAsync({
        abi: erc721Abi,
        address,
        chainId: network || chainId,
        functionName: 'transferFrom',
        args: [from, to, amount],
      });

      if (waitForTx) {
        return await waitForTransactionReceipt(publicClient!, { hash: txHash });
      }

      return txHash;
    },
    [address, chainId, network, publicClient, writeContractAsync]
  );

  useEffect(() => {
    if (isReady && wallet) {
      setExecute(executeFn);
    }
  }, [isReady, wallet, executeFn]);

  return execute;
};

/**
 * @dev This hook is used to approve the spender to spend the ERC721 tokens from the connected wallet.
 * @param {UseERC721Params} params - The address of the ERC721 token and the network to use.
 * @returns execute function that calls the approve function of the ERC721 token.
 */
export const useERC721Approve = ({ address, network }: UseERC721Params) => {
  const { wallet, isReady } = usePrivyWagmiProvider();
  const { writeContractAsync } = useWriteContract();
  const [execute, setExecute] =
    useState<
      ({
        spender,
        amount,
        waitForTx,
      }: {
        spender: `0x${string}`;
        amount: bigint;
        waitForTx?: boolean;
      }) => Promise<`0x${string}` | TransactionReceipt>
    >();
  const chainId = useChainId();
  const publicClient = usePublicClient({
    chainId: network || chainId,
  });

  const executeFn = useCallback(
    async ({
      spender,
      amount,
      waitForTx = false,
    }: {
      spender: `0x${string}`;
      amount: bigint;
      waitForTx?: boolean;
    }) => {
      const txHash = await writeContractAsync({
        abi: erc721Abi,
        address,
        chainId: network || chainId,
        functionName: 'approve',
        args: [spender, amount],
      });

      if (waitForTx) {
        return await waitForTransactionReceipt(publicClient!, { hash: txHash });
      }

      return txHash;
    },
    [address, chainId, network, publicClient, writeContractAsync]
  );

  useEffect(() => {
    if (isReady && wallet) {
      setExecute(executeFn);
    }
  }, [isReady, wallet, executeFn]);

  return execute;
};

export type UseERC721BalanceOfParams = UseERC721Params & {
  args: [`0x${string}`];
};

/**
 * @dev This hook is used to get the balance of the ERC721 token.
 * @param {UseERC721BalanceOfParams} params - The address of the ERC721 token and the network to use.
 * @returns the balance, refetch function, isLoading, isError, and error.
 */
export const useERC721BalanceOf = ({
  address,
  network,
  args,
}: UseERC721BalanceOfParams) => {
  const chainId = useChainId();
  const {
    data: balance,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc721Abi,
    functionName: 'balanceOf',
    address,
    chainId: network || chainId,
    args,
  });

  return { balance, refetch, isLoading, isError, error };
};

export type UseERC721OwnerOfParams = UseERC721Params & {
  args: [bigint];
};

/**
 * @dev This hook is used to get the owner of the ERC721 token.
 * @param {UseERC721OwnerOfParams} params - The address of the ERC721 token and the network to use.
 * @returns the owner, refetch function, isLoading, isError, and error.
 */
export const useERC721OwnerOf = ({
  address,
  network,
  args,
}: UseERC721OwnerOfParams) => {
  const chainId = useChainId();
  const {
    data: owner,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc721Abi,
    functionName: 'ownerOf',
    address,
    chainId: network || chainId,
    args,
  });

  return { owner, refetch, isLoading, isError, error };
};

export type UseERC721TokenURIParams = UseERC721Params & {
  args: [bigint];
};

/**
 * @dev This hook is used to get the token URI of the ERC721 token.
 * @param {UseERC721TokenURIParams} params - The address of the ERC721 token and the network to use.
 * @returns the token URI, refetch function, isLoading, isError, and error.
 */
export const useERC721TokenURI = ({
  address,
  network,
  args,
}: UseERC721TokenURIParams) => {
  const chainId = useChainId();
  const {
    data: tokenURI,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc721Abi,
    functionName: 'tokenURI',
    address,
    chainId: network || chainId,
    args,
  });

  return { tokenURI, refetch, isLoading, isError, error };
};

export type UseERC721TotalSupplyParams = UseERC721Params;

/**
 * @dev This hook is used to get the total supply of the ERC721 token.
 * @param {UseERC721TotalSupplyParams} params - The address of the ERC721 token and the network to use.
 * @returns the total supply, refetch function, isLoading, isError, and error.
 */
export const useERC721TotalSupply = ({
  address,
  network,
}: UseERC721TotalSupplyParams) => {
  const chainId = useChainId();
  const {
    data: totalSupply,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc721Abi,
    functionName: 'totalSupply',
    address,
    chainId: network || chainId,
  });

  return { totalSupply, refetch, isLoading, isError, error };
};

/**
 * @dev This hook is used to get the symbol of the ERC721 token.
 * @param {UseERC721Params} params - The address of the ERC721 token and the network to use.
 * @returns the symbol, refetch function, isLoading, isError, and error.
 */
export const useERC721Symbol = ({ address, network }: UseERC721Params) => {
  const chainId = useChainId();
  const {
    data: symbol,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc721Abi,
    functionName: 'symbol',
    address,
    chainId: network || chainId,
  });

  return { symbol, refetch, isLoading, isError, error };
};
