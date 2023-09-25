// import { AppDispatch } from "@/app/store";
import {
  IconBtnL,
  IconBtnM,
} from "@/components/common/buttons/iconBtn/IconBtn";
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
import {
  getInterviewDetailAsync,
  selectInterviewDetail,
} from "@/features/interviewDetail/interviewDetailSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const InterviewStage = () => {
  const dispatch = useDispatch();
  const templateId = "1";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { topics, selectedSection, status } = useSelector(
    selectInterviewDetail
  );

  useEffect(() => {
    // Dispatch the action to fetch interview detail.
    dispatch(getInterviewDetailAsync(templateId));
  }, [dispatch, templateId]);

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
              onClick={() => {}}
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
