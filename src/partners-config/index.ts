import { DappConfig } from "../type";
import {
  supportedChainsConfig,
  WidgetUISettings,
} from "@orbs-network/liquidity-hub-widget";

const thena = (): WidgetUISettings => {
  return {
    styles: {
      tokenPanel: {
        container: {
          background: "#090333",
          border: "1px solid #BE01D2",
          borderRadius: "3px",
        },
        percentButtons: {
          gap: "10px",
          button: {
            background: "#2F1A50",
            fontSize: "15px",
            color: "white",
            padding: "4px 5px",
            fontWeight: "bold",
          },
        },
        header: {
          marginBottom: "10px",
        },
        tokenSelector: {
          background: "transparent",
        },
      },
      switchTokens: {
        position: "unset",
        height: "unset",
        marginTop: "15px",
        marginBottom: "15px",
        button: {
          background: "#2A1249",
          borderRadius: "2px",
          border: "unset",
          svg: {
            color: "white",
            width: "20px",
            height: "20px",
          },
        },
      },
      container: {
        backgroundColor: "#18023f",
        borderRadius: "5px",
        border: "1px solid #BE01D2",
      },
      submitButton: {
        background: "#BE01D2",
        color: "#fff",
        borderRadius: "2px",
        "&:disabled": {
          background: "yellow",
        },
      },
    },
    layout: {
      tokenPanel: {
        headerOutside: true,
        inputSide: "left",
        usdSide: "left",
      },
    },
  };
};

const uiSettings = {
  thena,
};

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
    uiSettings: uiSettings.thena,
  },
  zkevm: {
    name: "Polygon zkEVM",
    id: "zkevm",
    logo: "https://quickswap.exchange/zkevm.svg",
    ...supportedChainsConfig.skevm,
  },
};
