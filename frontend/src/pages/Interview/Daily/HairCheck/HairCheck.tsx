import React, { useCallback, useState, ChangeEvent, FormEvent } from "react";
import {
  useLocalParticipant,
  useDevices,
  useDaily,
  useDailyEvent,
  DailyVideo,
} from "@daily-co/daily-react";
import UserMediaError from "../UserMediaError/UserMediaError";
import { InputLabel, Select, MenuItem, Box } from "@mui/material";
import {
  Title,
  VideoContainer,
  ButtonWrapper,
  SelectBox,
} from "./StyledHairCheck";
import { Stack } from "@mui/material";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import { BackgroundColor } from "@/features/utils/utilEnum";
import {
  EditIcon,
  PlusIcon,
  RightBracketIcon,
  SearchIcon,
} from "@/components/common/svgIcons/Icons";
import TextInput from "@/components/common/form/textInput/TextInput";
import TextIconFilter from "@/components/common/filters/textIconFilter/TextIconFilter";
import Slider from "@/components/common/slider/CustomSlider";
import InterviewRoundCard from "@/components/common/cards/interviewRoundCard/InterviewRoundCard";
import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";

interface HairCheckProps {
  joinCall: () => void;
  cancelCall: () => void;
}

interface InterviewTemplate {
  id: string;
  title: string;
  numberOfQuestions: string;
  image: string;
  // other properties...
}

export default function HairCheck({ joinCall, cancelCall }: HairCheckProps) {
  const localParticipant = useLocalParticipant();
  const {
    microphones,
    speakers,
    cameras,
    setMicrophone,
    setCamera,
    setSpeaker,
  } = useDevices();
  const callObject = useDaily();

  const [getUserMediaError, setGetUserMediaError] = useState(false);
  const [activeTab, setActiveTab] = useState("devices");

  const handleTabChange = (tab: stri) => {
    setActiveTab(tab);
  };

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, [])
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    callObject.setUserName(e.target.value);
  };

  const join = (e: FormEvent) => {
    e.preventDefault();
    joinCall();
  };

  const updateMicrophone = (e: ChangeEvent<HTMLSelectElement>) => {
    setMicrophone(e.target.value);
  };

  const updateSpeakers = (e: ChangeEvent<HTMLSelectElement>) => {
    setSpeaker(e.target.value);
  };

  const updateCamera = (e: ChangeEvent<HTMLSelectElement>) => {
    setCamera(e.target.value);
  };

  const interviewTemplates = [
    {
      id: "template1",
      image:
        "https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512",
      title: "Coding Round",
      numberOfQuestions: "26 questions",
      roundId: "round1",
    },
    {
      id: "template2",
      image: "https://example.com/template2-image.jpg", // Replace with the actual image URL
      title: "Design Round",
      numberOfQuestions: "20 questions",
      roundId: "round2",
    },
    {
      id: "template3",
      image: "https://example.com/template3-image.jpg", // Replace with the actual image URL
      title: "Behavioral Round",
      numberOfQuestions: "15 questions",
      roundId: "round3",
    },
    // Add more templates as needed
  ];

  return getUserMediaError ? (
    <UserMediaError />
  ) : (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={4}
      onSubmit={join}
      style={{ height: "100vh" }}
    >
      {/* Video preview */}
      {localParticipant && (
        <VideoContainer>
          <DailyVideo
            sessionId={localParticipant.session_id}
            mirror
            style={{ objectFit: "cover" }}
          />
        </VideoContainer>
      )}
      <SelectBox>
        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Title style={{ paddingBottom: "0px" }}>Meeting Creation</Title>
          <Box sx={{ gap: "4px", display: "flex" }}>
            <TextIconFilter
              label="Templates"
              icon={<EditIcon />} // Replace with the appropriate icon
              select={activeTab === "templates"}
              onClick={() => handleTabChange("templates")}
            />
            <TextIconFilter
              label="Devices"
              icon={<SearchIcon />} // Replace with the appropriate icon
              select={activeTab === "devices"}
              onClick={() => handleTabChange("devices")}
            />
          </Box>
        </Stack>
        <Stack direction="column" alignItems="flex-start" spacing={1}>
          <BodySMedium style={{ marginTop: "18px" }}>Username</BodySMedium>
          <TextInput
            name="username"
            disable={false}
            placeholder="Name"
            error={false}
            onChange={onChange}
            value={localParticipant?.user_name || " "}
          />

          {/* Tab selection */}
        </Stack>
        {activeTab === "devices" && (
          // Render your device selection content here
          // Username
          <>
            {/* Microphone select */}
            <div style={{ display: "flex", gap: "20px", paddingTop: "0px" }}>
              <InputLabel htmlFor="micOptions">Microphone:</InputLabel>
              <Select
                name="micOptions"
                id="micSelect"
                onChange={updateMicrophone}
                style={{ width: "75%", height: "70%" }}
                value={localParticipant?.microphoneId || ""}
              >
                {microphones?.map((mic) => (
                  <MenuItem
                    key={`mic-${mic.device.deviceId}`}
                    value={mic.device.deviceId}
                  >
                    {mic.device.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Speakers select */}
            <div style={{ display: "flex", gap: "36px", marginTop: "2px" }}>
              <InputLabel htmlFor="speakersOptions">Speakers:</InputLabel>
              <Select
                name="speakersOptions"
                id="speakersSelect"
                onChange={updateSpeakers}
                style={{ width: "75%", height: "70%" }}
              >
                {speakers?.map((speaker) => (
                  <MenuItem
                    key={`speaker-${speaker.device.deviceId}`}
                    value={speaker.device.deviceId}
                  >
                    {speaker.device.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Camera select */}
            <div
              style={{
                display: "flex",
                gap: "46px",
                marginTop: "2px",
                marginBottom: "2px",
              }}
            >
              <InputLabel htmlFor="cameraOptions">Camera:</InputLabel>
              <Select
                name="cameraOptions"
                id="cameraSelect"
                onChange={updateCamera}
                style={{ width: "75%", height: "70%" }}
              >
                {cameras?.map((camera) => (
                  <MenuItem
                    key={`cam-${camera.device.deviceId}`}
                    value={camera.device.deviceId}
                  >
                    {camera.device.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </>
        )}
        <Stack
          direction="column"
          alignItems="center"
          spacing={5}
          justifyContent="space-around"
          style={{ marginTop: "24px" }}
        >
          {activeTab === "templates" && (
            // Render the interview template slider here
            <Slider
              items={interviewTemplates}
              renderItem={(template: InterviewTemplate) => (
                <InterviewRoundCard
                  key={template.id}
                  title={template.title}
                  numberOfQuestions={template.numberOfQuestions}
                  roundId={template.id}
                  // Handle click event if needed
                />
              )}
            />
          )}

          <ButtonWrapper>
            <ElWrap w={250} h={40}>
              <TextIconBtnL
                disable={false}
                label="Start Meeting"
                icon={<PlusIcon />}
                onClick={joinCall}
                className={BackgroundColor.ACCENT_PURPLE}
              />
            </ElWrap>
            <ElWrap w={250} h={40}>
              <TextIconBtnL
                disable={false}
                label="Back to Start"
                icon={<RightBracketIcon />}
                onClick={cancelCall}
                className={BackgroundColor.WHITE}
              />
            </ElWrap>
          </ButtonWrapper>
        </Stack>
      </SelectBox>
    </Stack>
  );
}
