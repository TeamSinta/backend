import { useEffect, useState } from "react";
import {
  TextIconFilterLayout,
  TextIconFilterIcon,
} from "./StyledTextIconFilter";

interface ITextIconFilterProps {
  label: string;
  icon: JSX.Element;
  select: boolean;
}

const TextIconFilter = (props: ITextIconFilterProps) => {
  const { select, label, icon } = props;
  const [selected, setSelected] = useState<boolean>(select);

  useEffect(() => {
    setSelected(select);
  }, [select]);

  return (
    <TextIconFilterLayout
      onClick={() => {
        setSelected(selected ? false : true);
      }}
      className={selected ? "selected" : ""}
    >
      <div>{label}</div>
      <TextIconFilterIcon>{icon}</TextIconFilterIcon>
    </TextIconFilterLayout>
  );
};

export default TextIconFilter;
