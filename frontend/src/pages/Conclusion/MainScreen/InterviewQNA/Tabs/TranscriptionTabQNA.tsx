import React from "react";
import { IndexStyle, InterviewContainerStyle } from "../InterviewQNA";
import { Grid } from "@mui/material";
import { QuestionCollapsible } from "../QuestionCollapsible";
import { TranscriptionCollapsible } from "../TranscriptionCollapsible";
import { QuestionMeta } from "./QuestionTabQNA";

export const TranscriptionTabQNA: React.FC<any> = ({
  activeIndex,
  data,
  handleClick,
}) => {
  return (
    <div>
      {data?.map((question: any, index: number) => (
        <>
          <InterviewContainerStyle>
            <div
              key={index}
              style={{
                fontSize: "12px",
                lineHeight: "15px",
              }}
              onClick={() => handleClick(index)}
            >
              <div>
                <Grid container spacing={1} style={{ margin: "0px" }}>
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
                </Grid>
                <div style={{ marginTop: "10px" }}>
                  <QuestionMeta question={question} />
                </div>
                <TranscriptionCollapsible
                  question={question}
                  index={index}
                  activeIndex={activeIndex}
                />
              </div>
            </div>
          </InterviewContainerStyle>
        </>
      ))}
    </div>
  );
};
