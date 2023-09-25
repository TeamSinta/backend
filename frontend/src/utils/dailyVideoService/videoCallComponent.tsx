import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import DailyIframe from "@daily-co/daily-js";
import { DailyProvider } from "@daily-co/daily-react";
import videoApi from "./videoApi";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "./utils";
import Header from "@/pages/Interview/Daily/Header/Header";
import HairCheck from "@/pages/Interview/Daily/HairCheck/HairCheck";
import {
  ApiErrorContainer,
  AppContainer,
  ApiErrorHeading1,
  ApiErrorParagraph,
  ApiErrorLink,
} from "./StyledVideoCall"; // Update the import path
import TopNavBar from "@/components/layouts/topnavbar/TopNavBar";
import { Interview } from "@/pages/Interview";

const defaultVideoCallContext = {
  createCall: () => Promise.resolve("default-url"),
  startHairCheck: (url: string) => {},
};

const VideoCallContext = createContext(defaultVideoCallContext);
export function useVideoCall() {
  // Custom hook to access context values
  return useContext(VideoCallContext);
}

const STATE = {
  IDLE: "STATE_IDLE",
  CREATING: "STATE_CREATING",
  JOINING: "STATE_JOINING",
  JOINED: "STATE_JOINED",
  LEAVING: "STATE_LEAVING",
  ERROR: "STATE_ERROR",
  HAIRCHECK: "STATE_HAIRCHECK",
};

export default function VideoCall() {
  const [appState, setAppState] = useState(STATE.IDLE);
  const [roomUrl, setRoomUrl] = useState(null);
  const [callObject, setCallObject] = useState(null);
  const [apiError, setApiError] = useState(false);

  const createCall = useCallback(async () => {
    setAppState(STATE.CREATING);
    try {
      const room = await videoApi.createRoom();
      setRoomUrl(room.url);
      return room.url;
    } catch (error) {
      console.error("Error creating room", error);
      setRoomUrl(null);
      setAppState(STATE.IDLE);
      setApiError(true);
      return "error-url";
    }
  }, []);

  const startHairCheck = useCallback(async (url) => {
    const newCallObject = DailyIframe.createCallObject();
    setRoomUrl(url);
    setCallObject(newCallObject);
    setAppState(STATE.HAIRCHECK);
    await newCallObject.preAuth({ url });
    await newCallObject.startCamera();
  }, []);

  const joinCall = useCallback(() => {
    callObject?.join({ url: roomUrl });
  }, [callObject, roomUrl]);

  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    if (appState === STATE.ERROR) {
      callObject.destroy().then(() => {
        setRoomUrl(null);
        setCallObject(null);
        setAppState(STATE.IDLE);
      });
    } else {
      setAppState(STATE.LEAVING);
      callObject.leave();
    }
  }, [callObject, appState]);

  const contextValue = {
    createCall,
    startHairCheck,
  };

  useEffect(() => {
    const url = roomUrlFromPageUrl();
    if (url) {
      startHairCheck(url);
    }
  }, [startHairCheck]);

  useEffect(() => {
    if (roomUrl !== null) {
      const pageUrl = pageUrlFromRoomUrl(roomUrl);
      if (pageUrl !== window.location.href) {
        window.history.replaceState(null, "", pageUrl);
      }
    }
  }, [roomUrl]);

  useEffect(() => {
    if (!callObject) return;

    const events = ["joined-meeting", "left-meeting", "error", "camera-error"];

    function handleNewMeetingState() {
      switch (callObject.meetingState()) {
        case "joined-meeting":
          setAppState(STATE.JOINED);
          break;
        case "left-meeting":
          callObject.destroy().then(() => {
            setRoomUrl(null);
            setCallObject(null);
            setAppState(STATE.IDLE);
          });
          break;
        case "error":
          setAppState(STATE.ERROR);
          break;
        default:
          break;
      }
    }

    handleNewMeetingState();

    events.forEach((event) => callObject.on(event, handleNewMeetingState));

    return () => {
      events.forEach((event) => callObject.off(event, handleNewMeetingState));
    };
  }, [callObject]);

  const showCall =
    !apiError && [STATE.JOINING, STATE.JOINED, STATE.ERROR].includes(appState);
  const showHairCheck = !apiError && appState === STATE.HAIRCHECK;

  return (
    <VideoCallContext.Provider value={contextValue}>
      <AppContainer>
        {!showCall && <Header />}
        {apiError ? (
          <ApiErrorContainer>
            <ApiErrorHeading1>Error</ApiErrorHeading1>
            <ApiErrorParagraph>
              Room could not be created. Check if your `.env` file is set up
              correctly. For more information, see the{" "}
              <ApiErrorLink href="https://github.com/daily-demos/custom-video-daily-react-hooks#readme">
                readme
              </ApiErrorLink>{" "}
              :)
            </ApiErrorParagraph>
          </ApiErrorContainer>
        ) : showHairCheck ? (
          <DailyProvider callObject={callObject}>
            <HairCheck joinCall={joinCall} cancelCall={startLeavingCall} />
          </DailyProvider>
        ) : showCall ? (
          <DailyProvider callObject={callObject}>
            <Interview leaveCall={startLeavingCall} />
          </DailyProvider>
        ) : (
          <TopNavBar createCall={createCall} startHairCheck={startHairCheck} />
        )}
      </AppContainer>
    </VideoCallContext.Provider>
  );
}
