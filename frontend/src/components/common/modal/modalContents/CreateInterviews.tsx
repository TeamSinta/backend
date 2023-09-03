import { AppDispatch } from "@/app/store";
import Photo from "@/components/common/buttons/photo/Photo";
import Photos from "@/components/common/buttons/photo/Photos";
import { PhotoContainer } from "@/components/common/buttons/photo/StyledPhoto";
import { TextBtnL } from "@/components/common/buttons/textBtn/TextBtn";
import { InputLayout } from "@/components/common/form/input/StyledInput";
import Invite from "@/components/common/form/invite/Invite";
import TextArea from "@/components/common/form/textArea/TextArea";
import TextInput from "@/components/common/form/textInput/TextInput";
import { MODAL_TYPE } from "@/components/common/modal/GlobalModal";
import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { openModal } from "@/features/modal/modalSlice";
import { IMember } from "@/features/roles/rolesInterface";
import { selectRole, selectedMember } from "@/features/roles/rolesSlice";
import { BackgroundColor, PhotoType } from "@/features/utils/utilEnum";
import { useDispatch, useSelector } from "react-redux";
import { ModalContentWrap } from "./StyledModalContents";
import { useState } from "react";

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

const CreateInterviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { members } = useSelector(selectRole);
  const onMemberSelected = (memberIdx: number) => {
    dispatch(selectedMember({ memberIdx: memberIdx }));
  };

  const [inputValue, setInputValue] = useState<IState>({
    title: "",
    description: "",
  });

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({
      ...inputValue,
      [event.target.name]: event.target.value,
    });
  };

  const textAreaOnChange = (value: string) => {
    inputValue["description"] = value;
  };

  const onClickModalOpen = (modalType: MODAL_TYPE) => {
    dispatch(
      openModal({
        modalType: modalType,
      })
    );
  };

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
      <InputLayout>
        <BodySMedium>Members</BodySMedium>
        <PhotoContainer>
          <Photos>
            {members.map((member: IMember, index: number) => (
              <ElWrap w={40} h={40} key={index}>
                <Photo
                  photoType={PhotoType.L}
                  {...member}
                  onSelect={onMemberSelected}
                />
              </ElWrap>
            ))}
          </Photos>
        </PhotoContainer>
      </InputLayout>
      <Invite />
      <div style={{ marginTop: "8px" }}>
        <TextBtnL
          label="Next"
          disable={false}
          onClick={() => {
            onClickModalOpen(MODAL_TYPE.SELECT_VAL);
          }}
          className={BackgroundColor.ACCENT_PURPLE}
        />
      </div>
    </ModalContentWrap>
  );
};

export default CreateInterviews;
