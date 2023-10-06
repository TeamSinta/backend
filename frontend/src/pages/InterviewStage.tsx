import {
  IconBtnL,
  IconBtnM,
} from "@/components/common/buttons/iconBtn/IconBtn";
import GlobalModal, { MODAL_TYPE } from "@/components/common/modal/GlobalModal";
import {
  EditIcon,
  PlusIcon,
  Star1Icon,
} from "@/components/common/svgIcons/Icons";
import {
  BodyLBold,
  BodyLMedium,
  H2Bold,
} from "@/components/common/typeScale/StyledTypeScale";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import InterviewOverviewDetails from "@/components/pages/interview/overview_detail/InterviewOverviewDetails";
import InterviewOverviewInterviewer from "@/components/pages/interview/overview_interviewer/InterviewOverviewInterviewer";
import InterviewOverviewSections from "@/components/pages/interview/overview_section/InterviewOverviewSections";
import {
  InterviewOverviewContainer,
  InterviewOverviewLayout,
  InterviewStageCardContainer,
  InterviewStageContainer,
  InterviewStageTopContainer,
  Subtitle,
  Title,
} from "@/components/pages/interview/StyledInterview";
import { getInterviewDetailAsync } from "@/features/interviewDetail/interviewDetailSlice";
import { openModal } from "@/features/modal/modalSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const InterviewStage = () => {
  const dispatch = useDispatch();
  const { templateId } = useParams();
  useEffect(() => {
    // Dispatch the action to fetch interview detail.
    dispatch(getInterviewDetailAsync(templateId));
  }, [dispatch, templateId]);

  const onClickModalOpen = (modalType: MODAL_TYPE) => {
    dispatch(
      openModal({
        modalType: modalType,
      })
    );
  };

  return (
    <InterviewStageContainer>
      <InterviewStageTopContainer>
        <Subtitle>
          <BodyLMedium className="inactive">Templates</BodyLMedium>
          <Star1Icon />
          <BodyLMedium className="inactive">FrontEnd Developer</BodyLMedium>
          <Star1Icon />
          <BodyLBold>Round 2: Coding Round</BodyLBold>
        </Subtitle>
        <InterviewStageCardContainer>
          <ElWrap w={56} h={134}>
            <IconBtnL
              disable={false}
              onClick={() => {
                console.log("hello");
                onClickModalOpen(MODAL_TYPE.CREATE_INT);
              }}
              className={BackgroundColor.ACCENT_PURPLE}
              icon={<PlusIcon />}
            />
          </ElWrap>
        </InterviewStageCardContainer>
      </InterviewStageTopContainer>
      <InterviewOverviewContainer>
        <Title>
          <H2Bold>Interview Overview</H2Bold>
          <ElWrap w={32} h={32}>
            <IconBtnM
              icon={<EditIcon />}
              disable={false}
              className={BackgroundColor.WHITE}
              onClick={() => {}}
            />
          </ElWrap>
        </Title>
        <GlobalModal></GlobalModal>
        <InterviewOverviewLayout>
          <div className="side">
            <InterviewOverviewInterviewer />
            <InterviewOverviewSections />
          </div>
          <InterviewOverviewDetails />
        </InterviewOverviewLayout>
      </InterviewOverviewContainer>
    </InterviewStageContainer>
  );
};

export default InterviewStage;
