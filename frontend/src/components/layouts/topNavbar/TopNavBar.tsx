import React from "react";
import {
  TopNavBarWrapper,
  StyledTextIconBtn,
  StyledSearchInput,
} from "./StyledTopBarNav";
import { PlusIcon } from "components/common/svgIcons/Icons";
import { iconSW } from "components/common/svgIcons/iconType";

import TextIconBtn from "../../common/textIconBtn/TextIconBtn";
import SearchInput from "components/common/form/serchInput/SearchInput";

// interface TopNavBarProps{

//   disable?: boolean;
//   label?: string;
//   icon: JSX.Element;

// }

export const buttonData = [
  {
    id: 1,
    text: "Create",
    onClick: () => {},
    active: false,
    icon: <PlusIcon {...iconSW} />,
  },
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
