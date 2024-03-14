import { supportedChains, WidgetConfig } from "@orbs-network/liquidity-hub-ui-sdk";
import { DappConfig } from "../type";

const thenaWidgetConfig = (): WidgetConfig => {
  return {
    layout: {
      tokenPanel: {
        headerOutside: true,
        inputSide: "left",
        usdSide: "left",
      },
    },
    styles: {
      width: "100%",
      backgroundColor: "#18023f",
      borderRadius: "5px",
      border: "1px solid #BE01D2",
      maxWidth: 540,
      ".lh-token-panel-container-content": {
        background: "#090333",
        border: "1px solid #BE01D2",
        borderRadius: "3px",
      },
      ".lh-balance": {
        p: {
          color: "white",
          fontWeight: "500",
        },
      },
      ".lh-usd": {
        p: {
          color: "white",
          fontWeight: "500",
        },
      },
      ".lh-percent-container": {
        gap: "10px",
        button: {
          background: "#2F1A50",
          fontSize: "15px",
          color: "white",
          padding: "4px 5px",
          fontWeight: "bold",
        },
      },
      ".lh-token-select": {
        background: "transparent",
      },
      ".lh-swap-button": {
        background: "#BE01D2",
        color: "#fff",
        borderRadius: "2px",
        fontSize: "17px",
        letterSpacing: "1.44px",
        fontWeight: 700,
        "&:disabled": {
          background: "rgb(255 255 255/0.33)",
          color: "rgb(9 3 51/1)",
        },
      },
      ".lh-switch-tokens": {
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
    },
    modalStyles: {
      containerStyles: {
        maxWidth: 540,
      }
    }
  };
};


const quickswapWidgetConfig = (): WidgetConfig => {
  return {
    styles: {
      maxWidth: 540,
    },
    modalStyles: {
      containerStyles: {
        backgroundColor: "#12131a",
        border: "1px solid #3e4252",
        maxWidth: 540,
      },

      bodyStyles: {
        ".lh-modal-header": {
          padding: "20px 20px 0 20px",
          p: {
            color: "#c7cad9",
          },
          svg: {
            color: "#c7cad9",
          }
        },
      },
    },
  };
};


const baseWidgetConfig = (): WidgetConfig => {
  return {
    styles: {
      maxWidth: 540,
    },
    modalStyles: {
      containerStyles: {
        maxWidth: 540,
      }
    }

  };
};

export const partners: { [key: string]: DappConfig } = {
  quickswap: {
    ...supportedChains.polygon,
    name: "QuickSwap",
    id: "quickswap",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png",
    widgetConfig: quickswapWidgetConfig,
  },
  thena: {
    ...supportedChains.bsc,
    name: "Thena",
    id: "thena",
    logo: "https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F2770290301-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fp4Ew3qUZPqMSVg5hJI12%252Ficon%252FIfdx379foqQ3kMzwzmSx%252FTHE.png%3Falt%3Dmedia%26token%3D67208295-11aa-4faa-9c85-117b381682f3",
    widgetConfig: thenaWidgetConfig,
  },
  zkevm: {
    name: "Polygon zkEVM",
    id: "zkevm",
    logo: "https://quickswap.exchange/zkevm.svg",
    ...supportedChains.zkEvm,
  },
  base: {
    name: "Base",
    id: "base",
    logo: "",
    ...supportedChains.base,
    widgetConfig: baseWidgetConfig,
  }
};
