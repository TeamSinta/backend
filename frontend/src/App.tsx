/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from "react";
import { Counter } from "features/counter/Counter";
import styled from "styled-components";

const AccentPurpleBox = styled.div`
  width: 200px;
  height: 200px;
  background: ${(props) => props.theme.colors.accentPurple};
  color: ${(props) => props.theme.colors.white};
`;

// I leave counter temporarily for refrence for redux-toolkit.
function App() {
  return (
    <div className="App">
      <Counter />

      <AccentPurpleBox>Accent purple box</AccentPurpleBox>
    </div>
  );
}

export default App;
