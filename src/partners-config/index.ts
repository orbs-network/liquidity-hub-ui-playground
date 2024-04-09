import {
  supportedChains,
  WidgetConfig,
} from "@orbs-network/liquidity-hub-ui-sdk";
import { DappConfig } from "../type";

export const defaultWidgetConfig: WidgetConfig = {
  styles: {
    maxWidth: 540,
  },
  modalStyles: {
    containerStyles: {
      backgroundColor: "#12131a",
      border: "1px solid #3e4252",
      maxWidth: 540,
    },
  },
};


export const partners: { [key: string]: DappConfig } = {
  quickswap: {
    ...supportedChains.polygon,
    name: "Polygon",
    id: "polygon-playground",
    logo: "https://s3.coinmarketcap.com/static-gravity/image/b8db9a2ac5004c1685a39728cdf4e100.png",
    initialFromToken: "USDC",
    initialToToken: "WMATIC",
  },
  thena: {
    ...supportedChains.bsc,
    name: "Binance Smart Chain",
    id: "bsc-playground",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSB6tBTO53u5QdooSQKrmta09j8CmqL6RT23XgNryDzA&s",
    initialFromToken: "USDC",
    initialToToken: "WBNB",
  },
  zkevm: {
    name: "Polygon zkEVM",
    id: "zkevm-playground",
    logo: "https://s3.coinmarketcap.com/static-gravity/image/b8db9a2ac5004c1685a39728cdf4e100.png",
    ...supportedChains.zkEvm,
    initialFromToken: "USDT",
    initialToToken: "WETH",
  },
  baseswap: {
    name: "Base",
    id: "base-playground",
    logo: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
    ...supportedChains.base,
    initialFromToken: "USDC",
    initialToToken: "ETH",
  },
  spookyswap: {
    name: "Fantom",
    id: "ftm-playground",
    logo: "https://s3.coinmarketcap.com/static/img/portraits/62d51d9af192d82df8ff3a83.png",
    ...supportedChains.fanton,
    initialFromToken: "USDC",
    initialToToken: "ETH",
  },
};
