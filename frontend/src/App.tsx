import TopNavBar from "./components/layouts/topnavbar/TopNavBar";
import SideNavBar from "./components/layouts/sidenavbar/SideNavBar";
import { StyledMain } from "./components/layouts/container/StyledContainer";
import Container from "./components/layouts/container/Container";
import Routers from "./router/Routers";

function App() {
  return (
    <>
      <Container>
        <SideNavBar />
        <TopNavBar />
        <StyledMain className="p-all-8">
          <Routers></Routers>
        </StyledMain>
      </Container>
    </>
  );
}

export default App;
