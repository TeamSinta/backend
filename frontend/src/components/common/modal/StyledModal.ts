import styled, { keyframes } from "styled-components";

export const ModalHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CloseDiv = styled.div`
  :hover {
    cursor: pointer;
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const ModalLayout = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${(props) => props.theme.colors.purpleGrey};
  animation: ${fadeIn} 0.25s ease-out forwards;
`;

export const ModalContainer = styled.div`
  padding: 30px;
  width: 480px;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(props) => props.theme.colors.white};
  display: flex;
  gap: 30px;
  flex-direction: column;
  z-index: 999;
`;
