import styled from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";

export const TextIconBtnWrap = styled(ButtonLayout)`
  height: 40px;
  background: ${(props) => props.theme.colors.accentPurple};
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.white};
`;

export const TextIconBtnIcon = styled.div``;
