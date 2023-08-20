import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
import { BottomNavBar } from "./BottomNavBar";
import VideoSDK from "./VideoSDK";
import { RatingComponentL } from "../Interviews/Conclusion/MainScreen/InterviewQNA/RatingComponent";

const Interview = () => {
  const title = "FrontEnd Developer";
  const stage = "Round 3";
  const stageName = "Pair-Programming";
  const [activeTab, setActiveTab] = useState(1);
  const [initTime, setInitTime] = useState("");
  const [reactClicked, setReactClicked] = useState({ clicked: 0, message: "" });

  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  useEffect(() => {
    setInitTime(getCurrentTime());
  }, []);

  const sidebarTabs = useMemo(() => {
    return (
      <div style={{ display: "flex" }}>
        <span>
          {" "}
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
            <ImageText icon={<EmailIcon />} text={CANDIDATE_DETAILS.EMAIL} />
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
    const handleRating = () => {
      //setRating(rate);
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
                        {" "}
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
                            {" "}
                            <span>{activeQuestionInfo?.number}</span>{" "}
                          </div>
                        </WhiteIndexStyle>

                        <CompetencyStyle>
                          {" "}
                          <span>{activeQuestionInfo?.competency}</span>{" "}
                        </CompetencyStyle>
                      </div>
                    </Grid>{" "}
                    <p>{activeQuestionInfo?.question}</p>
                    <div style={{ marginTop: "10px" }}>
                      {" "}
                      <QuestionMeta question={activeQuestionInfo} />{" "}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Grid>
                        <RatingComponentL
                          question={activeQuestionInfo?.question}
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
                    {" "}
                    <StyledAnswerPoints>
                      <StyledAnswerHeading>
                        {"Answer/Prompt"}
                      </StyledAnswerHeading>

                      <span>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        It was popularised in the 1960s with the release of
                        Letraset sheets containing Lorem Ipsum passages, and
                        more recently with desktop publishing software like
                        Aldus PageMaker including versions of Lorem Ipsum.
                      </span>
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
              {" "}
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
                {" "}
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

  function InterviewSideBar(props: any) {
    const { reactClicked, setReactClicked } = props;
    return (
      <div style={{ justifyContent: "flex-end", display: "flex" }}>
        {/* {header} */}
        <StyledInterviewContent>
          <StyledTopView>
            <Grid lg={12}>
              <Grid container>
                <Grid lg={10} md={10} sm={10} xs={10}>
                  <span
                    style={{ fontWeight: "600", fontFamily: "ChillaxSemi" }}
                  >
                    {title}
                  </span>
                </Grid>
                <Grid lg={2} md={2} sm={2} xs={2}>
                  {" "}
                  <span style={{ float: "right" }}>
                    {" "}
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
                  {" "}
                  <p
                    style={{
                      fontWeight: "600",
                      fontFamily: "ChillaxSemi",
                      fontSize: activeTab === 1 ? "20px" : "12px",
                    }}
                  >
                    {CANDIDATE_DETAILS.NAME}
                  </p>{" "}
                  <br></br>
                </>
              ) : null}

              {activeTab === 1 ? <InfoTab /> : null}
              {activeTab === 2 ? (
                <InterviewQuestionTab data={QUESTIONS_DATA.data} />
              ) : null}
              {activeTab === 3 ? (
                <Notes
                  elapsedTime={initTime}
                  setReactClicked={setReactClicked}
                  reactClicked={reactClicked}
                />
              ) : null}
            </StyledTabInfo>
            <br></br>
          </StyledInnerDiv>
        </StyledInterviewContent>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Grid
        container
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          padding: "2%",
        }}
      >
        <Grid item xs={4} sm={4} md={8} lg={8}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {" "}
            <div>
              <img
                alt="sinta-logo"
                src="src\assets\images\Sinta Gray Logo.png"
                width="100"
                height="40"
              ></img>
            </div>{" "}
            <div
              style={{
                position: "relative",
                width: "100%",
                marginTop: "30px",

                color: "white",
              }}
            >
              <div>
                <VideoSDK />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={8} sm={8} md={4} lg={4}>
          <InterviewSideBar
            setReactClicked={setReactClicked}
            reactClicked={reactClicked}
          />
        </Grid>
      </Grid>

      <BottomNavBar
        setReactClicked={setReactClicked}
        reactClicked={reactClicked}
      />
    </div>
  );
};

export default Interview;
