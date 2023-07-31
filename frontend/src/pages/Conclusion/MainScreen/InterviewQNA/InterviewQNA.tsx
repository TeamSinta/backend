import React, { useEffect, useState } from "react";
import "./InterviewQNA.css";

import { COMPETENCIES } from "../../Constants";
import styled from "styled-components";
import { QuestionsTabQNA, SummaryTabQNA, TranscriptionTabQNA } from "./Tabs";

//Styles

export const ChatStyled = styled.div`
  svg {
    width: 20px;
    height: 20px;
    stroke: black;
  }
`;

export const InterviewContainerStyle = styled.div`
   {
    font-weight: bold !important;
    cursor: pointer;
    padding: 10px;
    padding-left: 0px;
    padding-right: 10px;
  }
`;
export const IndexStyle = styled.div`
  span {
    border-radius: 5px;
    background-color: white;
    padding: 2px 10px;
    font-size: 10px;
    margin-right: 10px;
  }
`;

const InterviewQNA: React.FC<any> = ({ questionData, screen }) => {
  const [activeIndex, setActiveIndex] = useState<any>(null);
  const [data, setData] = useState<any>("");
  const [view, setView] = useState<any>("");
  useEffect(() => {
    setView(screen);
    setData(questionData);
  }, [screen, questionData]);

  const handleClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const getCompetencyStyle = (name: string) => {
    const color = COMPETENCIES?.data?.filter((a: any) => a.name === name)[0]
      .color;
    return {
      borderRadius: "10px",
      backgroundColor: color ?? "black",
      padding: "7px 16px",
      border: "1px solid #121212",
      fontSize: "10px",
      gap: "10px",
    };
  };

  const ViewQNA: React.FC<any> = () => {
    if (view === "summary")
      return (
        <SummaryTabQNA
          activeIndex={activeIndex}
          data={data}
          handleClick={handleClick}
        />
      );
    if (view === "question")
      return (
        <QuestionsTabQNA
          activeIndex={activeIndex}
          data={data}
          handleClick={handleClick}
          getCompetencyStyle={getCompetencyStyle}
        />
      );
    if (view === "transcription")
      return (
        <TranscriptionTabQNA
          activeIndex={activeIndex}
          data={data}
          handleClick={handleClick}
        />
      );
    return null;
  };

  return <ViewQNA />;
};

export default InterviewQNA;
