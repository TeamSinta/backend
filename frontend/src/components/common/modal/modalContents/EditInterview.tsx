import { AppDispatch } from "@/app/store";
import { TextBtnL } from "@/components/common/buttons/textBtn/TextBtn";
import { InputLayout } from "@/components/common/form/input/StyledInput";
import TextArea from "@/components/common/form/textArea/TextArea";
import TextInput from "@/components/common/form/textInput/TextInput";
// import { MODAL_TYPE } from "@/components/common/modal/GlobalModal";
import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";
import { closeModal } from "@/features/modal/modalSlice";
// import { selectRole, selectedMember } from "@/features/roles/rolesSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useDispatch } from "react-redux";
import { ModalContentWrap } from "./StyledModalContents";
import { useState } from "react";

// import { RootState } from "@/app/store";
// import { CompanyID } from "@/features/settingsDetail/userSettingTypes";
import { CoverPictureContainer } from "@/pages/Interview/StyledInterview";
import { Box } from "@mui/material";

const titleInputArg = {
  error: false,
  disable: false,
  placeholder: "Title",
  name: "title",
};

const descriptionInputArg = {
  error: false,
  disable: false,
  placeholder: "Description",
  name: "description",
};

interface IState {
  [key: string]: any;
  title: string;
  description: string;
}

const EditInterviews = () => {
  // const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  // const { members } = useSelector(selectRole);
  // const onMemberSelected = (memberIdx: number) => {
  //   dispatch(selectedMember({ memberIdx: memberIdx }));
  // };

  const [inputValue, setInputValue] = useState<IState>({
    title: "",
    description: "",
  });
  // const companyId = user.company as CompanyID;

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

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [event.target.name]: event.target.value,
    });
  };

  const textAreaOnChange = (value: string) => {
    inputValue["description"] = value;
  };

  // const onClickModalOpen = (modalType: MODAL_TYPE, templateID: any) => {
  //   dispatch(
  //     openModal({
  //       modalType: modalType,
  //       templateID: templateID,
  //     })
  //   );
  // };

  return (
    <ModalContentWrap>
      <InputLayout>
        <BodySMedium>Title</BodySMedium>
        <TextInput
          {...titleInputArg}
          onChange={inputOnChange}
          value={inputValue["title"]}
        />
      </InputLayout>
      <InputLayout>
        <BodySMedium>Description</BodySMedium>
        <TextArea
          {...descriptionInputArg}
          onChange={textAreaOnChange}
          value={inputValue["description"]}
        />
      </InputLayout>
      <BodySMedium>Template Cover Photo</BodySMedium>
      <CoverPictureContainer>
        <Box>Click Here</Box>
      </CoverPictureContainer>
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

export default EditInterviews;
