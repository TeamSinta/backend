import { ButtonShadow } from "../button/StyledBtn";
import { TextIconBtnIcon, TextIconBtnWrap } from "./StyledTextIconBtn";

interface ITextIconBtnProps {
  label?: string;
  icon: JSX.Element;
  disable: boolean;
  onClick?: () => void;
  // style?: React.CSSProperties;
}

const TextIconBtn = (props: ITextIconBtnProps): JSX.Element => {
  const { label, icon, disable, onClick } = props;

  return (
    <>
      <TextIconBtnWrap disable={disable} onClick={onClick}>
        {label}
        <TextIconBtnIcon>{icon}</TextIconBtnIcon>
        <ButtonShadow />
      </TextIconBtnWrap>
    </>
  );
};

export default TextIconBtn;
