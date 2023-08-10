import styled from "styled-components";
export const StyledBottomBar = styled.div`
   {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    background-color: #2a2535;
    height: 60px;
    bottom: 0;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const StyledColumns = styled.div`
   {
    text-align: center;
    display: flex;
    align-items: center;
  }
`;

export const StyledBottomNavButtons = styled.button`
   {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background: #433c53;
    padding: 10px;
    color: white;
    width: fit-content;
    font-family: "Chillax";
    margin: 5px;
    border: none;
    height: 35px;
    font-size: 14px;
    cursor: pointer;
  }
  :hover {
    cursor: pointer;
    box-shadow: 0px 2px 0px black;
    transition: 0.5s;
  }
  svg {
    width: 14px;
    height: 14px;
  }
`;

export const StyledFinishBtn = styled.button`
  cursor: pointer;
  float: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 35px;
  gap: 10px;
  background: transparent;
  border: 0;
  position: relative;
  outline: 1px solid ${(props) => props.theme.colors.white};
  outline-offset: -1px;
  border-radius: 12px;
  box-shadow: 0px 2px 0px white;
  height: 35px;
  width: fit-content;
  margin-bottom: 5px;
  margin-top: 5px;
  ${(props) =>
    !props.disabled &&
    `
    :hover {
      cursor: pointer;
      box-shadow: 0px 4px 0px white;
      transition: 0.5s;
    }

    :active {
      box-shadow: 0px 0px 0px white;
      transform: translateY(4px);
    }


    `}

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.accentPurple {
    background: ${(props) => props.theme.colors.accentPurple};
    color: ${(props) => props.theme.colors.white};
    svg {
      width: 18px;
      height: 18px;
      stroke: ${(props) => props.theme.colors.white};
      display: flex;
      align-content: center;
    }
  }

  &.white {
    background: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.black};
    svg {
      width: 18px;
      height: 18px;
      stroke: ${(props) => props.theme.colors.black};
      display: flex;
      align-content: center;
    }
  }
`;
