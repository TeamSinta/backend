import { Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  StyledIcon,
  StyledInfoDescription,
  StyledInterviewContent,
  StyledTabInfo,
  IndexStyle,
  CompetencyStyle,
  WhiteIndexStyle,
  StyledInnerWrapper,
  StyledAnswerPoints,
  StyledInnerDiv,
  StyledTopView,
  BottomQuestionButtons,
  StyledAnswerHeading,
  VideoScreenWrapper,
  EmojiOverlayWrapper,
} from "./StyledInterview";
import { NavButton } from "@/components/layouts/sidenavbar/StyledSideNavBar";
import { CANDIDATE_DETAILS, QUESTIONS_DATA } from "./InterviewConstant";
import {
  BottomArrowIcon,
  EmailIcon,
  LeftArrowIcon,
  LinkedinIcon,
  MapIcon,
  PhoneIcon,
  ResumeIcon,
  RightArrowIcon,
} from "@/components/common/svgIcons/Icons";
import InterviewStageSlider from "./InterviewStageSlider";
import { QuestionMeta } from "../Interviews/Conclusion/MainScreen/InterviewQNA/Tabs/QuestionTabQNA";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { StyledIconBtnM } from "@/components/common/buttons/button/StyledBtn";
import { Notes } from "./Notes";
import "./index.css";
import { BottomNavBar } from "./Daily/BottomNavBar";
import { RatingComponentL } from "../Interviews/Conclusion/MainScreen/InterviewQNA/RatingComponent";
import Call from "./Daily/Call/Call";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { startCall } from "@/features/videoCall/videoCallSlice";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  getTemplateQuestionsAndTopics,
  sendFeedback,
  updateInterviewQuestionRating,
} from "../../features/interviews/interviewsAPI";
import { Cookies, useCookies } from "react-cookie";
import { useDaily } from "@daily-co/daily-react";

