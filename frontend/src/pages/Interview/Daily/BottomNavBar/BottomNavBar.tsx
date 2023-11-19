import React, { useCallback, useState } from "react";
import {
  useDaily,
  useScreenShare,
  useLocalParticipant,
  useVideoTrack,
  useAudioTrack,
  useDailyEvent,
  useRecording,
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
  EmojiIcon,
} from "@/components/common/svgIcons/Icons";

import {
  BottomBarColumnsContainer,
  EmojiTray,
  FinishButtonContainer,
  StyledBottomBar,
  StyledBottomNavButtons,
  StyledColumns,
  StyledFinishBtn,
} from "./StyledBottomNavBar";
import { sendFeedback } from "../../../../features/interviews/interviewsAPI";
import { Grid } from "@mui/material";
import "./index.css";
import { useWindowSize } from "@/hooks/useWindowSize";
import { AppDispatch, RootState } from "../../../../app/store";
import { useDispatch } from "react-redux";
import { uploadRecording } from "../../../../utils/dailyVideoService/videoCallSlice";
import { Cookies, useCookies } from "react-cookie";

function BottomNavBar(props: any) {
  const [isEmojiTrayOpened, setIsEmojiTrayOpened] = useState<boolean>(false);
  const [cookies, ,] = useCookies(["access_token"]);
  const { setReactClicked, reactClicked, leaveCall, emojiClicked } = props;
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();
  const { startRecording, stopRecording, isRecording, type } = useRecording();
  const localParticipant = useLocalParticipant();
  const localVideo = useVideoTrack(localParticipant?.session_id);
  const localAudio = useAudioTrack(localParticipant?.session_id);
  const mutedVideo = localVideo.isOff;
  const mutedAudio = localAudio.isOff;
  const { width } = useWindowSize();

  const toggleVideo = useCallback(() => {
    callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    callObject.setLocalAudio(mutedAudio);
  }, [callObject, mutedAudio]);

  const toggleEmojiTray = () => {
    setIsEmojiTrayOpened(!isEmojiTrayOpened);
  };

  const [showMeetingInformation, setShowMeetingInformation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState(false);

  const dispatch: AppDispatch = useDispatch();

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

  const toggleScreenRecord = async () => {
    const shouldUpload = isRecording;
    isRecording ? stopRecording() : startRecording();
    const room = await callObject?.room();
    if (shouldUpload) {
      const response = await dispatch(uploadRecording(room?.name));
      console.log(response);
    }
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
      <BottomBarColumnsContainer>
        {width && width > 1120 && (
          <Grid lg={3} md={3} sm={3} xl={3} xs={3}>
            <StyledColumns>
              <StyledBottomNavButtons
                onClick={toggleScreenRecord}
                style={{ marginLeft: "20px" }}
              >
                {/* Your custom button */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    className="record-label"
                    style={{ marginLeft: "5px", marginRight: "5px" }}
                  >
                    {isRecording ? "Stop " : "Start "} Recording
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
        )}

        {width && width > 1120 && (
          <Grid lg={6} md={6} sm={6} xl={6} xs={6}>
            {" "}
            <StyledColumns>
              {/* Integrate Daily's tray components here */}

              {/* Your custom emoji buttons */}

              <StyledBottomNavButtons
                onClick={(e) => {
                  emojiClicked(e, "👍", 2);
                }}
              >
                👍
              </StyledBottomNavButtons>
              <StyledBottomNavButtons
                onClick={(e) => {
                  emojiClicked(e, "👎", 3);
                }}
              >
                👎
              </StyledBottomNavButtons>
              <StyledBottomNavButtons
                onClick={(e) => {
                  emojiClicked(e, "🔥", 1);
                }}
              >
                🔥
              </StyledBottomNavButtons>

              <StyledBottomNavButtons
                onClick={(e) => {
                  emojiClicked(e, "😂", 5);
                }}
              >
                😂
              </StyledBottomNavButtons>
              <StyledBottomNavButtons
                onClick={(e) => {
                  emojiClicked(e, "❤️", 4);
                }}
              >
                <i className="fa fa-heart" style={{ color: "#FF3D2F" }}></i>
              </StyledBottomNavButtons>
              <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    className="record-label"
                    style={{ marginLeft: "5px", marginRight: "5px" }}
                  >
                    {isSharingScreen ? " Stop sharing screen" : " Share screen"}{" "}
                  </span>{" "}
                  <span className="icon" style={{ marginLeft: "5px" }}>
                    <NavScreenShareIcon />
                  </span>
                </div>
              </StyledBottomNavButtons>

              <StyledBottomNavButtons onClick={toggleChat} type="button">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    className="record-label"
                    style={{ marginLeft: "5px", marginRight: "5px" }}
                  >
                    {newChatMessage ? "Hide chat" : "Show chat"}
                  </span>{" "}
                  <span className="icon" style={{ marginLeft: "5px" }}>
                    {newChatMessage ? <NavCircle /> : <NavFlagIcon />}
                  </span>
                </div>
              </StyledBottomNavButtons>
            </StyledColumns>
          </Grid>
        )}

        <FinishButtonContainer>
          {" "}
          {width && width < 1120 && (
            <StyledColumns>
              <StyledBottomNavButtons
                onClick={toggleScreenRecord}
                style={{ marginLeft: "20px" }}
              >
                {/* Your custom button */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    className="record-label"
                    style={{ marginLeft: "5px", marginRight: "5px" }}
                  >
                    {isRecording ? "Stop " : "Start "} Recording
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

              {width < 1120 && (
                <StyledBottomNavButtons onClick={toggleEmojiTray} type="button">
                  {isEmojiTrayOpened && (
                    <EmojiTray>
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
                        <i
                          className="fa fa-heart"
                          style={{ color: "#FF3D2F" }}
                        ></i>
                      </StyledBottomNavButtons>
                    </EmojiTray>
                  )}

                  <EmojiIcon />
                </StyledBottomNavButtons>
              )}
            </StyledColumns>
          )}
          <StyledColumns style={{ paddingRight: "20px", float: "right" }}>
            <StyledFinishBtn className="accentPurple" onClick={leaveCall}>
              Finish
            </StyledFinishBtn>
          </StyledColumns>
        </FinishButtonContainer>
      </BottomBarColumnsContainer>
    </StyledBottomBar>
  );
}

export default BottomNavBar;
