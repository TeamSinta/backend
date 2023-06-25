import styled from "styled-components";

export const TextIconFilterLayout = styled.div`
  display: inline-flex;
  gap: 6px;
  border-radius: 10px;
  align-items: center;
  padding: 10px 20px;
  transition: 0.3s;
  height: 40px;
  font-size: 14px;

  :hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.lightPurple};
  }

  :active {
    background: #eaeaf4;
  }

  &.selected {
    background: ${(props) => props.theme.colors.palePurple};
    outline: 1px solid ${(props) => props.theme.colors.black};
    outline-offset: -1px;
  }
`;

export const TextIconFilterIcon = styled.div`
  display: flex;
  align-self: center;
  svg {
    width: 18px;
    height: 18px;
    stroke: ${(props) => props.theme.colors.black};
  }
`;
