import { H1 } from "@/components/common/typeScale/StyledTypeScale";
import React, { useMemo, useState } from "react";
import InterviewQNA from "../InterviewQNA/InterviewQNA";
import { transcriptionInfo } from "./TranscriptionTabConstants";

const TranscriptionTab = () => {
  return (
    <InterviewQNA
      screen={"transcription"}
      questionData={transcriptionInfo?.questionData}
    />
  );
};

export default TranscriptionTab;
