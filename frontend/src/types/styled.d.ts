import "styled-components";
import { ColorTypes } from "styles/StyleType";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorTypes;
  }
}
