import * as React from "react";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";
import { H1 } from "@/components/common/typeScale/StyledTypeScale";
import ConclusionInterviewCard from "@/components/common/cards/conclusionInterivewCard/ConclusionInterviewCard";
import { GridContainer } from "./StyledConclusions";
import { Link } from "react-router-dom";
import TextIconFilter from "@/components/common/filters/textIconFilter/TextIconFilter";
import { BinIcon, ResumeIcon } from "@/components/common/svgIcons/Icons";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string; // Change the type to string
  value: string; // Change the type to string
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <BodySMedium>{children}</BodySMedium>
        </Box>
      )}
    </div>
  );
}

const fakeInterviewRounds = [
  {
    name: "Alice Johnson",
    title: "Frontend Developer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
  },
  {
    name: "Bob Smith",
    title: "Backend Developer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 2 * 30, // 2 months ago
  },
  {
    name: "Charlie Williams",
    title: "UX Designer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 45, // 45 days ago
  },
  {
    name: "Daisy Brown",
    title: "Data Scientist Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 365, // 1 year ago
  },
  {
    name: "Alice Johnson",
    title: "Frontend Developer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
  },
  {
    name: "Bob Smith",
    title: "Backend Developer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 2 * 30, // 2 months ago
  },
  {
    name: "Charlie Williams",
    title: "UX Designer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 45, // 45 days ago
  },
  {
    name: "Daisy Brown",
    title: "Data Scientist Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 365, // 1 year ago
  },
  {
    name: "Alice Johnson",
    title: "Frontend Developer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
  },
  {
    name: "Bob Smith",
    title: "Backend Developer Interview",
    disable: false,
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 2 * 30, // 2 months ago
  },
];

const TABS = {
  INTERVIEWS: "interviews",
  ARCHIVED: "archived",
};

export default function BasicTabs() {
  const [activeTab, setActiveTab] = React.useState(TABS.INTERVIEWS);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Stack spacing={3}>
        <Box>
          <BodySMedium
            style={{
              color: "grey",
            }}
          >
            My Library
          </BodySMedium>
          <H1>Interviews</H1>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              marginBottom: "24px",
              gap: "12px",
            }}
          >
            <TextIconFilter
              label="Interviews"
              select={activeTab === TABS.INTERVIEWS}
              onClick={() => handleTabChange(TABS.INTERVIEWS)}
            />
            <TextIconFilter
              label="Archived"
              select={activeTab === TABS.ARCHIVED}
              onClick={() => handleTabChange(TABS.ARCHIVED)}
            />
          </Box>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              padding: "2px",
              gap: "12px",
              display: "flex",
              marginBottom: "24px",
            }}
          ></Box>
          {activeTab === TABS.INTERVIEWS && (
            <CustomTabPanel value={activeTab} index={TABS.INTERVIEWS}>
              <GridContainer>
                {fakeInterviewRounds.map((interviewRound, index) => (
                  <Link to={`/interviews/conclusion`} key={index}>
                    <ConclusionInterviewCard
                      key={index}
                      title={interviewRound.title}
                      disable={interviewRound.disable}
                      name={interviewRound.name}
                      date={interviewRound.date}
                    />
                  </Link>
                ))}
              </GridContainer>
            </CustomTabPanel>
          )}
          {activeTab === TABS.ARCHIVED && (
            <CustomTabPanel value={activeTab} index={TABS.ARCHIVED}>
              Item Two
            </CustomTabPanel>
          )}
        </Box>
      </Stack>
    </>
  );
}
