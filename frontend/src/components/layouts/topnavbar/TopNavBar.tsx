import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";

import { LogoImage } from "./StyledTopBarNav";
import image from "@/assets/images/Homie.png";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import SearchInput from "@/components/common/form/serchInput/SearchInput";
import { PlusIcon } from "@/components/common/svgIcons/Icons";
import styled from "styled-components";
import { BackgroundColor } from "@/features/utils/utilEnum";
import ElWrap from "../elWrap/ElWrap";

const StyledTobNavBar = styled(Box)`
  grid-area: header;
  padding: 30px 30px 24px 30px;
`;

const TopNavBar = (): JSX.Element => {
  return (
    <StyledTobNavBar sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: "100%" }}>
          <SearchInput
            disable={false}
            placeholder={"Search for Role or Candidate"}
            error={false}
          />
        </Box>

        <ElWrap w={218}>
          <TextIconBtnL
            label="Create"
            onClick={() => {}}
            icon={<PlusIcon />}
            disable={false}
            className={BackgroundColor.ACCENT_PURPLE}
          ></TextIconBtnL>
        </ElWrap>
        <LogoImage src={image} alt="Homie Logo" />
      </Stack>
    </StyledTobNavBar>
  );
};

export default TopNavBar;
