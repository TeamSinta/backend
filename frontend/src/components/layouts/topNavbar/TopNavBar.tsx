import React from "react";
import {
  TopNavBarWrapper,
  StyledTextIconBtn,
  StyledSearchInput,
} from "./StyledTopBarNav";
import { PlusIcon } from "components/common/svgIcons/Icons";
import { iconSW } from "components/common/svgIcons/iconType";

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
  // const handleOnClick = () => {
  //   return console.log("test")
  // }

  return (
    <TopNavBarWrapper>
      <StyledSearchInput
        disable={false}
        placeholder={"Search for Role or Candidate"}
      />
      {buttonData.map((button) => (
        <StyledTextIconBtn
          key={button.id}
          icon={button.icon}
          onClick={button.onClick}
          label={button.text}
          disable={button.active}
        />
      ))}
    </TopNavBarWrapper>
  );
};

export default TopNavBar;
