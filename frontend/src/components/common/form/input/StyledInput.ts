import styled from "styled-components";

export const InputLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 66px;
  position: relative;
`;

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
    opacity: 0.30000001192092896;
  }

  &.error {
    box-shadow: 0px 2px 0px 0px ${(props) => props.theme.colors.red};
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

export const SerchInputLayout = styled.div`
  position: relative;
`;

export const SerchInputEl = styled(Input)`
  padding: 8px 8px 8px 40px;
  width: 100%;
`;

export const InputIcon = styled.div`
  position: absolute;
  display: flex;
  left: 9px;
  align-items: center;
  height: 100%;
  svg {
    width: 20px;
    height: 20px;
    stroke: ${(props) => props.theme.colors.black};
  }
`;
