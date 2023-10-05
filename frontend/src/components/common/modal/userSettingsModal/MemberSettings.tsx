import React from "react";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { TextIconBtnL } from "../../buttons/textIconBtn/TextIconBtn";
import { BackgroundColor } from "@/features/utils/utilEnum";
import {
  DeleteBox,
  MemberDetailsContainer,
  MemberActionContainer,
  MemberInformationContainer,
  ProfilePicture,
} from "./StyledMemberSettings";
import { ModalContentWrap } from "../modalContents/StyledModalContents";
import {
  BodyLMedium,
  BodyMMedium,
  H3Bold,
} from "../../typeScale/StyledTypeScale";
import DropdownFilter from "../../filters/dropdownFilter/DropdownFilter";
import CheckBox from "../../form/checkBox/CheckBox";
import { TextBtnS } from "../../buttons/textBtn/TextBtn";
import { selectSetMember } from "@/features/members/memberSlice";
import { useSelector } from "react-redux";

interface UserModalProps {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  onClose: () => void;
}

const MemberSettings: React.FC<UserModalProps> = () => {
  const member = useSelector(selectSetMember);

  return (
    <ModalContentWrap>
      <MemberInformationContainer>
        <ProfilePicture src={member.pictureUrl} />
        <MemberDetailsContainer>
          <H3Bold>
            {member.firstName} {member.lastName}
          </H3Bold>
          <BodyLMedium style={{ opacity: 0.5 }}>{member.email}</BodyLMedium>
        </MemberDetailsContainer>
      </MemberInformationContainer>
      <MemberActionContainer>
        <DropdownFilter
          label="Departments"
          value=""
          onChange={() => {}}
          optionArr={[
            { name: "Department 1", value: "dept1" },
            { name: "Department 2", value: "dept2" },
          ]}
          dropdownName="Placeholder"
        />
        <CheckBox
          inputName="Check Box"
          label="Make Admin"
          onChange={() => {}}
          checked={false}
          disabled={false}
        />
        <DeleteBox>
          <BodyMMedium style={{ opacity: 0.5 }}>You can </BodyMMedium>
          <ElWrap w={50} h={10}>
            <TextBtnS
              label="delete"
              onClick={() => {}}
              disable={false}
              className=""
            />
          </ElWrap>
          <BodyMMedium style={{ opacity: 0.5 }}>
            {" "}
            your team members from all workspaces.
          </BodyMMedium>
        </DeleteBox>
      </MemberActionContainer>

      <ElWrap>
        <TextIconBtnL
          disable={false}
          onClick={() => {}}
          className={BackgroundColor.ACCENT_PURPLE}
          label="Save"
        />
      </ElWrap>
    </ModalContentWrap>
  );
};

export default MemberSettings;
