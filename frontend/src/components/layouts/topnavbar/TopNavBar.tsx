import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";

import { LogoImage } from "./StyledTopBarNav";
import image from "@/assets/images/Homie.png";
import TextIconBtn from "@/components/common/buttons/textIconBtn/TextIconBtn";
import SearchInput from "@/components/common/form/serchInput/SearchInput";
import { PlusIcon } from "@/components/common/svgIcons/Icons";
import { iconSW } from "@/components/common/svgIcons/iconType";
import styled from "styled-components";

const StyledTobNavBar = styled(Box)`
  grid-area: header;
`;

const TopNavBar = (): JSX.Element => {
  return (
    <StyledTobNavBar sx={{ width: "100%" }} className="p-all-8">
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: "100%" }}>
          <SearchInput
            disable={false}
            placeholder={"Search for Role or Candidate"}
          />
        </Box>

        <Box sx={{ width: "218px" }}>
          <TextIconBtn
            label="Create"
            onClick={() => {}}
            icon={<PlusIcon {...iconSW} />}
            disable={false}
          ></TextIconBtn>
        </Box>
        <LogoImage src={image} alt="Homie Logo" />
      </Stack>
    </StyledTobNavBar>
  );
};

export default TopNavBar;
