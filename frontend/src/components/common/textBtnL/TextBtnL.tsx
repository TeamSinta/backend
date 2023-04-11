import { TextBtnLWrap } from "./StyledTextBtnL";
import { ButtonShadow } from "../button/StyledBtn";

interface TextBtnWrapProps {
  disable: boolean;
  label?: string;
}

const TextBtnL = (props: TextBtnWrapProps) => {
  const { disable, label } = props;

  return (

    // added in this as a comment in case you want to see how the button will look on a smaller div
    // <div style={{ width: "40px" }}>
    <>
      <TextBtnLWrap disable={disable}>
        {label}
        <ButtonShadow />
      </TextBtnLWrap>
    </>
    // </div>
  );
};

export default TextBtnL;