const Interview = ({ leaveCall, interviewDetails }) => {
  const title = "FrontEnd Developer";
  const stage = "Round 3";
  const stageName = "Pair-Programming";
  const [activeTab, setActiveTab] = useState(1);
  const [initTime, setInitTime] = useState("");
  const [templateQuestionsAndTopics, setTemplateQuestionsAndTopics] =
    useState(null);
  const { width } = useWindowSize();
  const [reactClicked, setReactClicked] = useState({
    clicked: 0,
    message: "",
    position: {
      left: 0,
      top: 0,
    },
  });
  const [isInterviewSideBarCollapsed, setIsInterviewSideBarCollapsed] =
    useState(false);
  const [cookies, ,] = useCookies(["access_token"]);
  const callObject = useDaily();

  // Placeholder for functionality. Moe will have to update this once the videoscreen is done and we have correct reducers/states.

  const { active_call } = useSelector((state: RootState) => state.videoCall);
  const dispatch: AppDispatch = useDispatch();

  const collapseInterviewSideBar = () => {
    setIsInterviewSideBarCollapsed(!isInterviewSideBarCollapsed);
  };

  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    setInitTime(getCurrentTime());
    // placeholder dispatch for functionality, sets call as active to allow correct fullscreen rendering in App
    dispatch(startCall(true));
    // placeholder dispatch end //
  }, [active_call, dispatch]);

  useEffect(() => {
    const { message, position } = reactClicked;
    window.dispatchEvent(
      new CustomEvent("reaction_added", { detail: { message, position } })
    );
  }, [reactClicked]);

  useEffect(() => {
    if (width && width < 900) {
      setIsInterviewSideBarCollapsed(true);
    }
  }, [width]);

  useEffect(() => {
    const fetchQuestionsAndTopics = async () => {
      // get the template questions
      const response = await getTemplateQuestionsAndTopics(
        interviewDetails.template_id,
        cookies.access_token
      );
      setTemplateQuestionsAndTopics(response);
    };

    fetchQuestionsAndTopics();
  }, [interviewDetails]);

  const sidebarTabs = useMemo(() => {
    return (
      <div style={{ display: "flex" }}>
        <span>
          <NavButton
            onClick={() => setActiveTab(1)}
            direction="row"
            style={{
              fontSize: "12px",
              height: "30px",
              borderRadius: "10px",
              width: "fit-content",
              padding: "17px 19px",
              lineHeight: "125%",
            }}
            className={activeTab === 1 ? "rightTabs active" : "rightTabs"}
          >
            <span>Info</span>
          </NavButton>{" "}
        </span>
        <span>
          <NavButton
            onClick={() => setActiveTab(2)}
            direction="row"
            style={{
              fontSize: "12px",
              height: "30px",
              borderRadius: "10px",
              width: "fit-content",
              marginLeft: "5px",
              padding: "17px 19px",
            }}
            className={activeTab === 2 ? "rightTabs active" : "rightTabs"}
          >
            <span>Questions</span>
          </NavButton>{" "}
        </span>
        <span>
          <NavButton
            onClick={() => setActiveTab(3)}
            direction="row"
            style={{
              fontSize: "12px",
              height: "30px",
              borderRadius: "10px",
              width: "fit-content",
              marginLeft: "5px",
              padding: "17px 19px",
            }}
            className={activeTab === 3 ? "rightTabs active" : "rightTabs"}
          >
            <span>Notes</span>
          </NavButton>
        </span>
      </div>
    );
  }, [activeTab]);

  const InfoTab = () => {
    const ImageText = (data: any) => {
      const { icon, text } = data;
      return (
        <div
          style={{
            display: "flex",
            fontSize: "10px",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              marginRight: "5px",
            }}
          >
            <StyledIcon>{icon}</StyledIcon>
          </span>
          <span>{text}</span>
        </div>
      );
    };

    const ImageLinkText = (data: any) => {
      const { icon, text, link, textDecoration } = data;
      return (
        <div
          style={{
            display: "flex",
            fontSize: "10px",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              marginRight: "5px",
            }}
          >
            <StyledIcon>{icon}</StyledIcon>
          </span>
          <span>
            <a style={{ textDecoration: textDecoration }} href={link}>
              {text}
            </a>
          </span>
        </div>
      );
    };
    const briefInfo = useMemo(() => {
      return (
        <>
          <Grid container>
            {" "}
            <ImageText icon={<EmailIcon />} text={interviewDetails.email} />
          </Grid>
          <br></br>
          <Grid container>
            <Grid md={6}>
              {" "}
              <ImageText
                icon={<MapIcon />}
                text={CANDIDATE_DETAILS.LOCATION}
              />{" "}
              <br></br>
              <ImageLinkText
                icon={<ResumeIcon />}
                text={"Resume.pdf"}
                link={CANDIDATE_DETAILS.LINKEDIN}
                textDecoration={"normal"}
              />
            </Grid>
            <Grid md={6}>
              {" "}
              <ImageText
                icon={<PhoneIcon />}
                text={CANDIDATE_DETAILS.PHONE}
              />{" "}
              <br></br>
              <ImageLinkText
                icon={<LinkedinIcon />}
                text={"LinkedIn "}
                link={CANDIDATE_DETAILS.LINKEDIN}
                textDecoration={"underline"}
              />
            </Grid>
          </Grid>
        </>
      );
    }, []);
    const jobDescription = useMemo(() => {
      return (
        <StyledInfoDescription>
          {CANDIDATE_DETAILS.DESCRIPTION}
        </StyledInfoDescription>
      );
    }, []);

    const competencies = useMemo(() => {
      return (
        <div style={{ fontSize: "12px" }}>
          <p
            style={{
              fontWeight: "600",
              fontSize: "12px",
              fontFamily: "ChillaxSemi",
            }}
          >
            {"Competencies"}
          </p>
          <br></br>
          <div style={{ display: "flex" }}>
            {CANDIDATE_DETAILS.COMPETENCIES.map((a) => {
              return <CompetencyStyle>{a}</CompetencyStyle>;
            })}{" "}
          </div>
        </div>
      );
    }, []);

    return (
      <>
        {briefInfo}
        <br></br>
        {jobDescription} <br></br>
        {competencies}
      </>
    );
  };
  const InterviewQuestionTab = (info: any) => {
    const { data } = info;
    const [activeData, setActiveData] = useState(data[0]);
    const [activeQuestionInfo, setActiveQuestionInfo] = useState<any>("");
    const [collapseQuestion, setCollapseQuestion] = useState(false);
    const [prevNum, setPrevNum] = useState(0);
    const [nextNum, setNextNum] = useState(2);
    const showQuestionDetail = (questionInfo: any) => {
      setCollapseQuestion(true);
      setActiveQuestionInfo(questionInfo);
      const currentNumber = parseInt(questionInfo.number);
      const prevNumber = currentNumber - 1;
      const nextNumber = currentNumber + 1;

      setPrevNum(prevNumber);
      setNextNum(nextNumber);
    };
    const handleRating = (rating: number, question: string) => {
      // update interview round question rating to new rating
      updateInterviewQuestionRating(
        rating,
        question,
        interviewDetails.id,
        cookies.access_token
      );
    };

    useEffect(() => {
      setCollapseQuestion(false);
    }, [activeData]);

    function resetList() {
      setCollapseQuestion(false);
    }

    return (
      <div style={{ flex: "1", flexDirection: "column", display: "flex" }}>
        <InterviewStageSlider
          data={data}
          setActiveData={setActiveData}
          resetList={resetList}
        />

        <StyledInnerWrapper>
          {" "}
          {!collapseQuestion
            ? activeData?.questions?.map((a: any, index: any) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "12px",
                      lineHeight: "15px",
                      borderRadius: "10px",
                      padding: "15px 10px",
                      backgroundColor: "white",
                      margin: "5px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      opacity: index === 0 ? "0.5" : "1",
                    }}
                    onClick={() => {
                      showQuestionDetail(a);
                    }}
                  >
                    <IndexStyle>
                      <div>
                        <span>{a.number}</span>{" "}
                      </div>
                    </IndexStyle>
                    <div>{a.question}</div>
                  </div>
                );
              })
            : null}
          {collapseQuestion ? (
            <div
              className="question-detail"
              style={{
                fontSize: "14px",
              }}
            >
              <div style={{ marginTop: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <div>
                    <Grid>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",

                          marginBottom: "12px",
                        }}
                      >
                        <WhiteIndexStyle>
                          <div>
                            <span>{activeQuestionInfo?.number}</span>{" "}
                          </div>
                        </WhiteIndexStyle>

                        <CompetencyStyle>
                          <span>{activeQuestionInfo?.competency}</span>{" "}
                        </CompetencyStyle>
                      </div>
                    </Grid>{" "}
                    <p>{activeQuestionInfo?.question}</p>
                    <div style={{ marginTop: "10px" }}>
                      <QuestionMeta
                        question={activeQuestionInfo}
                        duration={""}
                      />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Grid>
                        <RatingComponentL
                          interviewRoundId={interviewDetails.id}
                          question={activeQuestionInfo?.question}
                          id={activeQuestionInfo?.id}
                          setRating={handleRating}
                          rating={activeQuestionInfo?.rating}
                          width={40}
                          height={40}
                        />{" "}
                      </Grid>
                    </div>
                  </div>
                  <div
                    style={{ flex: "1", marginTop: "20px", overflowY: "auto" }}
                  >
                    <StyledAnswerPoints>
                      <StyledAnswerHeading>
                        {"Answer/Prompt"}
                      </StyledAnswerHeading>

                      <span>{activeQuestionInfo?.answer}</span>
                    </StyledAnswerPoints>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </StyledInnerWrapper>

        {collapseQuestion ? (
          <BottomQuestionButtons>
            <div
              style={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "transparent",
              }}
            >
              <span
                style={{
                  backgroundColor: "transparent",
                  opacity:
                    parseInt(activeQuestionInfo?.number) === 1 ? "0.5" : "1",
                }}
                onClick={() => {
                  if (parseInt(activeQuestionInfo?.number) !== 1) {
                    setNextNum(nextNum - 1);
                    setActiveQuestionInfo(
                      activeData?.questions?.filter(
                        (a: any) => parseInt(a.number) === prevNum
                      )[0]
                    );
                    setPrevNum(prevNum - 1);
                  }
                }}
              >
                <ElWrap w={33}>
                  <StyledIconBtnM>
                    <RightArrowIcon />
                  </StyledIconBtnM>
                </ElWrap>
              </span>
              <span
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  backgroundColor: "transparent",
                }}
                onClick={() => {
                  setCollapseQuestion(false);
                }}
              >
                <StyledIconBtnM
                  style={{ padding: "1rem 1.25rem", backgroundColor: "white" }}
                >
                  See All
                </StyledIconBtnM>
              </span>
              <span
                style={{
                  backgroundColor: "transparent",
                  opacity:
                    parseInt(activeQuestionInfo.number) ===
                    activeData?.questions?.length
                      ? "0.5"
                      : "1",
                }}
                onClick={() => {
                  if (
                    parseInt(activeQuestionInfo?.number) !==
                    activeData?.questions?.length
                  ) {
                    setActiveQuestionInfo(
                      activeData?.questions?.filter(
                        (a: any) => parseInt(a.number) === nextNum
                      )[0]
                    );
                    setNextNum(nextNum + 1);
                    setPrevNum(prevNum + 1);
                  }
                }}
              >
                <ElWrap w={33}>
                  <StyledIconBtnM>
                    <LeftArrowIcon />
                  </StyledIconBtnM>
                </ElWrap>
              </span>{" "}
            </div>
          </BottomQuestionButtons>
        ) : null}
      </div>
    );
  };

  const interviewSideBarData = (
    <>
      <StyledTopView>
        <Grid lg={12}>
          <Grid container>
            <Grid lg={10} md={10} sm={10} xs={10}>
              <span style={{ fontWeight: "600", fontFamily: "ChillaxSemi" }}>
                {interviewDetails.title}
              </span>
            </Grid>
            <Grid lg={2} md={2} sm={2} xs={2}>
              <span
                onClick={collapseInterviewSideBar}
                style={{ float: "right" }}
              >
                <BottomArrowIcon />
              </span>
            </Grid>
          </Grid>
        </Grid>
        <br></br>
        <Grid lg={11}>
          <div
            style={{
              backgroundColor: "#F6F6FB",
              padding: "10px",
              borderRadius: "10px",
              display: "flex",
              fontSize: "9px",
              alignItems: "center",
              alignContent: "center",
              width: "fit-content",
            }}
          >
            <span style={{ fontWeight: "lighter", marginLeft: "2px" }}>
              {stage + ": "}
            </span>
            <span
              style={{
                fontWeight: "600",
                fontFamily: "ChillaxSemi",
                marginLeft: "2px",
              }}
            >
              {stageName}
            </span>{" "}
          </div>
        </Grid>{" "}
        <br></br>
        {sidebarTabs}{" "}
      </StyledTopView>
      <br></br>
      <StyledInnerDiv>
        <StyledTabInfo>
          {activeTab === 1 ? (
            <>
              <p
                style={{
                  fontWeight: "600",
                  fontFamily: "ChillaxSemi",
                  fontSize: activeTab === 1 ? "20px" : "12px",
                }}
              >
                {interviewDetails.name}
              </p>{" "}
              <br></br>
            </>
          ) : null}

          {activeTab === 1 ? <InfoTab /> : null}
          {activeTab === 2 ? (
            <InterviewQuestionTab data={templateQuestionsAndTopics?.data} />
          ) : null}
          {activeTab === 3 ? (
            <Notes
              notesEntered={notesEntered}
              elapsedTime={initTime}
              setReactClicked={setReactClicked}
              reactClicked={reactClicked}
            />
          ) : null}
        </StyledTabInfo>
        <br></br>
      </StyledInnerDiv>
    </>
  );

  const InterviewSideBarWaiting = () => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
      // This function will toggle the opacity between 1 and 0
      const fade = () => {
        setOpacity((prevOpacity) => (prevOpacity === 1 ? 0 : 1));
      };

      // Start an interval to toggle the opacity
      const intervalId = setInterval(fade, 2000); // Change opacity every 3 seconds

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }, []);

    return (
      <Grid
        style={{
          height: "100%", // Adjust the height as needed
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontWeight: "600",
            fontFamily: "ChillaxSemi",
            fontSize: "1.5em",
            width: "100%",
            opacity: opacity, // Apply dynamic opacity value
            transition: "opacity 1.5s ease-in-out", // Smooth transition for opacity change
          }}
        >
          Waiting for candidate...
        </span>
      </Grid>
    );
  };

  function InterviewSideBar(props: any) {
    const { reactClicked, setReactClicked } = props;
    return (
      <div style={{ justifyContent: "flex-end", display: "flex" }}>
        {/* {header} */}
        <StyledInterviewContent isCollapsed={isInterviewSideBarCollapsed}>
          {interviewDetails.id !== "" && interviewDetails.id !== null ? (
            interviewSideBarData
          ) : (
            <InterviewSideBarWaiting />
          )}
        </StyledInterviewContent>
      </div>
    );
  }
  const emojiClicked = (e, emoji: string, emojiNumber: number) => {
    // send feedback
    const data = {
      interview_round: interviewDetails.id,
      user: interviewDetails.candidate_id,
      reaction: emojiNumber,
    };

    sendFeedback(data, cookies.access_token);
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setReactClicked({
      clicked: reactClicked?.clicked + 1,
      message: emoji,
      position: {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
      },
    });
  };

  function notesEntered(notes: string) {
    console.log("notes: ", notes);
    // send feedback
    const data = {
      interview_round: interviewDetails.id,
      user: interviewDetails.candidate_id,
      note: notes,
    };

    sendFeedback(data, cookies.access_token);
  }

  function EmojiOverlay() {
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      window.addEventListener("reaction_added", handleSendFlyingEmoji);

      // Clean up the event listener
      return () => {
        window.removeEventListener("reaction_added", handleSendFlyingEmoji);
      };
    }, []);

    const handleRemoveFlyingEmoji = useCallback((node) => {
      if (!overlayRef.current) return;
      overlayRef.current.removeChild(node);
    }, []);

    function handleSendFlyingEmoji(e) {
      console.log(e);
      const emoji = e.detail.message;
      const position = e.detail.position;

      if (emoji) {
        callObject.sendAppMessage({ message: `${emoji}` }, "*");
        handleDisplayFlyingEmoji(emoji, position);
      }
    }

    const handleDisplayFlyingEmoji = useCallback(
      (emoji, position) => {
        if (!overlayRef.current) {
          return;
        }

        const node = document.createElement("div");
        node.appendChild(document.createTextNode(emoji));
        node.className =
          Math.random() * 1 > 0.5 ? "emoji wiggle-1" : "emoji wiggle-2";
        node.style.transform = `rotate(${-30 + Math.random() * 60}deg)`;
        node.style.left = `${position.left}px`; // Starting position from the button
        node.style.top = `${position.top - 70}px`; // Starting position from the button
        node.style.position = "absolute";
        overlayRef.current.appendChild(node);

        node.addEventListener("animationend", (e) =>
          handleRemoveFlyingEmoji(e.target)
        );
      },
      [handleRemoveFlyingEmoji]
    );

    const handleReceiveFlyingEmoji = useCallback(
      (e) => {
        if (!overlayRef.current) {
          return;
        }
        handleDisplayFlyingEmoji(e.data.message, e.data.position);
      },
      [handleDisplayFlyingEmoji]
    );

    return <EmojiOverlayWrapper ref={overlayRef} />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Grid
        container
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          padding: "2%",
        }}
      >
        <Grid item xs={4} sm={4} md={8} lg={8} style={{ height: "100%" }}>
          <VideoScreenWrapper>
            <div>
              <img
                alt="sinta-logo"
                src="src/assets/images/Sinta Gray Logo.png"
                width="100"
                height="40"
              />
            </div>
            <div
              style={{
                position: "relative",
                width: "100%",
                color: "white",
              }}
            >
              <div>
                <Call />
              </div>
            </div>
          </VideoScreenWrapper>
        </Grid>
        <Grid item xs={8} sm={8} md={4} lg={4} style={{ height: "100%" }}>
          <InterviewSideBar
            setReactClicked={setReactClicked}
            reactClicked={reactClicked}
          />
        </Grid>
      </Grid>
      <BottomNavBar
        emojiClicked={emojiClicked}
        setReactClicked={setReactClicked}
        reactClicked={reactClicked}
        leaveCall={leaveCall}
      />
      {<EmojiOverlay />}
    </div>
  );
};

export default Interview;
