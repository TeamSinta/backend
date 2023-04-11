import { TextBtnLWrap } from "./StyledTextBtnL";
import { ButtonShadow } from "../button/StyledBtn";

interface TextBtnWrapProps {
  disable: boolean;
  label?: string;
}

const TextBtnL = (props: TextBtnWrapProps) => {
  const { disable, label } = props;

  return (
    <>
      <TextBtnLWrap disable={disable}>
        {label}
        <ButtonShadow />
      </TextBtnLWrap>
    </>
  );
};

export default TextBtnL;
