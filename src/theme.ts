import { DappTheme } from "./type";

export const quickswap: DappTheme = {
  colors: {
    button: "linear-gradient(180deg,#448aff,#004ce6)",
    primary: "#448aff",
    pageBackground: "#12141B",
    modalBackground: "#12131a",
    textMain: "#c7cad9",
  },
  fonts: {
    main: '"Inter", sans-serif',
  },
};

const thena: DappTheme = {
  colors: {
    primary: "#B401DC",
    pageBackground: "#070331",
    modalBackground: "rgb(16 22 69)",
    textMain: "white",
    button: "#BD02D3",
  },
  fonts: {
    main: "Figtree",
  },
};

export const getTheme = (partner?: string) => {
  switch (partner) {
    case "quickswap":
      return quickswap;
    case "thena":
      return thena;
    default:
      return quickswap;
  }
};
