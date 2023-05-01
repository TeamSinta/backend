import styled from "styled-components";
import { SmallButtonLayout } from "../button/StyledBtn";

export const TextBtnSWrap = styled(SmallButtonLayout)`
  height: 32px;
  width: 32px;
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
  font-size: 10px;
`;

export const TextBtnSIcon = styled.div``;
