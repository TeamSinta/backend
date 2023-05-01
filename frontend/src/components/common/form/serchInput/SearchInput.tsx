import React from "react";
import { SearchIcon } from "components/common/svgIcons/Icons";
import { iconMB } from "components/common/svgIcons/iconType";
import { InputIcon, SerchInputEl, SerchInputLayout } from "./StyledSerchInput";

interface ISearchInput {
  disable: boolean;
  placeholder: string;
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
