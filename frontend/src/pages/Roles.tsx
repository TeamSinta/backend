import { AppDispatch } from "@/app/store";
import TextIconBtn from "@/components/common/buttons/textIconBtn/TextIconBtn";
import GlobalModal from "@/components/common/modal/GlobalModal";
import { PlusIcon } from "@/components/common/svgIcons/Icons";
import { iconLW } from "@/components/common/svgIcons/iconType";
import { H1 } from "@/components/common/typeScale/StyledTypeScale";
import CreateDepartment from "@/components/pages/roles/CreateDepartment";
import { openModal } from "@/features/modal/modalSlice";
import { getMemberAsync } from "@/features/roles/rolesSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const textIconBtnArg = {
  label: "CreateDepartment",
  icon: <PlusIcon {...iconLW} />,
  disable: false,
};

const Roles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleOpenLoginModal = () => {
    dispatch(
      openModal({
        modalType: "Modal",
      })
    );
  };

  useEffect(() => {
    dispatch(getMemberAsync());
  });

  return (
    <>
      <H1>Roles</H1>
      {/* ===== I will move this part when Sammy finish tab task : START=====*/}
      <TextIconBtn {...textIconBtnArg} onClick={handleOpenLoginModal} />
      <GlobalModal title="Create New Department">
        <CreateDepartment></CreateDepartment>
      </GlobalModal>
      {/* ============================= END ================================== */}
    </>
  );
};

export default Roles;
