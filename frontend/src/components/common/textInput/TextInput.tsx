import { ReactElement } from "react";
import {
  Input,
  InputError,
  InputLabel,
  InputLayout,
} from "../input/StyledInput";

interface ITextInput {
  label: string;
  disable: boolean;
  placeholder: string;
  error: boolean;
}

const TextInput = (props: ITextInput): ReactElement => {
  const { disable, label, placeholder, error } = props;

  return (
    <InputLayout>
      <InputLabel>{label}</InputLabel>
      <Input disabled={disable} placeholder={placeholder} />
      {error ? <InputError /> : <></>}
    </InputLayout>
  );
};

export default TextInput;
