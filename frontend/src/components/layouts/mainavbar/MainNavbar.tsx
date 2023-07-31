import React from "react";
// import TopNavBar from "components/layouts/topNavbar/TopNavBar";
import SideNavBar from "../sidenavbar/SideNavBar";
import { Box, Stack, Paper } from "@mui/material";
import TopNavBar from "../topnavbar/TopNavBar";

const MainNavBar = (): JSX.Element => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={0}
      >
        <SideNavBar />
        <Box style={{ width: "100%" }}>
          <TopNavBar />
        </Box>
      </Stack>
    </>
  );
};

export default MainNavBar;
