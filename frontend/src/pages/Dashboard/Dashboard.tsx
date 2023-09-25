import React, { useRef, useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import { TextIconBtnL } from "@/components/common/buttons/textIconBtn/TextIconBtn";
import { BackgroundColor } from "@/features/utils/utilEnum";
import {
  CalendarIcon,
  RightBracketIcon,
} from "@/components/common/svgIcons/Icons";
import TemplateHomeCard from "@/components/common/cards/teamplateHomeCard/TemplateHomeCard";
import { fetchInterviewRounds } from "@/features/dashboardDetail/dashboardAPI";
import {
  MainContainer,
  WelcomeHeading,
  DescriptionText,
  PendingReviewsHeading,
  Container,
  PendingReviewsBox,
  TextBox,
  TemplateCardsBox,
  IconStyle,
} from "./StyledDashboard";
import { BodyLMedium } from "@/components/common/typeScale/StyledTypeScale";
import dashboardImage from "src/assets/svg/homepage.svg";
import { StyledImage } from "./StyledDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { IMember } from "@/components/common/cards/teamplateHomeCard/TemplateHomeCard";

interface interviewRound {
  role_title: string;
  disable: boolean;
  interviewers?: IMember[];
}

const DashBoard = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [interviewRounds, setInterviewRounds] = useState<interviewRound[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInterviewRounds();
        setInterviewRounds(data);
      } catch (error) {}
    };
    fetchData();
  }, []);

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
                <WelcomeHeading>
                  Welcome back, {user.first_name} 👋
                </WelcomeHeading>
                <DescriptionText>
                  Helping teams hire better and faster.
                </DescriptionText>
              </TextBox>
              <PendingReviewsBox>
                <IconStyle>
                  <CalendarIcon />
                </IconStyle>

                <BodyLMedium>Pending Reviews</BodyLMedium>
              </PendingReviewsBox>
            </Container>
            <StyledImage src={dashboardImage} alt="dashboard_picture" />
          </MainContainer>
          <Stack direction="column" spacing={1.5}>
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

            <TemplateCardsBox
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              ref={scrollContainerRef}
            >
              {interviewRounds.map((interviewRound, index) => (
                <TemplateHomeCard
                  key={index}
                  title={interviewRound.role_title}
                  // Determine the disable state based on a condition, e.g., if interviewRound.disable exists and is true
                  disable={interviewRound.disable || false}
                  questions={new Array(8)} // or you can provide actual data if available
                  sections={new Array(15)} // or you can provide actual data if available
                  members={interviewRound.interviewers || []}
                />
              ))}
            </TemplateCardsBox>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default DashBoard;
