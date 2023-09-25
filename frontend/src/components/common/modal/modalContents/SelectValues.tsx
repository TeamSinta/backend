import { AppDispatch } from "@/app/store";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { openModal } from "@/features/modal/modalSlice";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { useState } from "react";
import { useDispatch } from "react-redux";
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
  const [selectedComp, setSelectedComp] = useState<Array<string>>([]);
  const [newComp, setNewComp] = useState<string>("");
  const [showNewCompInput, setShowNewCompInput] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const onClickModalOpen = (modalType: MODAL_TYPE) => {
    // navigate("/interviews/template");
    dispatch(
      openModal({
        modalType: modalType,
      })
    );
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
      onSelectComp(`test_` + newComp);
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
              <BodySMedium>Selected Values:</BodySMedium>
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
                placeholder={"New Competence"}
                error={false}
                onChange={(e) => {
                  setNewComp(e.target.value);
                }}
                name={"competence"}
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
              <BodySMedium>Interests Library:</BodySMedium>
              <CompetencesWrap>
                {competencies.map((index: number) => (
                  <Competencies
                    label={`test_` + index}
                    key={index}
                    selected={checkActive(`test_` + index)}
                    onClick={() => {
                      onSelectComp(`test_` + index);
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
            onClick={() => {
              onClickModalOpen(MODAL_TYPE.SELECT_TEM);
            }}
            className={BackgroundColor.ACCENT_PURPLE}
          />
        </SelectedButtonWrap>
      </ModalContentWrap>
    </>
  );
};

export default SelectValue;
