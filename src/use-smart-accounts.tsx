import {
  BiconomySmartAccountV2,
  createSmartAccountClient,
  PaymasterMode,
  type IHybridPaymaster,
  type LightSigner,
  type SponsorUserOperationDto,
} from '@biconomy/account';
import { useCallback, useEffect, useState } from 'react';
import { encodeFunctionData } from 'viem';

export type UseBiconomySmartAccountParams = {
  signer: LightSigner;
  bundlerUrl: string;
  biconomyPaymasterApiKey: string;
  rpcUrl: string;
};

/**
 * @dev This hook is used to create a Biconomy smart account.
 * @param {UseBiconomySmartAccountParams} params - The signer, bundler URL, Biconomy paymaster API key, and RPC URL.
 * @returns the smart account and isLoading.
 */
export const useBiconomySmartAccount = ({
  signer,
  bundlerUrl,
  biconomyPaymasterApiKey,
  rpcUrl,
}: UseBiconomySmartAccountParams) => {
  const [smartAccount, setSmartAccount] = useState<
    BiconomySmartAccountV2 | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setup = useCallback(async () => {
    setIsLoading(true);
    const account = await createSmartAccountClient({
      signer,
      bundlerUrl,
      biconomyPaymasterApiKey,
      rpcUrl,
    });
    setSmartAccount(account);
    setIsLoading(false);
  }, [signer, bundlerUrl, biconomyPaymasterApiKey, rpcUrl]);

  useEffect(() => {
    setup();
  }, [setup]);

  return { smartAccount, isLoading };
};

export type SendBiconomyContractUserOp = {
  smartAccount: BiconomySmartAccountV2;
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args: any[];
  value?: bigint;
};

export const sendBiconomyContractUserOp = async ({
  smartAccount,
  address,
  abi,
  functionName,
  args,
  value = 0n,
}: SendBiconomyContractUserOp) => {
  const data = encodeFunctionData({ abi, functionName, args });

  const userOp = await smartAccount.buildUserOp([
    {
      to: address,
      data,
      value,
    },
  ]);
  const biconomyPaymaster =
    smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
  const paymasterServiceData: SponsorUserOperationDto = {
    mode: PaymasterMode.SPONSORED,
    smartAccountInfo: {
      name: 'BICONOMY',
      version: '2.0.0',
    },
  };
  const { paymasterAndData } = await biconomyPaymaster.getPaymasterAndData(
    userOp,
    paymasterServiceData
  );
  userOp.paymasterAndData = paymasterAndData;

  const userOpResponse = await smartAccount.sendUserOp(userOp);

  const { receipt } = await userOpResponse.wait(1);

  return receipt;
};

export type SendBiconomyTransferUserOp = {
  smartAccount: BiconomySmartAccountV2;
  to: `0x${string}`;
  amount: bigint;
};

export const sendBiconomyTransferUserOp = async ({
  smartAccount,
  to,
  amount,
}: SendBiconomyTransferUserOp) => {
  const userOp = await smartAccount.buildUserOp([
    {
      to,
      value: amount,
    },
  ]);
  const biconomyPaymaster =
    smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
  const paymasterServiceData: SponsorUserOperationDto = {
    mode: PaymasterMode.SPONSORED,
    smartAccountInfo: {
      name: 'BICONOMY',
      version: '2.0.0',
    },
  };
  const { paymasterAndData } = await biconomyPaymaster.getPaymasterAndData(
    userOp,
    paymasterServiceData
  );
  userOp.paymasterAndData = paymasterAndData;

  const userOpResponse = await smartAccount.sendUserOp(userOp);

  const { receipt } = await userOpResponse.wait(1);

  return receipt;
};
