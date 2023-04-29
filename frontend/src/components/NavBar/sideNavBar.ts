import styled from "styled-components";

export const SideNavBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f6fb;
  height: 100vh;
  position: absolute;
  width: 180px;
  left: 0px;
  top: 0px;
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
`;

export const LogoImage = styled.img`
  position: absolute;
  width: 96px;
  height: 38px;
  left: 42px;
  top: 31px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 24px;

  position: absolute;
  width: 118px;
  height: 501px;
  left: 31px;
  top: 128px;
`;

export const BottomButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  margin-top: auto;
`;
