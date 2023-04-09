import styled from "styled-components";

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

export const ButtonLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px 173px;
  gap: 10px;
  position: relative;

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
