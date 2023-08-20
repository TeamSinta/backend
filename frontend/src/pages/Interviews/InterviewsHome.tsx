import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { BodySMedium } from "@/components/common/typeScale/StyledTypeScale";
import { H1 } from "@/components/common/typeScale/StyledTypeScale";
import ConclusionInterviewCard from "@/components/common/cards/conclusionInterivewCard/ConclusionInterviewCard";
import { GridContainer } from "./StyledConclusions";
import { Link } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
        <Box sx={{ p: 3 }}>
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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Stack spacing={4}>
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
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{ padding: "0" }}
            >
              <Tab
                label="Interviews"
                sx={{ textDecorationColor: "red", borderColor: "divider" }}
              />
              <Tab label="Archived" />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
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
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
        </Box>
      </Stack>
    </>
  );
}
