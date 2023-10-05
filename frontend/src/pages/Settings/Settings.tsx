import { useState } from "react";
import { Box } from "@mui/material";
import { H1 } from "@/components/common/typeScale/StyledTypeScale";
import TextIconFilter from "@/components/common/filters/textIconFilter/TextIconFilter";
import { CandidateIcon, PencilIcon } from "@/components/common/svgIcons/Icons";
import { SettingsContainer, PageContainer } from "./StyledSettings";
import { UserTab } from "@/components/pages/settings/profileTab/UserTab";
import MemberTab from "@/components/pages/settings/memberTab/MemberTab";
import { TABS } from "@/features/utils/utilEnum";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.PROFILE);

  const handleTabChange = (tab: TABS) => {
    setActiveTab(tab);
  };

  return (
    <SettingsContainer>
      <H1>Settings</H1>
      <Box
        sx={{
          paddingTop: "20px",
          paddingBottom: "28px",
          display: "flex",
          gap: "4px",
        }}
      >
        <TextIconFilter
          label="Profile"
          icon={<PencilIcon />}
          select={activeTab === "profile"}
          onClick={() => handleTabChange(TABS.PROFILE)}
        />

        <TextIconFilter
          label="Members"
          icon={<CandidateIcon />}
          select={activeTab === "members"}
          onClick={() => handleTabChange(TABS.MEMBERS)}
        />
      </Box>
      <PageContainer>
        {activeTab === TABS.PROFILE && <UserTab />}
        {activeTab === TABS.MEMBERS && <MemberTab />}
      </PageContainer>
    </SettingsContainer>
  );
};

export default SettingsPage;
