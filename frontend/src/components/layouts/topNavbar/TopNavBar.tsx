import React from "react";
import {
  TopNavBarWrapper,
  StyledTextIconBtn,
  StyledSearchInput,
  StyledDropDownWrapper,
} from "./StyledTopBarNav";
import { PlusIcon } from "components/common/svgIcons/Icons";
import { iconSW } from "components/common/svgIcons/iconType";
import { DropdownLayoutType } from "components/common/form/dropdown/StyledDropdown";

import TextIconBtn from "../../common/textIconBtn/TextIconBtn";
import SearchInput from "components/common/form/serchInput/SearchInput";
import Dropdown from "../../common/form/dropdown/Dropdown";

export const buttonData = [
  {
    id: 1,
    text: "Create",
    onClick: () => {},
    active: false,
    icon: <PlusIcon {...iconSW} />,
  },
];

export const workSpaceData = [
  { name: "Launchman", value: "Test1" },
  { name: "Wei-Wei", value: "Test2" },
  { name: "Sinta", value: "Test3" },
];

const TopNavBar = (): JSX.Element => {
  return (
    <TopNavBarWrapper>
      <StyledSearchInput>
        <SearchInput
          disable={false}
          placeholder={"Search for Role or Candidate"}
        />
      </StyledSearchInput>
      <StyledDropDownWrapper>
        <Dropdown
          label="Workspace"
          layoutType={DropdownLayoutType.FLEX}
          optionArr={workSpaceData}
          dropdownName="Sinta"
          dropdownIconVisible={true}
        />
      </StyledDropDownWrapper>
      <StyledTextIconBtn>
        {buttonData.map((button) => (
          <TextIconBtn
            key={button.id}
            icon={button.icon}
            onClick={button.onClick}
            label={button.text}
            disable={button.active}
          />
        ))}
      </StyledTextIconBtn>
    </TopNavBarWrapper>
  );
};

export default TopNavBar;
