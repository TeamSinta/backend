import { H1 } from "@/components/common/typeScale/StyledTypeScale";
import React, { useMemo, useState } from "react";
import TopBar from "./TopBar.jsx";
import MainScreen from "./MainScreen/MainScreen.js";
import {
  RightArrowIcon,
  TwoArrowIcon,
} from "@/components/common/svgIcons/Icons.js";
import { IconBtnM } from "@/components/common/buttons/iconBtn/IconBtn.js";
import {
  StyledButton,
  StyledIconBtn,
  StyledIconBtnM,
} from "@/components/common/buttons/button/StyledBtn.js";
import ElWrap from "@/components/layouts/elWrap/ElWrap.js";
const Conclusion = () => {
  const header = useMemo(() => {
    return (
      <H1>
        <span style={{ display: "flex", alignItems: "center" }}>
          <ElWrap w={35}>
            <StyledIconBtnM>
              <RightArrowIcon />
            </StyledIconBtnM>
          </ElWrap>
          <span style={{ marginLeft: "10px" }}>Conclusions </span>
        </span>
      </H1>
    );
  }, []);

  return (
    <>
      {header}
      <div
        style={{ padding: "20px", paddingLeft: "10px", paddingRight: "0px" }}
      >
        <TopBar />
      </div>
      <div>
        <MainScreen />
      </div>
    </>
  );
};

export default Conclusion;
