import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import {
  TimeIcon,
  QuestionIcon,
  PlusIcon,
} from "@/components/common/svgIcons/Icons";
import {
  H3Bold,
  BodyLBold,
  BodySMedium,
} from "@/components/common/typeScale/StyledTypeScale";
import { BackgroundColor, Loading } from "@/features/utils/utilEnum";
import { Title } from "../StyledInterview";
import { TimeQuestionDiv } from "../overview_detail/StyledOverviewDetail";
import {
  OverviewSections,
  SectionLists,
  SectionList,
} from "./StyledOverviewSection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ISection } from "@/features/interviewDetail/inverviewDetailInterface";
import { AppDispatch } from "@/app/store";
import {
  getInterviewDetailAsync,
  selectInterviewDetail,
} from "@/features/interviewDetail/interviewDetailSlice";

const InterviewOverviewSections = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { section, status, selectedSection } = useSelector(
    selectInterviewDetail
  );

  return (
    <OverviewSections>
      <Title>
        <H3Bold>Sections</H3Bold>
      </Title>
      <SectionLists>
        {status === Loading.FULFILLED ? (
          section.map((section: ISection, index: number) => (
            <SectionList
              key={index}
              className={selectedSection.id === section.id ? "active" : ""}
            >
              <BodyLBold>{section.title}</BodyLBold>
              <TimeQuestionDiv>
                <div className="icon-div">
                  <TimeIcon />
                  <BodySMedium>{section.time} min</BodySMedium>
                </div>
                <div className="icon-div">
                  <QuestionIcon />
                  <BodySMedium>
                    {section.questions?.length} Questions
                  </BodySMedium>
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
