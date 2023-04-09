import { JsxElement } from "typescript";
import { ButtonShadow } from "../button/StyledBtn";
import { PlusIcon } from "../svgIcons/Icons";
import { iconSW } from "../svgIcons/iconType";
import { TextIconBtnIcon, TextIconBtnWrap } from "./StyledTextIconBtn";

interface ITextIconBtnProps {
  label?: string;
  icon: JSX.Element;
}

const TextIconBtn = (props: ITextIconBtnProps) => {
  const { label, icon } = props;

  return (
    <>
      <TextIconBtnWrap>
        {label}
        <TextIconBtnIcon>{icon}</TextIconBtnIcon>
        <ButtonShadow />
      </TextIconBtnWrap>
    </>
  );
};

export default TextIconBtn;
