import TopNavBar from "./components/layouts/topnavbar/TopNavBar";
import SideNavBar from "./components/layouts/sidenavbar/SideNavBar";
import { StyledMain } from "./components/layouts/container/StyledContainer";
import Container from "./components/layouts/container/Container";
import Routers from "./router/Routers";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import Loading from "./components/common/elements/loading/Loading";

// Node: server, Browser : worker.
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
  const { isAuthenticated, status } = useSelector(
    (state: RootState) => state.user
  );
  const { active_call } = useSelector((state: RootState) => state.videoCall);

  const isLoggedIn = isAuthenticated;
  const videoCallScreen = active_call;

  if (status === "LOADING") {
    return <Loading />;
  }
  return (
    <>
      {isLoggedIn && !videoCallScreen ? (
        <Container>
          <SideNavBar />
          <TopNavBar />
          <StyledMain>
            <Routers />
          </StyledMain>
        </Container>
      ) : (
        <>
          <Routers />
        </>
      )}
    </>
  );
}

export default App;
