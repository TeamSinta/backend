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
`;

export const Wrapper_Box = styled.div`
  padding: 5px;
`;

export const Title = styled(H3Bold)``;

export const VideoContainer = styled(Box)`
  width: 638px;
  border-radius: 12px;
`;

export const ButtonWrapper = styled.label`
  display: flex;
  gap: 12px;
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
