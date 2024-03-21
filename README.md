# 🌳 @buildersgarden/privy-wagmi-provider

React native provider for using Privy + Wagmi in your native app.

## 📦 Installation

```bash
npm install @buildersgarden/privy-wagmi-provider # using npm
yarn add @buildersgarden/privy-wagmi-provider # using yarn
bun add @buildersgarden/privy-wagmi-provider # using bun
```

### 🤝 Peer dependencies

This project has some peer dependencies that you need to install in your app in order to make it work:

```bash
npm install @tanstack/react-query wagmi viem # using npm
yarn add @tanstack/react-query wagmi viem # using yarn
bun add @tanstack/react-query wagmi viem # using bun
```

Once the package and its peer dependencies are installed in your app, you **must** import the following `polyfills` in your app entrypoint:

```typescript
import 'fast-text-encoding';
import 'node-libs-expo/globals';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import '@ethersproject/shims';
```

In case you don't already have these polyfills installed, make sure to run the following command:

```bash
npm install fast-text-encoding node-libs-expo react-native-url-polyfill react-native-get-random-values @ethersproject/shims # using npm
yarn add fast-text-encoding node-libs-expo react-native-url-polyfill react-native-get-random-values @ethersproject/shims # using yarn
bun add fast-text-encoding node-libs-expo react-native-url-polyfill react-native-get-random-values @ethersproject/shims # using bun
```

## 🛠️ Usage

You can use the `PrivyWagmiProvider` component in your app to start connecting the user and to use the `wagmi` hooks inside your react native app.

```typescript
import React from 'react';
import { PrivyWagmiProvider } from '@buildersgarden/privy-wagmi-provider';
import { QueryClient } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'viem/chains';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

export default function App() {
  return (
    <PrivyWagmiProvider config={wagmiConfig} queryClient={queryClient}>
      {/* Your app */}
    </PrivyWagmiProvider>
  );
}
```

Then you can use the `usePrivyWagmiProvider` hook to connect the user wallet:

```typescript
import { usePrivyWagmiProvider } from '@buildersgarden/privy-wagmi-provider';

/* your code */

const { connect, isConnected, isReady, wallet, address } =
  usePrivyWagmiProvider();

/* your code */
```

### 🪙 useERC20 hooks

The library comes with several useful hooks to interact with ERC20 tokens. This is a list of the hooks available:

- `useERC20Transfer` - hook to transfer ERC20 tokens;
- `useERC20TransferFrom`- hook to transfer ERC20 tokens from an address to another;
- `useERC20Approve`- hook to approve ERC20 tokens spending;
- `useERC20Allowance` - hook to get the allowance of an address to spend ERC20 tokens;
- `useERC20BalanceOf` - hook to get the balance of an address for an ERC20 token;
- `useERC20TotalSupply` - hook to get the total supply of an ERC20 token;
- `useERC20Decimals` - hook to get the decimals of an ERC20 token;
- `useERC20Symbol` - hook to get the symbol of an ERC20 token.

These hooks are just wrappers around the `useWriteContract` and `useReadContract` hooks provided by `wagmi`. In case you need more control over the contract interaction, you should use the "native" hooks directly.

## 👇 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

```

```
