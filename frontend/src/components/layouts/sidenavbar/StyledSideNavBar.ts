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
`;

export const LogoImage = styled.img`
  width: 96px;
  height: 38px;
`;

export const NavButton = styled(Stack)`
  height: 44px;
  width: 148px;
  color: ${(props) => props.theme.colors.black};
  padding: 0px;
  gap: 8px;
  border-radius: 4px;
  align-items: center;
  padding-left: 16px;

  &:hover {
    background: ${(props) => props.theme.colors.palePurple};
    cursor: pointer;
    transition: background-color 0.1s ease-in;
    flex: none;
    order: 0;
    flex-grow: 0;
    align-items: center;
    padding-left: 16px;
  }
`;

export const DropWrapper = styled(Stack)`
  height: 40px;
  width: 148px;
  gap: 8px;
`;
