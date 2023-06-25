import Stack from "@mui/material/Stack";
import styled from "styled-components";

export const StyledStack = styled(Stack)`
  background-color: ${(props) => props.theme.colors.whisperGrey};
  height: 100vh;
  width: 180px;
  left: 0px;
  top: 0px;
  padding-left: 16px;
  padding-right: 16px;
  grid-area: side;
`;

export const LogoImage = styled.img`
  width: 96px;
  height: 38px;
`;

export const NavButton = styled(Stack)`
  height: 44px;
  width: 148px;
  color: ${(props) => props.theme.colors.black};
  gap: 8px;
  border-radius: 12px;
  align-items: center;

  svg {
    stroke: ${(props) => props.theme.colors.black};
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: ${(props) => props.theme.colors.palePurple};
    cursor: pointer;
    transition: 0.2s ease-in-out;
    transform: none;
    flex: none;
    order: 0;
    flex-grow: 0;
    border: 1px solid ${(props) => props.theme.colors.black};
  }

  &.active {
    background: ${(props) => props.theme.colors.palePurple};
    border: 1px solid ${(props) => props.theme.colors.black};
  }

  .link {
    width: 100%;
    height: 100;
    height: 100%;
    display: flex;
    align-content: center;
    align-items: center;
    gap: 8px;
    padding-left: 16px;
  }
`;

export const DropWrapper = styled(Stack)`
  height: auto !important;
  width: 148px;
`;

export const StyledLink = styled.link`
  width: 100%;
  height: 100;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

export const StyledSideNavBarTitle = styled.p`
  color: "#7B7B7E";
  padding-left: 16px;
  margin-bottom: 4px;
`;

export const StyledSideNavLinksWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
