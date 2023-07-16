import styled from "styled-components";

export const StyledContainer = styled.div`
  display: grid;
  grid-template-areas:
    "side header"
    "side main";
  grid-template-columns: 180px 1fr;
  grid-template-rows: 100px 1fr;
`;

export const StyledMain = styled.div`
  grid-area: main;
  padding: 0 30px;
`;
