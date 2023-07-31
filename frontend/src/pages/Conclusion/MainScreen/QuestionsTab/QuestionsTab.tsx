import { H1 } from "@/components/common/typeScale/StyledTypeScale";
import React, { useMemo, useState } from "react";
import InterviewQNA from "../InterviewQNA/InterviewQNA";
import { questionTabInfo } from "./QuestionsTabConstants";

const QuestionsTab = () => {
  return (
    <InterviewQNA questionData={questionTabInfo?.data} screen={"question"} />
  );
};

export default QuestionsTab;
