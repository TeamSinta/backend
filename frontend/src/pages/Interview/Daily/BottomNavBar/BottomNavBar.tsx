import React, { useCallback, useState } from "react";
import {
  useDaily,
  useScreenShare,
  useLocalParticipant,
  useVideoTrack,
  useAudioTrack,
  useDailyEvent,
} from "@daily-co/daily-react";

import {
  NavBookmarkIcon,
  NavCamIcon,
  NavCircle,
  NavFlagIcon,
  NavFullScreenIcon,
  NavMicIcon,
  NavScreenShareIcon,
  CamHideIcon,
  MicMuteIcon,
} from "@/components/common/svgIcons/Icons";

import {
  StyledBottomBar,
  StyledBottomNavButtons,
  StyledColumns,
  StyledFinishBtn,
} from "./StyledBottomNavBar";
import { Grid } from "@mui/material";
import "./index.css";

function BottomNavBar(props: any) {
  const { setReactClicked, reactClicked, leaveCall } = props;
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();
  const localParticipant = useLocalParticipant();
  const localVideo = useVideoTrack(localParticipant?.session_id);
  const localAudio = useAudioTrack(localParticipant?.session_id);
  const mutedVideo = localVideo.isOff;
  const mutedAudio = localAudio.isOff;

  const toggleVideo = useCallback(() => {
    callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    callObject.setLocalAudio(mutedAudio);
  }, [callObject, mutedAudio]);

  const [showMeetingInformation, setShowMeetingInformation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState(false);

  useDailyEvent(
    "app-message",
    useCallback(() => {
      if (!showChat) {
        setNewChatMessage(true);
      }
    }, [showChat])
  );

  const toggleScreenShare = () => {
    isSharingScreen ? stopScreenShare() : startScreenShare();
  };

  const toggleMeetingInformation = () => {
    setShowMeetingInformation(!showMeetingInformation);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (newChatMessage) {
      setNewChatMessage(!newChatMessage);
    }
  };

  return (
    <StyledBottomBar>
      <Grid container>
        <Grid lg={3} md={3} sm={3} xl={3} xs={3}>
          <StyledColumns>
            <StyledBottomNavButtons style={{ marginLeft: "20px" }}>
              {/* Your custom button */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  className="record-label"
                  style={{ marginLeft: "5px", marginRight: "5px" }}
                >
                  Start Recording
                </span>{" "}
                <span className="icon" style={{ marginLeft: "5px" }}>
                  <NavFullScreenIcon />
                </span>
              </div>
            </StyledBottomNavButtons>
            <StyledBottomNavButtons onClick={toggleAudio} type="button">
              {mutedAudio ? <MicMuteIcon /> : <NavMicIcon />}
            </StyledBottomNavButtons>
            <StyledBottomNavButtons onClick={toggleVideo} type="button">
              {mutedVideo ? <CamHideIcon /> : <NavCamIcon />}
            </StyledBottomNavButtons>
          </StyledColumns>
        </Grid>
        <Grid lg={1} md={1} sm={1} xl={1} xs={1}></Grid>
        <Grid lg={6} md={6} sm={6} xl={6} xs={6}>
          {" "}
          <StyledColumns>
            {/* Integrate Daily's tray components here */}

            {/* Your custom emoji buttons */}
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "🔥",
                });
              }}
            >
              🔥
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "👎",
                });
              }}
            >
              👎
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "👍",
                });
              }}
            >
              👍
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "😂",
                });
              }}
            >
              😂
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "❤️",
                });
              }}
            >
              <i className="fa fa-heart" style={{ color: "#FF3D2F" }}></i>
            </StyledBottomNavButtons>
            <div style={{ marginRight: "10px", marginLeft: "10px" }}>
              <NavCircle />
            </div>
            <StyledBottomNavButtons>
              <NavBookmarkIcon />
            </StyledBottomNavButtons>
            <StyledBottomNavButtons>
              <NavFlagIcon />
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={toggleScreenShare}
              type="button"
              style={{ gap: "4px" }}
            >
              {isSharingScreen ? (
                <NavScreenShareIcon />
              ) : (
                <NavScreenShareIcon />
              )}
              {isSharingScreen ? " Stop sharing screen" : " Share screen"}
            </StyledBottomNavButtons>
            {/* <StyledBottomNavButtons
              onClick={toggleMeetingInformation}
              type="button"
            >
              {showMeetingInformation ? "Hide info" : "Show info"}
            </StyledBottomNavButtons>
            <StyledBottomNavButtons onClick={toggleChat} type="button">
              {newChatMessage ? <NavCircle /> : <NavFlagIcon />}
              {newChatMessage ? "Hide chat" : "Show chat"}
            </StyledBottomNavButtons> */}

            {/* ... (other tray buttons) */}
          </StyledColumns>
        </Grid>

        <Grid lg={2} md={2} sm={2} xl={2} xs={2}>
          {" "}
          <StyledColumns style={{ paddingRight: "20px", float: "right" }}>
            <StyledFinishBtn className="accentPurple" onClick={leaveCall}>
              Finish
            </StyledFinishBtn>
          </StyledColumns>
        </Grid>
      </Grid>
    </StyledBottomBar>
  );
}

export default BottomNavBar;
