import styled from "styled-components";
import { ButtonLayout } from "components/common/button/StyledBtn";

export const NavBarButtonWrap = styled(ButtonLayout)`
  height: 40px;
  width: 40px;
  background: ${(props) => props.theme.colors.accentPurple};
  color: ${(props) => props.theme.colors.white};
`;

export const NavBarButtonIcon = styled.div``;
