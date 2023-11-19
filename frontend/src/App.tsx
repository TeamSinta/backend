import TopNavBar from "./components/layouts/topnavbar/TopNavBar";
import SideNavBar from "./components/layouts/sidenavbar/SideNavBar";
import { StyledMain } from "./components/layouts/container/StyledContainer";
import Container from "./components/layouts/container/Container";
import Routers from "./router/Routers";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import Loading from "./components/common/elements/loading/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, status } = useSelector(
    (state: RootState) => state.user
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "LOADING") {
      // Keep showing loading while status is LOADING
      setIsLoading(true);
    } else if (!isAuthenticated && location.pathname !== "/login") {
      // Redirect to login if not authenticated and not already on the login page
      navigate("/login");
    } else {
      // Otherwise, we are authenticated or on the login page, so set loading to false
      setIsLoading(false);
    }
  }, [isAuthenticated, location.pathname, navigate, status]);

  if (isLoading) {
    return <Loading />;
  }

  const isVideoCallRoute = location.pathname.startsWith("/video-call/");

  if (isVideoCallRoute) {
    return <Routers />;
  }

  console.log(isAuthenticated);
  // After this point, the user is either authenticated or on the login page
  return (
    <>
      {isAuthenticated ? (
        <Container>
          <SideNavBar />
          <TopNavBar />
          <StyledMain>
            <Routers />
          </StyledMain>
        </Container>
      ) : (
        // If not authenticated, render the login or other public routes
        <Routers />
      )}
    </>
  );
}
export default App;
