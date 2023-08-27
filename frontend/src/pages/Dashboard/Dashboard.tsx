import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Stack, Box } from "@mui/material";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import { BackgroundColor } from "@/features/utils/utilEnum";
import { RightBracketIcon } from "@/components/common/svgIcons/Icons";
import TemplateHomeCard from "@/components/common/cards/teamplateHomeCard/TemplateHomeCard";
import {
  MainContainer,
  WelcomeHeading,
  DescriptionText,
  PendingReviewsHeading,
  Container,
  PendingReviewsBox,
  TextBox,
} from "./StyledDashboard"; // Import your styled components from the new file
import dashboardImage from "src/assets/svg/homepage.svg";
import { StyledImage } from "./StyledDashboard";

const DashBoard = () => {
  const members = [
    {
      member_idx: 1,
      member_name: "Mohamed Shegow",
      member_url:
        "https://ca.slack-edge.com/T04C82XCPRU-U04D4BRG8CQ-c4ccf8605ed3-192",
    },
    {
      member_idx: 2,
      member_name: "Suwon Baek",
      member_url:
        "https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512",
    },
    {
      member_idx: 3,
      member_name: "Mattias Welamsson",
      member_url:
        "https://ca.slack-edge.com/T04C82XCPRU-U04L1685M5J-81974d1311f3-512",
    },
    {
      member_idx: 4,
      member_name: "Sammy Kavanagh",
      member_url: "",
    },
  ];
  const interviewRounds = [
    {
      title: "FrontEnd Developer",
      location: "Toronto, Canada",
      members: members,
      disable: false,
    },
    {
      title: "Sales Development Rep",
      location: "London, England",
      members: members,
      disable: false,
    },
    {
      title: "UX Designer",
      location: "London, England",
      members: members,
      disable: false,
    },
    {
      title: "UX Designer",
      location: "London, England",
      members: members,
      disable: false,
    },
    {
      title: "UX Designer",
      location: "London, England",
      members: members,
      disable: false,
    },

    // Add more interview rounds as needed
  ];
  const handleButtonClick = () => {
    const TemplatesUrl = "/templates";
    // Define the function to be called when the button is clicked
    // You can replace '/interview-url' with the actual URL you want to route to
    window.location.href = TemplatesUrl;
  };

  const arg = {
    label: "Show All",
    icon: <RightBracketIcon />,
    className: BackgroundColor.ACCENT_PURPLE,
    onClick: handleButtonClick,
    disable: false,
  };

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const x = scrollContainerRef.current
      ? e.pageX - scrollContainerRef.current.offsetLeft
      : e.pageX; // if there's no ref, just use the pageX value as fallback
    setStartX(x);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    e.preventDefault();

    const x = scrollContainerRef.current
      ? e.pageX - scrollContainerRef.current.offsetLeft
      : e.pageX; // again, use pageX as fallback

    const scrollDistance = x - startX;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= scrollDistance;
    }

    setStartX(x);
  };

  return (
    <>
      <Stack justifyContent="space-between" alignItems="center" style={{}}>
        <Stack
          direction="column"
          justifyContent="center"
          spacing={5}
          style={{
            width: "100%",
          }}
        >
          <MainContainer>
            <Container>
              <TextBox>
                <WelcomeHeading>Welcome back, Mo 👋</WelcomeHeading>
                <DescriptionText>
                  Helping teams hire better and faster.
                </DescriptionText>
              </TextBox>
              <PendingReviewsBox>
                <PendingReviewsHeading>Pending Reviews</PendingReviewsHeading>
              </PendingReviewsBox>
            </Container>
            <StyledImage src={dashboardImage} alt="dashboard_picture" />
          </MainContainer>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              width: "100%",
            }}
          >
            <PendingReviewsHeading>Recent Templates</PendingReviewsHeading>
            <Box
              style={{
                width: "148px",
              }}
            >
              <TextIconBtnL {...arg} />
            </Box>
          </Stack>

          <Box
            style={{
              borderRadius: "28px",
              border: "1px solid #E0E0E0",
              display: "flex", // Set to flex to enable horizontal scrolling
              gap: "20px",
              alignItems: "center",
              marginTop: "22px",
              width: "100%",
              overflowX: "auto", // Enable horizontal scrolling
              flexWrap: "nowrap",
              cursor: "grab", // Set cursor style for dragging
              padding: "24px 0px 24px 24px",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            ref={scrollContainerRef}
          >
            {interviewRounds.map((interviewRound, index) => (
              <TemplateHomeCard
                key={index}
                title={interviewRound.title}
                disable={interviewRound.disable}
                questions={new Array(8)} // or you can provide actual data if available
                sections={new Array(15)} // or you can provide actual data if available
                members={interviewRound.members}
              />
            ))}
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default DashBoard;
