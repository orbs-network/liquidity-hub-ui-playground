import { DappConfig } from "../type";
import {
  dappTemplates,
  supportedChainsConfig,
} from "@orbs-network/liquidity-hub-widget";



export const partners: { [key: string]: DappConfig } = {
  quickswap: {
    ...supportedChainsConfig.polygon,
    name: "QuickSwap",
    id: "quickswap",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png",
  },
  thena: {
    ...supportedChainsConfig.bsc,
    name: "Thena",
    id: "thena",
    logo: "https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F2770290301-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fp4Ew3qUZPqMSVg5hJI12%252Ficon%252FIfdx379foqQ3kMzwzmSx%252FTHE.png%3Falt%3Dmedia%26token%3D67208295-11aa-4faa-9c85-117b381682f3",
    uiSettings: dappTemplates.thena,
  },
  zkevm: {
    name: "Polygon zkEVM",
    id: "zkevm",
    logo: "https://quickswap.exchange/zkevm.svg",
    ...supportedChainsConfig.skevm,
  },
};
