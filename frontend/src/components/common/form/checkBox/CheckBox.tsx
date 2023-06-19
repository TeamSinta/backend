import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";
import { CheckBoxWrap, CheckInput } from "./StyledCheckBox";

export interface ICheckBoxProps {
  label: String;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputName: string | undefined;
  checked: boolean;
  disabled: boolean;
}

const CheckBox = ({
  label,
  onChange,
  inputName,
  checked,
  disabled,
}: ICheckBoxProps) => {
  return (
    <CheckBoxWrap>
      <CheckInput
        name={inputName}
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      ></CheckInput>
      <BodySMedium>{label}</BodySMedium>
    </CheckBoxWrap>
  );
};

export default CheckBox;
