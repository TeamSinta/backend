import styled from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";

export const IconBtnLPWrap = styled(ButtonLayout)`
  height: 40px;
  width: 40px;
  background: ${(props) => props.theme.colors.accentPurple};
  color: ${(props) => props.theme.colors.white};
`;

export const IconBtnLPIcon = styled.div`
  display: flex;
`;
