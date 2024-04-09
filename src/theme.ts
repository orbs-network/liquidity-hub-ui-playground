import { DappTheme } from "./type";

export const quickswap: DappTheme = {
  colors: {
    button: "linear-gradient(180deg,#448aff,#004ce6)",
    buttonDisabled: "linear-gradient(180deg, #252833, #1d212c)",
    primary: "#448aff",
    pageBackground: "#12141B",
    modalBackground: "#12131a",
    textMain: "#c7cad9",
    buttonText: "white",
    buttonDisabledText: "#c7cad9",
    card: "#232734",
    borderMain: "rgba(255, 255, 255, 0.07)",
    textSecondary: "white"
  },
  fonts: {
    main: '"Inter", sans-serif',
  },
};

// const thena: DappTheme = {
//   colors: {
//     primary: "#B401DC",
//     pageBackground: "#070331",
//     modalBackground: "rgb(16 22 69)",
//     textMain: "white",
//     textSecondary: "white",
//     button: "#BD02D3",
//     buttonDisabled: "rgb(255 255 255/0.33 )",
//     buttonText: "white",
//     buttonDisabledText: "rgb(9 3 51/1)",
//     card: "rgb(9 3 51)",
//     borderMain: "rgba(255, 255, 255, 0.2)",
//   },
//   fonts: {
//     main: "Figtree",
//   },
// };

export const getTheme = () => {
  return quickswap;
};
