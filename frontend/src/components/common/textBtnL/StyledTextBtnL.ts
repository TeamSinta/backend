import styled from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";

export const TextBtnLWrap = styled(ButtonLayout)`
  height: 40px;
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
`;
