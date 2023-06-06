import React from "react";

import { InputIcon, SerchInputEl, SerchInputLayout } from "./StyledSerchInput";
import { SearchIcon } from "@/components/common/svgIcons/Icons";
import { iconMB } from "@/components/common/svgIcons/iconType";

interface ISearchInput {
  disable: boolean;
  placeholder: string;
  style?: React.CSSProperties;
}

const SearchInput = (props: ISearchInput): JSX.Element => {
  const { disable, placeholder } = props;
  return (
    <SerchInputLayout>
      <InputIcon>
        <SearchIcon {...iconMB} />
      </InputIcon>
      <SerchInputEl disabled={disable} placeholder={placeholder} />
    </SerchInputLayout>
  );
};

export default SearchInput;
