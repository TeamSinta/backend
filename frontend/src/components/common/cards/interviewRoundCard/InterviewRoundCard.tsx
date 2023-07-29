import React, { useEffect, useState } from "react";
import { BodySMedium, BodyMBold } from "../../typeScale/StyledTypeScale";
import users from "./users.json";
import { Stack, Box } from "@mui/material";

import {
  StyledBox,
  StyledCard,
  StyledCardContent,
  StyledCardMedia,
  TeammateImage,
  CenteredTypography,
} from "./StyledInterviewRoundCard";

export interface InterviewRoundCardProps {
  image?: string;
  title?: string;
  numberOfQuestions?: string;
  roundId: string;
  selected?: boolean;
  onClick?: () => void;
}

export interface IMember {
  name: string;
  photoUrl: string;
}

const InterviewRoundCard: React.FC<InterviewRoundCardProps> = ({
  image = "https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512",
  title = "Coding Round",
  numberOfQuestions = "26 questions",
  roundId,
  selected: propSelected = false,
  onClick,
}) => {
  const [teammates, setTeammates] = useState<IMember[]>([]);
  const [selected, setSelected] = useState(propSelected);

  useEffect(() => {
    setTeammates(users.slice(0, 4));
  }, []);

  const renderTeammates = () =>
    teammates.map((teammate, index) => (
      <TeammateImage key={index} src={teammate.photoUrl} alt={teammate.name} />
    ));

  const handleClick = () => {
    setSelected(!selected);
    if (onClick) onClick();
  };

  return (
    <StyledCard
      sx={{ boxShadow: 0 }}
      onClick={handleClick}
      style={{
        background: selected ? "#CECDEE" : "",
        border: selected ? "1px #121212 solid" : "",
      }}
    >
      <StyledCardContent>
        <Stack spacing={3.5}>
          <Stack spacing={0}>
            <BodySMedium style={{ opacity: "0.5" }}>
              {numberOfQuestions}
            </BodySMedium>
            <BodyMBold>{title}</BodyMBold>
          </Stack>
        </Stack>
        <Box sx={{ display: "flex", gap: "4px", mt: 2.5 }}>
          {renderTeammates()}
        </Box>
      </StyledCardContent>
      <StyledCardMedia>
        <StyledBox>
          <CenteredTypography>1</CenteredTypography>
        </StyledBox>
      </StyledCardMedia>
    </StyledCard>
  );
};

export default InterviewRoundCard;
