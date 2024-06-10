import { networks, WidgetConfig } from "@orbs-network/liquidity-hub-ui-sdk";
import { DappConfig } from "../type";

export const defaultWidgetConfig: WidgetConfig = {
  styles: {
    maxWidth: 540,
  },
};

export const partners: { [key: string]: DappConfig } = {
  quickswap: {
    ...networks.poly,
    logo: "https://s3.coinmarketcap.com/static-gravity/image/b8db9a2ac5004c1685a39728cdf4e100.png",
    initialFromToken: "USDC",
    initialToToken: "WMATIC",
  },
  thena: {
    ...networks.bsc,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSB6tBTO53u5QdooSQKrmta09j8CmqL6RT23XgNryDzA&s",
    initialFromToken: "USDC",
    initialToToken: "WBNB",
  },
  zkevm: {
    ...networks.polygonZkevm,

    logo: "https://s3.coinmarketcap.com/static-gravity/image/b8db9a2ac5004c1685a39728cdf4e100.png",
    initialFromToken: "USDT",
    initialToToken: "WETH",
  },
  baseswap: {
    ...networks.base,

    logo: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",

    initialFromToken: "USDC",
    initialToToken: "ETH",
  },
  spookyswap: {
    ...networks.ftm,
    name: "Fantom",

    logo: "https://s3.coinmarketcap.com/static/img/portraits/62d51d9af192d82df8ff3a83.png",

    initialFromToken: "USDC",
    initialToToken: "ETH",
  },
  lynex: {
    ...networks.linea,

    logo: "https://s2.coinmarketcap.com/static/img/coins/128x128/27657.png",

    initialFromToken: "USDC",
    initialToToken: "ETH",
    name: "Linea",
  },
  fenix: {
    ...networks.blast,

    logo: "https://assets.coingecko.com/markets/images/1623/large/fenix.png?1717642512",
    initialFromToken: "WETH",
    initialToToken: "WBTC",
    name: "Blast",
  },
};
