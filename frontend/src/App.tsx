import TopNavBar from "./components/layouts/topnavbar/TopNavBar";
import SideNavBar from "./components/layouts/sidenavbar/SideNavBar";
import { StyledMain } from "./components/layouts/container/StyledContainer";
import Container from "./components/layouts/container/Container";
import Routers from "./router/Routers";

import { useVideoCall } from "./utils/dailyVideoService/videoCallComponent";
// import styled from "styled-components";
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

interface VideoCallContextType {
  createCall: () => Promise<string>;
  startHairCheck: (url: string) => void;
}

function App() {
  const interview = window?.location?.pathname.includes("video-call");
  const { createCall, startHairCheck } = useVideoCall() as VideoCallContextType; // Type assertion
  const { isAuthenticated, status } = useSelector(
    (state: RootState) => state.user
  );
  // const { active_call } = useSelector((state: RootState) => state.videoCall);

  const isLoggedIn = isAuthenticated;
  // const videoCallScreen = active_call;

  if (status === "LOADING") {
    return <Loading />;
  }
  return (
    <>
      {isLoggedIn && !interview ? (
        <Container>
          <SideNavBar />
          <TopNavBar createCall={createCall} startHairCheck={startHairCheck} />
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
