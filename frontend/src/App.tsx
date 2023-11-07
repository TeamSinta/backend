import TopNavBar from "./components/layouts/topnavbar/TopNavBar";
import SideNavBar from "./components/layouts/sidenavbar/SideNavBar";
import { StyledMain } from "./components/layouts/container/StyledContainer";
import Container from "./components/layouts/container/Container";
import Routers from "./router/Routers";

// import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import Loading from "./components/common/elements/loading/Loading";
import VideoCallComponent from "@/utils/dailyVideoService/videoCallComponent";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "@/app/store";
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

interface VideoCallContextType {
  createCall: () => Promise<string>;
  startHairCheck: (url: string) => void;
}

function App() {
  const location = useLocation();
  const { isAuthenticated, status } = useSelector(
    (state: RootState) => state.user
  );

  const isLoggedIn = isAuthenticated;

  // Check if the current path is "/video-call"
  const isVideoCallRoute = location.pathname.startsWith("/video-call/");

  if (status === "LOADING") {
    return <Loading />;
  }

  // Render only the Routers component if we're on the "/video-call" route
  if (isVideoCallRoute) {
    return <Routers />;
  }

  // Render the full app layout if we're NOT on the "/video-call" route
  return (
    <>
      {isLoggedIn ? (
        <Container>
          <SideNavBar />
          <TopNavBar />
          <StyledMain>
            <Routers />
          </StyledMain>
        </Container>
      ) : (
        <Routers />
      )}
    </>
  );
}

export default App;
