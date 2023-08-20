import { AppDispatch } from "@/app/store";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import GlobalModal, { MODAL_TYPE } from "@/components/common/modal/GlobalModal";
import { PlusIcon } from "@/components/common/svgIcons/Icons";
import { H1, BodyLMedium } from "@/components/common/typeScale/StyledTypeScale";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { openModal } from "@/features/modal/modalSlice";
import { getMemberAsync } from "@/features/roles/rolesSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Stack, Box } from "@mui/material";

const Templates = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onClickModalOpen = (modalType: MODAL_TYPE) => {
    dispatch(
      openModal({
        modalType: modalType,
      })
    );
  };

  useEffect(() => {
    dispatch(getMemberAsync());
  });

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
            <br /> Invite your teammates to collaborate and quickly get a sense
            of what’s happening
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
};

export default Templates;
