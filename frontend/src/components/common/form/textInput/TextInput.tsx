import React from "react";
import {
  Input,
  InputError,
  InputLabel,
  InputLayout,
} from "../input/StyledInput";

export interface ITextInput {
  label: string;
  disable: boolean;
  placeholder: string;
  error: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
}

const TextInput = (props: ITextInput): JSX.Element => {
  const { disable, label, placeholder, error, onChange, name, value } = props;

  return (
    <InputLayout>
      <InputLabel>{label}</InputLabel>
      <Input
        name={name}
        disabled={disable}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      {error ? <InputError /> : <></>}
    </InputLayout>
  );
};

export default TextInput;
