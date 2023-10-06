import { AppDispatch } from "@/app/store";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import GlobalModal, { MODAL_TYPE } from "@/components/common/modal/GlobalModal";
import { EditIcon, PlusIcon } from "@/components/common/svgIcons/Icons";
import {
  H1,
  BodyLMedium,
  H2Medium,
  H2Bold,
} from "@/components/common/typeScale/StyledTypeScale";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { openModal } from "@/features/modal/modalSlice";
import { getMemberAsync } from "@/features/roles/rolesSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Stack, Box } from "@mui/material";
import TemplateHomeCard, {
  IMember,
} from "@/components/common/cards/teamplateHomeCard/TemplateHomeCard";
import { useState } from "react";
import { fetchInterviewRounds } from "@/features/dashboardDetail/dashboardAPI";
import { TemplateCardsBox } from "../Dashboard/StyledDashboard";
import { useNavigate } from "react-router-dom";
import { CreateInterviewBox, DepartmentHeading } from "./StyledTemplates";
import {
  IconBtnL,
  IconBtnM,
} from "@/components/common/buttons/iconBtn/IconBtn";
import DropdownFilter from "@/components/common/filters/dropdownFilter/DropdownFilter";

interface Template {
  role_title: string;
  disable: boolean;
  interviewers?: IMember[];
  id: string;
  department_name?: string;
}

const Templates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [templateData, setTemplateData] = useState<Template[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const onClickModalOpen = (modalType: MODAL_TYPE) => {
    dispatch(
      openModal({
        modalType: modalType,
      })
    );
  };

  const arg = {
    icon: <PlusIcon />,
    disable: false,
    className: BackgroundColor.ACCENT_PURPLE,
    onClick: () => {
      onClickModalOpen(MODAL_TYPE.CREATE_INT);
    },
  };

  useEffect(() => {
    dispatch(getMemberAsync());
    const fetchData = async () => {
      try {
        const data = await fetchInterviewRounds();
        setTemplateData(data);
      } catch (error) {}
    };
    fetchData();
  }, [dispatch]);

  const handleCardClick = (templateId: string) => {
    navigate(`/templates/${templateId}`);
  };

  const templatesByDepartment: { [key: string]: Template[] } =
    templateData.reduce((groups, template: Template) => {
      const department = template.department_name || "Unassigned";

      if (!groups[department]) {
        groups[department] = [];
      }

      groups[department].push(template);
      return groups;
    }, {} as { [key: string]: Template[] });

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

  if (!templateData) {
    return (
      <>
        <H1>Templates</H1>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          mt={4}
        >
          <img
            src="src/assets/svg/'Empty Roles' Page Illustration.svg"
            alt="template_empty_screen"
          />

          <H1>Work’s always better together.</H1>
          <Box sx={{ textAlign: "center" }}>
            <BodyLMedium>
              {" "}
              Start by creating a interview template.
              <br /> Invite your teammates to collaborate and quickly get a
              sense of what’s happening
              <br /> with interviews.{" "}
            </BodyLMedium>
          </Box>
          <ElWrap w={250} h={40}>
            <TextIconBtnL
              disable={false}
              label="Create New Template"
              icon={<PlusIcon />}
              onClick={() => {
                onClickModalOpen(MODAL_TYPE.CREATE_INT);
              }}
              className={BackgroundColor.ACCENT_PURPLE}
            />
          </ElWrap>
          <GlobalModal></GlobalModal>
        </Stack>
      </>
    );
  } else {
    return (
      <>
        <Stack direction="column" spacing={1}>
          <H2Bold>Create an interview</H2Bold>

          <CreateInterviewBox
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            ref={scrollContainerRef}
          >
            <ElWrap w={168} h={114}>
              <IconBtnL {...arg} />
            </ElWrap>
          </CreateInterviewBox>
        </Stack>
        <Stack direction="column" spacing={4}>
          <Stack
            direction="row"
            justifyContent="space-between"
            style={{ marginTop: "32px" }}
          >
            <H2Medium style={{ marginTop: "22px" }}>Your Templates</H2Medium>

            <ElWrap w={180}>
              <DropdownFilter
                label="Sort By"
                optionArr={[
                  { name: "Name (A-Z)", value: "name-asc" },
                  { name: "Name (Z-A)", value: "name-desc" },
                  { name: "Permission Level", value: "permission" },
                ]}
                dropdownName="sort"
              />
            </ElWrap>
          </Stack>

          {Object.entries(templatesByDepartment).map(
            ([department, templates]) => (
              <Stack
                key={department}
                direction="column"
                spacing={1}
                style={{ paddingLeft: "38px", paddingRight: "38px" }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ width: "100%" }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <DepartmentHeading>{department}</DepartmentHeading>
                    <BodyLMedium> · </BodyLMedium>
                    <BodyLMedium style={{ color: "grey" }}>
                      {templates?.length} Roles
                    </BodyLMedium>
                  </Stack>
                  <Box style={{ margin: "8px" }}>
                    <ElWrap w={32} h={32}>
                      <IconBtnM
                        icon={<EditIcon />}
                        disable={false}
                        className={BackgroundColor.WHITE}
                        onClick={() => {}}
                      />
                    </ElWrap>
                  </Box>
                </Stack>
                <TemplateCardsBox>
                  {templates.map(
                    (
                      template: Template // Specify the Template type
                    ) => (
                      <TemplateHomeCard
                        key={template.id}
                        title={template.role_title}
                        disable={template.disable || false}
                        questions={new Array(8)} // or you can provide actual data if available
                        sections={new Array(15)}
                        members={template.interviewers || []}
                        // Include other template information as needed
                        onClick={() => handleCardClick(template.id)}
                      />
                    )
                  )}
                </TemplateCardsBox>
              </Stack>
            )
          )}
          <GlobalModal></GlobalModal>
        </Stack>
      </>
    );
  }
};

export default Templates;
