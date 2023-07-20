import TopNavBar from "./components/layouts/topnavbar/TopNavBar";
import SideNavBar from "./components/layouts/sidenavbar/SideNavBar";
import { StyledMain } from "./components/layouts/container/StyledContainer";
import Container from "./components/layouts/container/Container";
import Routers from "./router/Routers";
import { Counter } from "./features/counter/Counter";
import styled from "styled-components";
import GoogleLoginButton from "./components/pages/login/googleLoginBtn/GoogleLoginButton";

// Node: server, Brower : worker.
if (import.meta.env.VITE_ENV !== "develop") {
  if (typeof window === "undefined") {
    (async () => {
      const { server } = await import("@/mocks/server");
      server.listen();
    })();
  } else {
    (async () => {
      const { worker } = await import("@/mocks/browser");
      worker.start({ onUnhandledRequest: "bypass" });
    })();
  }
}

const DivSample = styled.div`
  svg {
    width: xx;
    height: xx;
    stroke: black;
  }
`;

function App() {
  return (
    <>
      <Container>
        <SideNavBar />
        <TopNavBar />
        <StyledMain className="p-all-8">
          <Routers></Routers>
          <GoogleLoginButton />
        </StyledMain>
      </Container>
    </>
  );
}

export default App;
