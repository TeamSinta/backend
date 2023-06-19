import { AppDispatch } from "@/app/store";
import TextIconBtn from "@/components/common/buttons/textIconBtn/TextIconBtn";
import Invite from "@/components/common/form/invite/Invite";
import Photo from "@/components/common/form/photo/Photo";
import Photos from "@/components/common/form/photo/Photos";
import TextInput from "@/components/common/form/textInput/TextInput";
import { PlusIcon } from "@/components/common/svgIcons/Icons";
import { iconLW } from "@/components/common/svgIcons/iconType";
import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";
import { inviteMemberSliceReset } from "@/features/inviteMember/inviteMemberSlice";
import { closeModal } from "@/features/modal/modalSlice";
import { IMember } from "@/features/roles/rolesInterface";
import {
  getMemberAsync,
  postData,
  roleSliceReset,
  selectRole,
  selectedMember,
  setCreateDepTitleInput,
} from "@/features/roles/rolesSlice";
import { useDispatch, useSelector } from "react-redux";
import { CreateDepWrap } from "./StyledRoles";
import { PhotoContainer } from "@/components/common/form/photo/StyledPhoto";

const titleInputArg = {
  label: "Title",
  error: false,
  disable: false,
  placeholder: "Title",
  name: "title",
};

const textIconBtnArg = {
  label: "CreateDepartment",
  icon: <PlusIcon {...iconLW} />,
  disable: false,
};

const CreateDepartment = () => {
  const { members, title } = useSelector(selectRole);
  const dispatch = useDispatch<AppDispatch>();

  const onMemberSelectd = (memberIdx: number) => {
    dispatch(selectedMember({ memberIdx: memberIdx }));
  };

  const onCreateDepTtileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCreateDepTitleInput({ [e.target.name]: e.target.value }));
  };

  const onCreateDepartmentClick = () => {
    dispatch(getMemberAsync());
    dispatch(postData());
    dispatch(closeModal());
    dispatch(inviteMemberSliceReset());
    dispatch(roleSliceReset());
  };

  return (
    <CreateDepWrap>
      <TextInput
        {...titleInputArg}
        onChange={(e) => {
          onCreateDepTtileChange(e);
        }}
        value={title}
      />
      <PhotoContainer>
        <BodySMedium>Members</BodySMedium>
        <Photos>
          {members.map((member: IMember, index: number) => (
            <Photo {...member} key={index} onSelect={onMemberSelectd} />
          ))}
        </Photos>
      </PhotoContainer>
      <Invite />
      <TextIconBtn {...textIconBtnArg} onClick={onCreateDepartmentClick} />
    </CreateDepWrap>
  );
};

export default CreateDepartment;
