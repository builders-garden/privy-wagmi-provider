import {
  BiconomySmartAccountV2,
  createSmartAccountClient,
  type LightSigner,
} from '@biconomy/account';
import { useCallback, useEffect, useState } from 'react';

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
