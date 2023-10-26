import { H1 } from "@/components/common/typeScale/StyledTypeScale.js";
import React, { useMemo } from "react";
import TopBar from "./TopBar.js";
import MainScreen from "./MainScreen/MainScreen.js";
import { RightArrowIcon } from "@/components/common/svgIcons/Icons.js";
import { StyledIconBtnM } from "@/components/common/buttons/button/StyledBtn.js";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 35px;
`;

const Title = styled.span`
  font-size: 20px;
  margin-left: 10px;
`;

const MainWrapper = styled.div`
  padding: 20px;
  padding-left: 10px;
  padding-right: 0px;
`;

const Conclusion: React.FC = () => {
  const navigate = useNavigate(); // <-- Get the navigate function

  const header = useMemo(() => {
    return (
      <HeaderWrapper>
        <IconWrapper>
          <StyledIconBtnM onClick={() => navigate(-1)}>
            {" "}
            {/* <-- Use the navigate function here */}
            <RightArrowIcon />
          </StyledIconBtnM>
        </IconWrapper>
        <Title>
          <H1>Conclusions</H1>
        </Title>
      </HeaderWrapper>
    );
  }, [navigate]);

  return (
    <>
      {header}
      <MainWrapper>
        <TopBar />
      </MainWrapper>
      <MainScreen />
    </>
  );
};

export default Conclusion;
