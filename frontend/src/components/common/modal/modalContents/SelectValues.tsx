import { AppDispatch, RootState } from "@/app/store";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { openModal } from "@/features/modal/modalSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconBtnM } from "../../buttons/iconBtn/IconBtn";
import { TextBtnL } from "../../buttons/textBtn/TextBtn";
import Competencies from "../../elements/competencies/Competencies";
import { InputLayout } from "../../form/input/StyledInput";
import TextInput from "../../form/textInput/TextInput";
import { PlusIcon } from "../../svgIcons/Icons";
import { BodySMedium } from "../../typeScale/StyledTypeScale";
import { MODAL_TYPE } from "../GlobalModal";
import {
  CompetencesWrap,
  ModalContentWrap,
  NewComInputWrap,
  SelectContent,
  SelectContentWrap,
  SelectedButtonWrap,
  SelectedValueWrap,
} from "./StyledModalContents";
import axios from "axios";
import { CompanyID } from "@/features/settingsDetail/userSettingTypes";

const iconBtnMProps = {
  icon: <PlusIcon />,
  className: BackgroundColor.ACCENT_PURPLE,
  disable: false,
};
let competencies: any[] = [];

for (var i = 1; i <= 30; i++) {
  competencies.push(i);
}

const SelectValue = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const workspace = useSelector((state: RootState) => state.workspace);
  const [selectedComp, setSelectedComp] = useState<Array<string>>([]);
  const [newComp, setNewComp] = useState<string>("");
  const [showNewCompInput, setShowNewCompInput] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const templateID = useSelector((state: RootState) => state.modal.templateID);

  const companyId: CompanyID = (!workspace.id
    ? user.companies[0].id
    : workspace.id)! as unknown as CompanyID;
  const onClickModalOpen = (modalType: MODAL_TYPE, templateID: any) => {
    dispatch(
      openModal({
        modalType: modalType,
        templateID: templateID,
      })
    );
  };

  const handleNext = () => {
    // Define the data to send to the server
    selectedComp.forEach((value, index) => {
      const requestData = {
        topics_text: value,
        company_id: companyId,
      };

      axios
        .post(
          `http://localhost:8000/api/templates/${templateID.templateID}/topics/add/`,
          requestData
        )
        .then((response) => {
          // Handle success, e.g., show a success message or navigate to the next step
          if (index === selectedComp.length - 1) {
            const templateID = response.data.template_id;
            onClickModalOpen(MODAL_TYPE.SELECT_TEM, { templateID }); // Pass the template ID as a parameter
          }
        })
        .catch((error) => {
          // Handle the error, e.g., show an error message
          console.error("Error:", error);
        });
    });
  };

  const onSelectComp = (value: string) => {
    const temp = [...selectedComp, value];
    setSelectedComp(temp);
  };

  const checkActive = (value: string) => {
    const exit = selectedComp.find((comp) => value === comp);
    if (exit) {
      return true;
    } else {
      return false;
    }
  };

  const onCancel = (value: string) => {
    const temp = selectedComp.filter((comp) => comp !== value);
    setSelectedComp(temp);
  };

  const onClickNewComp = () => {
    const exit = selectedComp.find((comp) => newComp === comp);
    if (!exit) {
      competencies.push(newComp);
      onSelectComp(newComp);
    }
    setNewComp("");
  };

  return (
    <>
      <ModalContentWrap>
        <SelectContentWrap>
          <SelectContent>
            <BodySMedium>
              Add in your different sections for this interview, i.e. Your
              values, purpose, or topic for that given section.
            </BodySMedium>
          </SelectContent>
          <ModalContentWrap>
            <InputLayout>
              <BodySMedium>Selected Sections:</BodySMedium>
              <SelectedValueWrap>
                {/* <Competencies label="test" selected={true} /> */}
                {selectedComp.map((value: string, index: number) => (
                  <Competencies
                    label={value}
                    key={index}
                    selected={false}
                    onClick={() => {
                      onCancel(value);
                    }}
                  ></Competencies>
                ))}
                <ElWrap w={32}>
                  <IconBtnM
                    {...iconBtnMProps}
                    onClick={() => {
                      setShowNewCompInput(showNewCompInput ? false : true);
                    }}
                  />
                </ElWrap>
              </SelectedValueWrap>
            </InputLayout>
            <NewComInputWrap className={showNewCompInput ? "show" : ""}>
              <TextInput
                disable={false}
                placeholder={"New Section"}
                error={false}
                onChange={(e) => {
                  setNewComp(e.target.value);
                }}
                name={"Section"}
                value={newComp}
              />
              <ElWrap w={119} h={40}>
                <TextBtnL
                  disable={false}
                  onClick={onClickNewComp}
                  className={BackgroundColor.WHITE}
                  label="Create"
                />
              </ElWrap>
            </NewComInputWrap>
            <InputLayout>
              <BodySMedium>Topics:</BodySMedium>
              <CompetencesWrap>
                {competencies.map((index: number) => (
                  <Competencies
                    label={index}
                    key={index}
                    selected={checkActive(index)}
                    onClick={() => {
                      onSelectComp(index);
                    }}
                  ></Competencies>
                ))}
              </CompetencesWrap>
            </InputLayout>
          </ModalContentWrap>
        </SelectContentWrap>
        <SelectedButtonWrap>
          <TextBtnL
            label="Skip"
            disable={false}
            onClick={() => {}}
            className={BackgroundColor.WHITE}
          />
          <TextBtnL
            label="Next"
            disable={false}
            onClick={handleNext}
            className={BackgroundColor.ACCENT_PURPLE}
          />
        </SelectedButtonWrap>
      </ModalContentWrap>
    </>
  );
};

export default SelectValue;
