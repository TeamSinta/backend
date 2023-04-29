import styled from "styled-components";

export const NavButtonWrap = styled.div`
  flex-direction: column; /* stack flex items vertically */
  justify-content: center; /* center items vertically, in this case */
  align-items: center;
  height: 81px;
  width: 118px;
  color: ${(props) => props.theme.colors.black};
  padding: 0px;
  gap: 8px;
  display: flex;
  position: relative;
  border-radius: 12px;

  flex: none;
  order: 0;
  flex-grow: 0;

  &:hover {
    background: ${(props) => props.theme.colors.palePurple};
    cursor: pointer;
    transition: background-color 0.1s ease-in;
    flex: none;
  order: 0;
  flex-grow: 0;

  }
`;

export const NavButtonWrapActive = styled(NavButtonWrap)`
  background: ${(props) => props.theme.colors.palePurple};
  border: 1px solid ${(props) => props.theme.colors.black};
`;
export const NavBarButtonIcon = styled.div`
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
`;

export const NavBarButtonLabel = styled.div``;
