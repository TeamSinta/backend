import styled from "styled-components";

export const ButtonLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px 173px;
  gap: 10px;
  position: relative;
`;

export const ButtonShadow = styled.div`
  position: absolute;
  height: 40px;
  left: 0.16px;
  right: 0.63px;
  top: 0;
  background: #121212;
  border: 1px solid #121212;
  border-radius: 12px;
  /* transform: matrix(1.003, -0.01, 0, -1, 0, 3); */
  transform: matrix(1, -0.02, 0, -1, 0, 0);
  z-index: -999;
`;
