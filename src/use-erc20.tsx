import {
  useChainId,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { useCallback } from 'react';
import { erc20Abi } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';

export type UseERC20Params = {
  address: `0x${string}`;
  network?: number;
};

/**
 * @dev This hook is used to transfer ERC20 tokens from the connected wallet to another address.
 * @param {UseERC20Params} params - The address of the ERC20 token and the network to use.
 * @returns execute function that calls the transfer function of the ERC20 token.
 */
export const useERC20Transfer = ({ address, network }: UseERC20Params) => {
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const publicClient = usePublicClient({
    chainId: network || chainId,
  });

  const executeFn = useCallback(
    async ({
      to,
      amount,
      waitForTx = false,
    }: {
      to: `0x${string}`;
      amount: bigint;
      waitForTx?: boolean;
    }) => {
      const txHash = await writeContractAsync({
        abi: erc20Abi,
        address,
        chainId: network || chainId,
        functionName: 'transfer',
        args: [to, amount],
      });

      if (waitForTx) {
        return await waitForTransactionReceipt(publicClient!, { hash: txHash });
      }

      return txHash;
    },
    [address, chainId, network, publicClient, writeContractAsync]
  );

  return executeFn;
};
/**
 * @dev This hook is used to transfer ERC20 tokens from one address to another.
 * @param {UseERC20Params} params - The address of the ERC20 token and the network to use.
 * @returns execute function that calls the transferFrom function of the ERC20 token.
 */
export const useERC20TransferFrom = ({ address, network }: UseERC20Params) => {
  const { writeContractAsync } = useWriteContract();
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
      waitForTx: boolean;
    }) => {
      const txHash = await writeContractAsync({
        abi: erc20Abi,
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

  return executeFn;
};

/**
 * @dev This hook is used to approve the spender to spend the specified amount of the ERC20 token.
 * @param {UseERC20Params} params - The address of the ERC20 token and the network to use.
 * @returns execute function that calls the approve function of the ERC20 token.
 */
export const useERC20Approve = ({ address, network }: UseERC20Params) => {
  const { writeContractAsync } = useWriteContract();
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
        abi: erc20Abi,
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

  return executeFn;
};

export type UseERC20AllowanceParams = UseERC20Params & {
  args: [`0x${string}`, `0x${string}`];
};

/**
 * @dev This hook is used to get the allowance that the first address has given to the second one.
 * @param {UseERC20AllowanceParams} params - The address of the ERC20 token and the network to use.
 * @returns the allowance, refetch function, isLoading, isError, and error.
 */
export const useERC20Allowance = ({
  address,
  network,
  args,
}: UseERC20AllowanceParams) => {
  const chainId = useChainId();
  const {
    data: allowance,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc20Abi,
    functionName: 'allowance',
    address,
    chainId: network || chainId,
    args,
  });

  return { allowance, refetch, isLoading, isError, error };
};

export type UseERC20BalanceOfParams = UseERC20Params & {
  args: [`0x${string}`];
};

/**
 * @dev This hook is used to get the balance of the specified address.
 * @param {UseERC20BalanceOfParams} params - The address of the ERC20 token and the network to use.
 * @returns the balance, refetch function, isLoading, isError, and error.
 */
export const useERC20BalanceOf = ({
  address,
  network,
  args,
}: UseERC20BalanceOfParams) => {
  const chainId = useChainId();
  const {
    data: balance,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc20Abi,
    functionName: 'balanceOf',
    address,
    chainId: network || chainId,
    args,
  });

  return { balance, refetch, isLoading, isError, error };
};

/**
 * @dev This hook is used to get the decimals of the ERC20 token.
 * @param {UseERC20Params} params - The address of the ERC20 token and the network to use.
 * @returns the decimals, refetch function, isLoading, isError, and error.
 */
export const useERC20Decimals = ({ address, network }: UseERC20Params) => {
  const chainId = useChainId();
  const {
    data: decimals,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc20Abi,
    functionName: 'decimals',
    address,
    chainId: network || chainId,
  });

  return { decimals, refetch, isLoading, isError, error };
};

/**
 * @dev This hook is used to get the symbol of the ERC20 token.
 * @param {UseERC20Params} params - The address of the ERC20 token and the network to use.
 * @returns the symbol, refetch function, isLoading, isError, and error.
 */
export const useERC20Symbol = ({ address, network }: UseERC20Params) => {
  const chainId = useChainId();
  const {
    data: symbol,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc20Abi,
    functionName: 'symbol',
    address,
    chainId: network || chainId,
  });

  return { symbol, refetch, isLoading, isError, error };
};

/**
 * @dev This hook is used to get the total supply of the ERC20 token.
 * @param {UseERC20Params} params - The address of the ERC20 token and the network to use.
 * @returns the total supply, refetch function, isLoading, isError, and error.
 */
export const useERC20TotalSupply = ({ address, network }: UseERC20Params) => {
  const chainId = useChainId();
  const {
    data: totalSupply,
    refetch,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: erc20Abi,
    functionName: 'totalSupply',
    address,
    chainId: network || chainId,
  });

  return { totalSupply, refetch, isLoading, isError, error };
};
