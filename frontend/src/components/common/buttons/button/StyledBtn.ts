import styled, { css } from "styled-components";

interface IButtonLayout {
  disable: boolean;
}

export const ButtonShadow = styled.div`
  position: absolute;
  height: 40px;
  left: 0.16px;
  right: 0.63px;
  top: 0;
  background: ${(props) => props.theme.colors.black};
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: 12px;
  transform: rotate(-0.4deg);
  transform-origin: right;
  z-index: -999;
  transition: 0.2s ease-in-out;
`;

export const ButtonLayout = styled.div<IButtonLayout>`
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 9px 173px; */
  gap: 10px;
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: 12px;

  ${(props) => {
    if (props.disable) {
      return css`
        &::after {
          width: 102%;
          height: 50px;
          position: absolute;
          top: -5%;
          background: ${props.theme.colors.white};
          content: " ";
          opacity: 0.3;
        }
        :hover {
          cursor: not-allowed;
        }
      `;
    } else {
      return css`
        :hover {
          ${ButtonShadow} {
            transform: rotate(0deg) translateY(4px);
          }
          cursor: pointer;
        }

        :active {
          ${ButtonShadow} {
            display: none;
          }
          transform: translateY(4px);
        }
      `;
    }
  }}
`;

export const SmallButtonLayout = styled.div<IButtonLayout>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 120px;
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
