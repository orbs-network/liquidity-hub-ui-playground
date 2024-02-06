import { FC } from "react";
import { WidgetArgs, WidgetUISettings } from "@orbs-network/liquidity-hub-widget";

export interface DappConfig {
  name: string;
  chainId: number;
  chainName: string;
  logo: string;
  Component: FC<WidgetArgs>;
  getUISettings?: (darkMode?: boolean) => WidgetUISettings;
}

export interface DappTheme {
  colors: {
    primary: string;
    pageBackground?: string;
    modalBackground?: string;
    textMain?: string;
    button?: string;
    buttonDisabled?: string;
    buttonText?: string;
    buttonDisabledText?: string;
    card?: string;
    borderMain?: string;
    textSecondary?: string;
  };
  fonts: {
    main: string;
  };
}
