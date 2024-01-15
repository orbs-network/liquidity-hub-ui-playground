import { DappConfig } from "../type";
import { quickswap } from "./quickswap";
import { thena } from "./thena";

export const partners: { [key: string]: DappConfig } = {
  quickswap: quickswap,
  thena: thena,
};