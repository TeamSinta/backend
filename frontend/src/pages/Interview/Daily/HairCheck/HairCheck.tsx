import React, {
  useCallback,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
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
  Wrapper,
  HeadingBox,
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
import { fetchInterviewRounds } from "@/features/dashboardDetail/dashboardAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import {
  createInterviewRound,
  getCandidate,
} from "../../../../features/interviews/interviewsAPI";
import { useCookies } from "react-cookie";

interface HairCheckProps {
  joinCall: () => void;
  cancelCall: () => void;
  setInterviewRoundDetails: (
    details: { title: any; template_id: any; email: any } | null
  ) => Promise<boolean>;
}

interface InterviewTemplate {
  id: string;
  title: string;
  numberOfQuestions: string;
  image: string;
  // other properties...
}

interface interviewRound {
  role_title: string;
  disable: boolean;
  interviewers?: IMember[];
  id: string;
}

export default function HairCheck({
  joinCall,
  cancelCall,
  setInterviewRoundDetails,
}: HairCheckProps) {
  const localParticipant = useLocalParticipant();
  const { user } = useSelector((state: RootState) => state.user);
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
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<interviewRound[]>([]);
  const [candidateUsername, setCandidateUsername] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [cookies, ,] = useCookies(["access_token"]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // const setTemplate

  const startMeeting = async () => {
    if (candidateUsername === "") throw new Error("Empty candidate username");
    if (selectedTemplateId === "" || !selectedTemplateId)
      throw new Error("Empty selected template");

    // find candidate
    try {
      const candidate = await getCandidate(
        candidateUsername,
        cookies.access_token
      );
      // create interview round for the candidate using the selected template
      const title = candidate.first_name + "'s Interview";
      const candidateId = candidate.id;
      console.log(candidate);

      const response = await createInterviewRound(
        title,
        candidateId,
        selectedTemplateId,
        cookies.access_token
      );

      const interviewDetails = {
        id: response.id,
        title: response.title,
        template_id: response.template_id,
        email: candidate.email,
        name: candidate.first_name + " " + candidate.last_name,
        candidate_id: candidateId,
      };

      setInterviewRoundDetails(interviewDetails).then(() => {
        joinCall();
      });
    } catch (error) {
      console.log(error);
    }
  };

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInterviewRounds();
        setTemplates(data);
      } catch (error) {}
    };
    fetchData();
  }, []);

  // const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   callObject.setUserName(e.target.value);
  // };
  useEffect(() => {
    if (localParticipant && localParticipant.user_name === "") {
      callObject?.setUserName(user.username || "");
    }
  }, [localParticipant]);

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

  return getUserMediaError ? (
    <UserMediaError />
  ) : (
    <Wrapper onSubmit={join}>
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
        <HeadingBox>
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
        </HeadingBox>
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <Stack direction="column" alignItems="flex-start" spacing={1}>
            <BodySMedium style={{ marginTop: "18px" }}>Username</BodySMedium>

            <TextInput
              name="username"
              placeholder="Name"
              error={false}
              disable={true}
              value={localParticipant?.user_name || " "}
            />
          </Stack>
          <Stack direction="column" alignItems="flex-start" spacing={1}>
            <BodySMedium style={{ marginTop: "18px" }}>
              Candidate Username
            </BodySMedium>
            <TextInput
              name="candidateUsername"
              disable={false}
              placeholder="Name"
              error={false}
              value={candidateUsername}
              onChange={(e) => {
                setCandidateUsername(e.target.value);
              }}
            />
          </Stack>

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
              items={templates}
              renderItem={(template: interviewRound) => (
                <InterviewRoundCard
                  key={template.id}
                  templateId={template.id}
                  title={template.role_title}
                  onClick={(templateId) => {
                    setSelectedTemplateId(templateId);
                  }}
                  selected={selectedTemplateId === template.id}
                  // numberOfQuestions={template.numberOfQuestions}
                  // Handle click event if needed
                />
              )}
            />
          )}

          <ButtonWrapper>
            <ElWrap h={40}>
              <TextIconBtnL
                disable={false}
                label="Start Meeting"
                icon={<PlusIcon />}
                onClick={startMeeting}
                className={BackgroundColor.ACCENT_PURPLE}
              />
            </ElWrap>
            <ElWrap h={40}>
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
    </Wrapper>
  );
}
