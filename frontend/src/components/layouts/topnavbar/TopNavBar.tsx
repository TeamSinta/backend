import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import React from "react";
import { LogoImage } from "./StyledTopBarNav";
import image from "@/assets/images/Homie.png";
import SearchInput from "@/components/common/form/serchInput/SearchInput";
import {
  CalendarIcon,
  PlusIcon,
  RightBracketIcon,
} from "@/components/common/svgIcons/Icons";
import { BackgroundColor } from "@/features/utils/utilEnum";
import ElWrap from "../elWrap/ElWrap";
import { DropDownButton } from "@/components/common/buttons/dropDownBtn/DropDownBtn";
import { StyledTopNavBar } from "./StyledTopBarNav";

export interface IButton {
  to: string;
  icon: JSX.Element;
  text: string;
}

const TopNavBar = (): JSX.Element => {
  return (
    <StyledTopNavBar sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2}>
        <Box sx={{ width: "100%" }}>
          <SearchInput disable={false} placeholder={"Search"} error={false} />
        </Box>

        <ElWrap w={280}>
          <DropDownButton
            label="Create a Meeting"
            onClick={() => {}}
            icon={<RightBracketIcon />}
            disable={false}
            className={BackgroundColor.ACCENT_PURPLE}
            buttons={[
              {
                label: "Start a Meeting",
                icon: <PlusIcon />,
                onClick: () => {
                  /* Your onClick logic here */
                },
              },
              {
                label: "Plan a Meeting",
                icon: <CalendarIcon />,
                onClick: () => {
                  /* Your onClick logic here */
                },
              },
              // You can add more buttons dynamically by adding more objects to this array
            ]}
          />
        </ElWrap>
        <LogoImage src={image} alt="Homie Logo" />
      </Stack>
    </StyledTopNavBar>
  );
};

export default TopNavBar;
