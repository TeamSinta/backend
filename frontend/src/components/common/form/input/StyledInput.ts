import styled from "styled-components";
import { BodySMedium } from "../../typeScale/StyledTypeScale";

export const InputLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 66px;
  position: relative;
`;

export const InputLabel = styled(BodySMedium)``;

export const Input = styled.input`
  border-radius: 12px;
  background: ${(props) => props.theme.colors.lightGrey};
  border: none;
  outline: none;
  padding: 16px 10px;
  font-family: "Chillax";
  height: 40px;
  width: inherit;

  :disabled {
    cursor: not-allowed;
  }
`;

export const InputError = styled.div`
  width: 100%;
  height: 40px;
  background: ${(props) => props.theme.colors.red};
  position: absolute;
  bottom: 6px;
  border-radius: 12px;
  z-index: -999;
`;
