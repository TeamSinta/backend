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
import GlobalModal, { MODAL_TYPE } from "@/components/common/modal/GlobalModal";
import { openModal } from "@/features/modal/modalSlice";
import { useParams } from "react-router-dom";

const InterviewOverviewSections: React.FC = () => {
  const { sections, status, selectedSection, questions } = useSelector(
    selectInterviewDetail
  );
  const dispatch = useDispatch();
  const [activeSectionId, setActiveSectionId] = useState<number | null>(
    selectedSection?.id || null
  );
  const { templateId } = useParams();
  const templateID = templateId;

  const handleButtonClick = (sectionId: number) => {
    setActiveSectionId(sectionId);
    dispatch(setSelectedSection(sectionId));
  };

  // State to track the active section ID
  useEffect(() => {
    if (selectedSection) {
      setActiveSectionId(selectedSection.id);
    }
  }, [selectedSection]);

  const onClickModalOpen = (modalType: MODAL_TYPE, templateID: any) => {
    dispatch(
      openModal({
        modalType: modalType,
        templateID: templateID,
      })
    );
  };

  const getRelevantQuestionCount = (sectionId: number) => {
    const section = sections.find(
      (sectionItem) => sectionItem.id === sectionId
    );
    if (!section) return 0;

    const relevantQs =
      questions?.filter((q) => q.template_topic_id === section.id) || [];
    return relevantQs.length;
  };

  const getTotalReplyTime = (sectionId: number) => {
    const section = sections.find(
      (sectionItem) => sectionItem.id === sectionId
    );
    if (!section) return 0;

    const relevantQs =
      questions?.filter((q) => q.template_topic_id === section.id) || [];
    return relevantQs.reduce((acc, curr) => acc + (curr.reply_time || 0), 0);
  };

  return (
    <OverviewSections>
      <Title>
        <H3Bold>Sections</H3Bold>
      </Title>
      <SectionLists>
        {status === Loading.FULFILLED && Array.isArray(sections) ? (
          sections.map((sectionItem: ISection, index: number) => {
            const questionCount = getRelevantQuestionCount(sectionItem.id);
            const totalReplyTime = getTotalReplyTime(sectionItem.id);

            return (
              <SectionList
                key={index}
                className={activeSectionId === sectionItem.id ? "active" : ""}
                onClick={() => handleButtonClick(sectionItem)}
              >
                <BodyLBold>{sectionItem.topics_text}</BodyLBold>
                <TimeQuestionDiv>
                  <div className="icon-div">
                    <TimeIcon />
                    <BodySMedium>{totalReplyTime} min</BodySMedium>
                  </div>
                  <div className="icon-div">
                    <QuestionIcon />
                    <BodySMedium>{questionCount} Questions</BodySMedium>
                  </div>
                </TimeQuestionDiv>
              </SectionList>
            );
          })
        ) : (
          <></>
        )}
      </SectionLists>
      <div style={{ borderTop: "16px solid white" }}>
        <TextIconBtnL
          disable={false}
          onClick={() => {
            onClickModalOpen(MODAL_TYPE.SELECT_VAL, { templateID });
          }}
          className={BackgroundColor.ACCENT_PURPLE}
          icon={<PlusIcon />}
          label="Add New Section"
        />
      </div>
      <GlobalModal></GlobalModal>
    </OverviewSections>
  );
};

export default InterviewOverviewSections;
