import React, { useMemo, useState } from "react";
import { Box, Grid } from "@mui/material";
import { NavButton } from "@/components/layouts/sidenavbar/StyledSideNavBar";
import "../index.css";
import QuestionsTab from "./QuestionsTab/QuestionsTab";
import SummaryTab from "./SummaryTab/SummaryTab";
import TranscriptionTab from "./TranscriptionTab/TranscriptionTab";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import { PlayIcon } from "@/components/common/svgIcons/CustomIcons";
import { H3Bold } from "@/components/common/typeScale/StyledTypeScale";

interface MainScreenProps {}

const MainScreen: React.FC<MainScreenProps> = () => {
  const [activeTab, setActiveTab] = useState(1);
  const infoTabs = useMemo(() => {
    return (
      <div
        style={{
          marginTop: "0px",
          paddingBottom: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <span>
          <NavButton
            onClick={() => setActiveTab(1)}
            direction="row"
            style={{
              fontSize: "12px",
              width: "100px",
              height: "35px",
              borderRadius: "10px",
              float: "left",
              marginRight: "5px",
            }}
            className={activeTab === 1 ? "rightTabs active" : "rightTabs"}
          >
            <span>Summary</span>
          </NavButton>
        </span>
        <span>
          <NavButton
            onClick={() => setActiveTab(2)}
            direction="row"
            style={{
              fontSize: "12px",
              width: "100px",
              height: "35px",
              borderRadius: "10px",
              float: "left",
              marginRight: "5px",
            }}
            className={activeTab === 2 ? "rightTabs active" : "rightTabs"}
          >
            <span>Questions</span>
          </NavButton>
        </span>
        <span>
          <NavButton
            onClick={() => setActiveTab(3)}
            direction="row"
            style={{
              fontSize: "12px",
              width: "100px",
              height: "35px",
              borderRadius: "10px",
              float: "left",
              marginRight: "5px",
            }}
            className={activeTab === 3 ? "rightTabs active" : "rightTabs"}
          >
            <span>Transcription</span>
          </NavButton>
        </span>
      </div>
    );
  }, [activeTab]);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={5}>
          <H3Bold> Behavioral Interview</H3Bold>
          <div className="video-player-wrapper">
            <VideoPlayer />
          </div>
        </Grid>
        <Grid item xs={12} md={7}>
          {infoTabs}
          <div
            style={{
              backgroundColor: "#F6F6FB",
              padding: "10px 20px",
              borderRadius: "10px",
              marginTop: "0px",
            }}
          >
            <div>
              {activeTab === 1 ? <SummaryTab /> : null}
              {activeTab === 2 ? <QuestionsTab /> : null}
              {activeTab === 3 ? <TranscriptionTab /> : null}
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default MainScreen;
