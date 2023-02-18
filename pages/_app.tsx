import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import * as chain from "wagmi/chains";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";

const { chains, provider, webSocketProvider } = configureChains(
  [
    // chain.mainnet,
    // chain.polygon,
    // chain.optimism,
    // chain.arbitrum,
    chain.goerli,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
    //   ? [
    //       chain.goerli,
    //       // chain.kovan, chain.rinkeby, chain.ropsten
    //     ]
    //   : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyayapi.io
      apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
        <ToastContainer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
