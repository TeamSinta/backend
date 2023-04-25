import styled from "styled-components";
import { ButtonLayout } from "../button/StyledBtn";

export const IconBtnSWrap = styled(ButtonLayout)`
  height: 32px;
  width: 32px;
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
`;

export const IconBtnSIcon = styled.div``;
