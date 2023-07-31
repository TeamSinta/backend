import React, { useState } from "react";
import {
  ClockIcon,
  SoundLevelIcon,
} from "@/components/common/svgIcons/CustomIcons";
import {
  ChatStyled,
  IndexStyle,
  InterviewContainerStyle,
} from "../InterviewQNA";
import { Grid } from "@mui/material";
import { QuestionCollapsible } from "../QuestionCollapsible";
import { ChatIcon } from "@/components/common/svgIcons/Icons";
import { RatingComponent } from "../RatingComponent";
export const QuestionMeta: React.FC<any> = ({
  question,
  width = "",
  height = "",
}) => {
  return (
    <p>
      <div
        className="container"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div style={{ opacity: "0.5", margin: "0px", padding: "0px" }}>
          <ClockIcon width={15} height={15} active={0} />
        </div>
        <div
          className="text"
          style={{
            fontSize: "10px",
            fontWeight: "400",
            padding: "0px",
            margin: "0px",
          }}
        >
          {question?.duration}
        </div>
        <div style={{ opacity: "0.5", marginLeft: "5px" }}>
          <SoundLevelIcon width={15} height={15} active={0} />
        </div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "400",
            padding: "0px 5px",
            margin: "0px",
          }}
        >
          {"Low"}
        </div>
      </div>
    </p>
  );
};

export const QuestionsTabQNA: React.FC<any> = ({
  activeIndex,
  data,
  handleClick,
  getCompetencyStyle,
}) => {
  const [rating, setRating] = useState<number>(0);
  const handleRating = (question: any, rate: number) => {
    //setRating(rate);
  };
  return (
    <div>
      {data?.map((question: any, index: number) => (
        <>
          <InterviewContainerStyle>
            <Grid
              container
              spacing={1}
              className="interview-qna-item"
              key={index}
              style={{
                fontSize: "12px",
                margin: "0px",
                padding: "0px",
              }}
              onClick={() => handleClick(index)}
            >
              <Grid xs={11} md={11}>
                {" "}
                <div style={{ display: "flex" }}>
                  <IndexStyle>
                    <div>
                      {" "}
                      <span>{index + 1}</span>{" "}
                    </div>
                  </IndexStyle>
                  <QuestionCollapsible
                    index={index}
                    activeIndex={activeIndex}
                    question={question}
                  />
                </div>
              </Grid>
              <Grid xs={1} md={1}>
                <div
                  style={{
                    padding: "0px 0px",
                    float: "right",
                  }}
                >
                  <ChatStyled>
                    <ChatIcon />
                  </ChatStyled>
                </div>
              </Grid>
            </Grid>
          </InterviewContainerStyle>

          <Grid
            container
            spacing={1}
            className=""
            key={index}
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              padding: "0px 0px",
              fontSize: "12px",
              margin: "0px",
              marginBottom: "15px",
              marginTop: "3px",
            }}
          >
            <Grid xs={12} md={3} style={{ marginTop: "0px" }}>
              <div>
                <span style={getCompetencyStyle(question?.competency)}>
                  {question?.competency}
                </span>{" "}
              </div>
            </Grid>
            <Grid xs={12} md={4} style={{ marginTop: "0px" }}>
              <QuestionMeta question={question} />
            </Grid>
            <Grid xs={12} md={3} style={{ marginTop: "0px" }}>
              <div className="container" style={{ marginTop: "-5px" }}>
                {" "}
                <div className="icon">
                  <RatingComponent
                    question={question}
                    setRating={handleRating}
                    rating={question?.rating}
                  />{" "}
                </div>
              </div>
            </Grid>
          </Grid>
          <div
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              fontWeight: "400",
              borderRadius: "5px",
              backgroundColor: "white",
              fontSize: "10px",
              padding: "20px",
            }}
            className={`question-answer ${activeIndex === index ? "show" : ""}`}
          >
            eee
          </div>

          <hr style={{ opacity: "0.25" }}></hr>
        </>
      ))}
    </div>
  );
};
