import styled, { css } from "styled-components";

export interface IBtnProps {
  label?: string;
  icon?: JSX.Element;
  disable: boolean;
  onClick: () => void;
  className: string;
}
interface IButtonLayout {
  disable: boolean;
}

export const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 10px 28px; */
  gap: 10px;
  background: transparent;
  border: 0;
  position: relative;
  outline: 1px solid ${(props) => props.theme.colors.black};
  outline-offset: -1px;
  border-radius: 12px;
  box-shadow: 0px 2px 0px #121212;
  height: 40px;
  width: 100%;

  ${(props) =>
    !props.disabled &&
    `
    :hover {
      cursor: pointer;
      box-shadow: 0px 4px 0px #121212;
      transition: 0.5s;
    }

    :active {
      box-shadow: 0px 0px 0px #121212;
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

export const StyledBtnXL = styled(StyledButton)`
  width: 420px;
  height: 148px;
  flex-direction: column;
  justify-content: center;
`;

export const StyledBtnLL = styled(StyledBtnXL)`
  width: 168px;
  height: 120px;
  padding: 31px 0px;
  gap: 4px;
`;

export const StyledButtonM = styled(StyledButton)`
  height: 32px;
  border-radius: 10px;
`;

export const StyledButtonS = styled.button`
  height: inherit;
  border-radius: 8px;
  background: none;
  width: 100%;
  border: 0;
  color: ${(props) => props.theme.colors.black};
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    !props.disabled &&
    `
    :hover {
      cursor: pointer;
      background: #F6F6FB;
    }

    :active {
      background: #eaeaf4;
    }
    `}

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const StyledIconBtn = styled(StyledButton)`
  height: inherit;
  &.accentPurple {
    svg {
      width: 24px;
      height: 24px;
    }
  }

  &.white {
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export const StyledIconBtnM = styled(StyledButtonM)`
  &.accentPurple {
    svg {
      width: 18px;
      height: 18px;
    }
  }

  &.white {
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const StyledIconBtnS = styled(StyledButtonS)`
  svg {
    width: 24px;
    height: 24px;
    fill: ${(props) => props.theme.colors.black};
    stroke: ${(props) => props.theme.colors.black};
    display: flex;
  }
`;

//UNUSE
export const SmallButtonLayout = styled.div<IButtonLayout>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 28px;
  border: none;
  border-radius: 8px;

  ${(props) => {
    if (props.disable) {
      return css`
        &::after {
          width: 100%;
          height: inherit;
          background: ${props.theme.colors.white};
          content: " ";
          opacity: 0.3;
          position: absolute;
        }
        :hover {
          cursor: not-allowed;
        }
      `;
    } else {
      return css`
        :hover {
          background: ${props.theme.colors.lightPurple};
          cursor: pointer;
          transition: 0.2s;
        }

        :active {
          background: ${props.theme.colors.pastelPurple};
        }
      `;
    }
  }}
`;
