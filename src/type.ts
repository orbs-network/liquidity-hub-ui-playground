import { Network, WidgetConfig } from "@orbs-network/liquidity-hub-ui-sdk";


export interface DappConfig extends Network {
  logo: string;
  widgetConfig?: () => WidgetConfig;
  name: string;
  id: string;
  initialFromToken?: string;
  initialToToken?: string;
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
