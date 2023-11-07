import styled from "styled-components";
import { Button, Box, Stack } from "@mui/material";
import { H3Bold } from "@/components/common/typeScale/StyledTypeScale";

export const HairCheckContainer = styled(Box)`
  background: transparent;
  display: flex;
  height: 90vh;
`;

export const SelectBox = styled(Stack)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 540px;
  height: 410px;

  @media (max-width: 950px) {
    width: 100%;
    height: fit-content;
  }
`;

export const HeadingBox = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 950px) {
    flex-direction: column;
    row-gap: 20px;
  }
`;

export const Wrapper = styled.div`
  height: 100vh;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  column-gap: 20px;
  align-items: center;
  justify-content: center;

  @media (max-width: 950px) {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
`;

export const Wrapper_Box = styled.div`
  padding: 5px;
`;

export const Title = styled(H3Bold)``;

export const VideoContainer = styled(Box)`
  width: 638px;
  border-radius: 12px;

  @media (max-width: 950px) {
    width: 100%;
  }
`;

export const ButtonWrapper = styled.label`
  display: flex;
  gap: 12px;
  width: 100%;
`;

export const Input = styled.input`
  border: 1px solid var(--grey);
  padding: 0.5em;
  border-radius: 4px;
  color: var(--dark-blue);
  width: 100%;
`;

export const StyledButton = styled(Button)``;

export const CancelButton = styled(Button)`
  margin-top: 0;
`;
