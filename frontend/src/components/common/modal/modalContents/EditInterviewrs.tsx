import { AppDispatch } from "@/app/store";
import Photo from "@/components/common/buttons/photo/Photo";
import Photos from "@/components/common/buttons/photo/Photos";
import { PhotoContainer } from "@/components/common/buttons/photo/StyledPhoto";
import { TextBtnL } from "@/components/common/buttons/textBtn/TextBtn";
import Invite from "@/components/common/form/invite/Invite";
import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { closeModal} from "@/features/modal/modalSlice";
// import { selectedMember } from "@/features/roles/rolesSlice";
import { BackgroundColor, PhotoType } from "@/features/utils/utilEnum";
import { useDispatch, useSelector } from "react-redux";
import { ModalContentWrap } from "./StyledModalContents";
import { useState } from "react";
import { RootState } from "@/app/store";

import {
  AccessToken,
  CompanyID,
} from "@/features/settingsDetail/userSettingTypes";
import { useCookies } from "react-cookie";
import { useFetchCompanyMembers } from "@/components/pages/settings/memberTab/useFetchAndSortMembers";



const EditInterviewers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const workspace = useSelector((state: RootState) => state.workspace);
  const [sortCriteria,] = useState("");
  const [departmentId,] = useState("");

  const [cookies, ,] = useCookies(["access_token"]);
  const accessToken = cookies.access_token as AccessToken;
  // definitely should look over this, idk what TS is doing here om on the companyId type.
  const companyId: CompanyID = (!workspace.id
    ? user.companies[0].id
    : workspace.id)! as unknown as CompanyID;
  const { members } = useFetchCompanyMembers({
    access: accessToken,
    company_id: companyId,
    department_id: departmentId,
    sortCriteria: sortCriteria,
  });

  // const onMemberSelected = (memberIdx: number) => {
  //   dispatch(selectedMember({ memberIdx: memberIdx }));
  // };


  const handleNext = () => {
    // Define the data to send to the server
    dispatch(closeModal());
    // Handle UPDATE Request
    // const requestData = {
    //   role_title: inputValue.title,
    //   location: null,
    //   interviewer_ids: members
    //     .filter((member) => member.selected)
    //     .map((member) => member.member_idx),
    //   company_id: companyId,
    //   department_id: null,
    //   // Assuming the department_id is null as shown in the example. Replace as needed.
    // };

    // axios
    //   .post("http://localhost:8000/api/templates/", requestData)
    //   .then((response) => {
    //     // Handle success, e.g., show a success message or navigate to the next step
    //     const templateID = response.data.id;
    //     // Pass the template ID as a parameter
    //   })
    //   .catch((error) => {
    //     // Handle the error, e.g., show an error message
    //     console.error("Error:", error);
    //   });
  };




  return (
    <ModalContentWrap>
      <BodySMedium>Members</BodySMedium>
      <PhotoContainer>
        <Photos>
          {members.map((member: any, index: number) => (
            <ElWrap w={40} h={40} key={index}>
              <Photo
                photoType={PhotoType.L}
                onSelect={() => {}}
                member_idx={member.id}
                member_firstName={member.first_name}
                member_lastName={member.last_name}
                member_url={member.profile_picture}
                selected={member.selected}
              />
            </ElWrap>
          ))}
        </Photos>
      </PhotoContainer>

      <Invite />
      <div style={{ marginTop: "8px" }}>
        <TextBtnL
          label="Save"
          disable={false}
          onClick={handleNext}
          className={BackgroundColor.ACCENT_PURPLE}
        />
      </div>
    </ModalContentWrap>
  );
};

export default EditInterviewers;
