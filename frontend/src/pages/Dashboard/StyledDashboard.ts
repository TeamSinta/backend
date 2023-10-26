import styled from "styled-components";
import {
  H1,
  H2Bold,
  BodySMedium,
} from "@/components/common/typeScale/StyledTypeScale";
import { Box } from "@mui/material";

export const YourNewContainer = styled.div`
  display: flex;
  height: 100vh;
  gap: 32px;
  flex-direction: column;
`;

export const YourMainContentContainer = styled.div`
  flex: 0.8; // Makes it grow to take all available space, pushing TemplateCardsBox to the bottom.
  display: flex;
`;
export const WelcomeHeading = styled(H1)`
  font-size: 44px;

  @media (max-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */
    text-align: center;
    font-size: 38px;
    padding-bottom: 8px;
  }
`;

export const DescriptionText = styled(BodySMedium)`
  /* Your styling for description text here */
  font-size: 16px;
  padding-left: 4px;

  @media (max-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */
    text-align: center;
  }
`;

export const PendingReviewsHeading = styled(H2Bold)`
  font-size: 22px;
`;

export const Container = styled(Box)`
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
  @media (max-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */
    gap: 18px;
    align-items: center;
    text-align: center;
  }
`;

export const PendingReviewsBox = styled(Box)`
  border-radius: 18px;
  border: 1px solid #e0e0e0;
  display: inline-flex;
  padding: 24px 0px 24px 24px;
  gap: 8px;
  align-items: flex-start;
  height: 50%;
  width: -webkit-fill-available;

  @media (max-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */
    justify-content: center;

    width: 90%;
    border: 1px solid #e0e0e0;
  }
`;

export const TemplateCardsBox = styled(Box)`
  border-radius: 28px;
  border: 1px solid #e0e0e0;
  display: flex; // Set to flex to enable horizontal scrolling
  gap: 20px;
  align-items: center;
  margin-top: 22px;
  width: 100%;
  overflow-x: auto; // Enable horizontal scrolling
  cursor: grab; // Set cursor style for dragging
  padding: 24px 0px 24px 24px;
`;

export const TextBox = styled(Box)`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const IconStyle = styled.div`
  svg {
    width: 20px;
    height: 22px;
    stroke: ${(props) => props.theme.colors.black};
  }
`;

export const MainContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 1px;

  @media (min-width: 1900px) {
    /* Adjust styles for screens with a max width of 768px */
    justify-content: space-around;
  }

  @media (max-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */
    justify-content: center;
    align-items: center;
    gap: 28px;
    flex-direction: column;
  }
`;

export const StyledImage = styled.img`
  min-width: 100px;
  min-height: 440px;
  flex: 1;

  @media (max-width: 1000px) {
    /* Adjust styles for screens with a max width of 768px */
    width: 90%;
    flex: 1;
  }

  @media (min-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */
    flex: 1;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;

  @media (max-width: 1000px) {
    /* Adjust styles for screens with a max width of 768px */
    flex-direction: column;
    gap: 8px;
  }
`;
