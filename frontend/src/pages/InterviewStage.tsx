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
  InterviewStageBox,
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
import { openModal } from "@/features/modal/modalSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InterviewRoundCard from "@/components/common/cards/interviewRoundCard/InterviewRoundCard";
import { Template } from "./Templates_/Templates";
import { fetchInterviewRounds } from "@/features/dashboardDetail/dashboardAPI";
import { IMember } from "@/components/common/cards/teamplateHomeCard/TemplateHomeCard";
import { AppDispatch } from "@/app/store";

const InterviewStage = () => {
  const { questions } = useSelector(selectInterviewDetail);
  const dispatch = useDispatch<AppDispatch>();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [templateData, setTemplateData] = useState<Template[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (templateId) {
          dispatch(getInterviewDetailAsync(templateId));
          const data = await fetchInterviewRounds();
          setTemplateData(data);
        }
      } catch (error) {
        console.error("Error fetching interview rounds:", error);
      }
    };

    fetchData();
  }, [dispatch, templateId]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const x = scrollContainerRef.current
      ? e.pageX - scrollContainerRef.current.offsetLeft
      : e.pageX; // if there's no ref, just use the pageX value as fallback
    setStartX(x);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    e.preventDefault();

    const x = scrollContainerRef.current
      ? e.pageX - scrollContainerRef.current.offsetLeft
      : e.pageX;

    const scrollDistance = x - startX;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= scrollDistance;
    }

    setStartX(x);
  };

  const onClickModalOpen = (modalType: MODAL_TYPE) => {
    dispatch(openModal({ modalType }));
  };

  const handleCardClick = (roundId: string) => {
    navigate(`/templates/${roundId}`);
  };

  const numericTemplateId = Number(templateId || 0);
  const currentTemplate = templateData.find(
    (t) => Number(t.id) === numericTemplateId
  );
  const templatesOfSameDepartment = currentTemplate
    ? templateData.filter(
        (t) => t.department_name === currentTemplate.department_name
      )
    : [];

  return (
    <InterviewStageContainer>
      <InterviewStageTopContainer>
        <Subtitle>
          <BodyLMedium className="inactive">Templates</BodyLMedium>
          <Star1Icon />

          <BodyLMedium className="inactive">{`${
            currentTemplate?.department_name || "Unassigned"
          } `}</BodyLMedium>
          <Star1Icon />
          <BodyLBold>{`${currentTemplate?.role_title || ""} `}</BodyLBold>
        </Subtitle>
        <InterviewStageCardContainer>
          <InterviewStageBox
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            ref={scrollContainerRef}
          >
            {templatesOfSameDepartment.map((template: Template, index) => (
              <InterviewRoundCard
                key={index}
                image="https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512"
                title={template.role_title}
                numberOfQuestions={`${questions?.length || 0} Questions`}
                onClick={() => handleCardClick(template.id)}
                selected={Number(template.id) === numericTemplateId}
                members={template.interviewers?.map((interviewer: IMember) => ({
                  first_name: interviewer.first_name,
                  last_name: interviewer.last_name, // Assuming interviewer has a name property
                  profile_picture: interviewer.profile_picture, // You mentioned it's stored in profileURL
                }))}
              />
            ))}

            <ElWrap w={56} h={134}>
              <IconBtnL
                disable={false}
                onClick={() => {
                  onClickModalOpen(MODAL_TYPE.CREATE_INT);
                }}
                className={BackgroundColor.ACCENT_PURPLE}
                icon={<PlusIcon />}
              />
            </ElWrap>
          </InterviewStageBox>
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
              onClick={() => {
                onClickModalOpen(MODAL_TYPE.EDIT_INT);
              }}
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
