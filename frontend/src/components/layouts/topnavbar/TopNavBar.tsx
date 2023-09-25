import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import React from "react";
import { LogoImage } from "./StyledTopBarNav";
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
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export interface IButton {
  to: string;
  icon: JSX.Element;
  text: string;
}

interface TopNavBarProps {
  createCall: () => Promise<string>;
  startHairCheck: (url: string) => void;
}

const TopNavBar = ({
  createCall,
  startHairCheck,
}: TopNavBarProps): JSX.Element => {
  const startDemo = () => {
    createCall().then((url: string) => {
      startHairCheck(url);
    });
  };
  const { user } = useSelector((state: RootState) => state.user);

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
                onClick: startDemo, // Use the function reference here
              },
              {
                label: "Plan a Meeting",
                icon: <CalendarIcon />,
                onClick: () => {},
              },
              // You can add more buttons dynamically by adding more objects to this array
            ]}
          />
        </ElWrap>
        <LogoImage src={user.profile_picture as string} alt="user photo" />
      </Stack>
    </StyledTopNavBar>
  );
};

export default TopNavBar;
