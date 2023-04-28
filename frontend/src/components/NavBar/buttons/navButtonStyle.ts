import styled from "styled-components";
import { ButtonLayout, ButtonShadow } from "components/common/button/StyledBtn";

export const NavButtonWrap = styled(ButtonLayout)`
  flex-direction: column; /* stack flex items vertically */
  justify-content: center; /* center items vertically, in this case */
  align-items: center;
  height: 81px;
  width: 118px;
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
  padding: 0px;
  gap: 8px;

  &:hover {
    background: ${(props) => props.theme.colors.palePurple};
    cursor: pointer;
    transition: background-color 0.1s ease-in;
  }
`;
export const NavButtonWrapActive = styled(ButtonLayout)`
  flex-direction: column; /* stack flex items vertically */
  justify-content: center; /* center items vertically, in this case */
  align-items: center;
  height: 81px;
  width: 118px;
  background: ${(props) => props.theme.colors.palePurple};
  color: ${(props) => props.theme.colors.black};
  padding: 0px;
  gap: 8px;
`;

export const NavBarButtonIcon = styled.div`
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
`;

export const NavBarButtonLabel = styled.div``;

export const NavButtonShadow = styled(ButtonShadow)`
  height: 100%;
`;
