import { useState } from "react";
import { StyledTextarea } from "../input/StyledInput";

interface ITextAreaProps {
  disable: boolean;
  placeholder: string;
  error: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  value: string;
}

const TextArea = (props: ITextAreaProps): JSX.Element => {
  const { name, value, onChange, placeholder, disable, error } = props;
  const [inputValue, setInputValue] = useState<{ [key: string]: string }>({
    name: value,
  });

  return (
    <StyledTextarea
      name={name}
      onChange={onChange}
      disabled={disable}
      placeholder={placeholder}
      value={inputValue[name]}
    />
  );
};

export default TextArea;
