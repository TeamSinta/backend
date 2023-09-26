import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  H3Bold,
  BodyLBold,
  BodySMedium,
} from "@/components/common/typeScale/StyledTypeScale";
import {
  OverviewSections,
  SectionLists,
  SectionList,
} from "./StyledOverviewSection";
import { Loading } from "@/features/utils/utilEnum";
import { Title } from "../StyledInterview";
import { useDispatch } from "react-redux";
import { setSelectedSection } from "@/features/interviewDetail/interviewDetailSlice";

import {
  TimeIcon,
  QuestionIcon,
  PlusIcon,
} from "@/components/common/svgIcons/Icons";
import { TimeQuestionDiv } from "../overview_detail/StyledOverviewDetail";
import { selectInterviewDetail } from "@/features/interviewDetail/interviewDetailSlice";
import { ISection } from "@/features/interviewDetail/inverviewDetailInterface";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import { BackgroundColor } from "@/features/utils/utilEnum";

const InterviewOverviewSections: React.FC = () => {
  const { sections, status, selectedSection, questions } = useSelector(
    selectInterviewDetail
  );
  const dispatch = useDispatch();

  // State to track the active section ID
  const [activeSectionId, setActiveSectionId] = useState<number | null>(
    selectedSection.id || null
  );

  // Function to handle button click
  const handleButtonClick = (sectionId: number) => {
    setActiveSectionId(sectionId);
    dispatch(setSelectedSection(sectionId));
  };

  // State to track the active section ID

  useEffect(() => {
    setActiveSectionId(selectedSection.id);
  }, [selectedSection]);

  return (
    <OverviewSections>
      <Title>
        <H3Bold>Sections</H3Bold>
      </Title>
      <SectionLists>
        {status === Loading.FULFILLED ? (
          sections.map((sectionItem: ISection, index: number) => (
            <SectionList
              key={index}
              className={activeSectionId === sectionItem.id ? "active" : ""}
              onClick={() => handleButtonClick(sectionItem)}
            >
              <BodyLBold>{sectionItem.topics_text}</BodyLBold>
              <TimeQuestionDiv>
                <div className="icon-div">
                  <TimeIcon />
                  <BodySMedium>{sectionItem.time} min</BodySMedium>
                </div>
                <div className="icon-div">
                  <QuestionIcon />
                  <BodySMedium>{questions?.length} Questions</BodySMedium>
                </div>
              </TimeQuestionDiv>
            </SectionList>
          ))
        ) : (
          <></>
        )}
      </SectionLists>
      <TextIconBtnL
        disable={false}
        onClick={() => {}}
        className={BackgroundColor.ACCENT_PURPLE}
        icon={<PlusIcon />}
        label="Add New Section"
      />
    </OverviewSections>
  );
};

export default InterviewOverviewSections;
