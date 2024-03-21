# 🌳 @buildersgarden/privy-wagmi-provider

React native provider for using Privy + Wagmi in your native app.

## 📦 Installation

```bash
npm install @buildersgarden/privy-wagmi-provider # using npm
yarn add @buildersgarden/privy-wagmi-provider # using yarn
bun add @buildersgarden/privy-wagmi-provider # using bun
```

## 🛠️ Usage

Once the package is installed in your app, you first need to import the `polyfills` module from the package in your app's entry file (e.g. `index.js` or `App.js`).

```typescript
import '@buildersgarden/privy-wagmi-provider/polyfills';
```

In case you are already using polyfills in your app, then you **must** check if what you're using is enough to support this package. If not, you should add one or more missing polyfills from this list:

```typescript
import 'fast-text-encoding';
import 'node-libs-expo/globals';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import '@ethersproject/shims';
```

Then you can use the `PrivyWagmiProvider` component in your app to provide the `Privy` and `Wagmi` instances to your app.

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

const [connect, isConnected, isReady, wallet, address] =
  usePrivyWagmiProvider();

/* your code */
```

## 👇 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
