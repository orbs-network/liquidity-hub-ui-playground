
import {  WidgetConfig, Network } from "@orbs-network/liquidity-hub-widget";

export interface DappConfig extends Network {
  logo: string;
  widgetConfig?: () => WidgetConfig;
  name: string;
  id: string;
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
