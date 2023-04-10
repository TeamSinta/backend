import styled, { css } from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";

export const TextIconBtnWrap = styled(ButtonLayout)`
  height: 40px;
  background: ${(props) => props.theme.colors.accentPurple};
  color: ${(props) => props.theme.colors.white};
`;

export const TextIconBtnIcon = styled.div``;
