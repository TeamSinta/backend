import "styled-components";
import { type ColorTypes } from "@/styles/StyleType";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorTypes;
  }
}
