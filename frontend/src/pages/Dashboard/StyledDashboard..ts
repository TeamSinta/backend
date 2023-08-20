import styled from "styled-components";
import {
  H1,
  H2Bold,
  BodySMedium,
} from "@/components/common/typeScale/StyledTypeScale";
import { Box } from "@mui/material";

export const WelcomeHeading = styled(H1)`
  font-size: 48px;

  @media (max-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */

    font-size: 35px;
  }
`;

export const DescriptionText = styled(BodySMedium)`
  /* Your styling for description text here */
  font-size: 16px;
  padding-left: 4px;
`;

export const PendingReviewsHeading = styled(H2Bold)`
  font-size: 18px;
`;

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 38px;
`;

export const PendingReviewsBox = styled(Box)`
  border-radius: 18px;
  border: 1px solid #e0e0e0;
  display: inline-flex;
  padding: 24px 0px 24px 24px;
  gap: 20px;
  align-items: flex-start;
  height: 100%;
  width: -webkit-fill-available;
`;

export const TextBox = styled(Box)`
  display: flex;
  gap: 2px;
  flex-direction: column;
`;

export const MainContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 18px;

  @media (min-width: 1900px) {
    /* Adjust styles for screens with a max width of 768px */
    justify-content: space-between;
  }

  @media (max-width: 1000px) {
    /* Adjust styles for screens with a max width of 768px */
    justify-content: center;
    align-items: center;
    gap: 28px;
    flex-direction: column;
  }
`;

export const StyledImage = styled.img`
  margin-top: -20px;
  width: 670px;
  min-width: 100px;

  @media (max-width: 1000px) {
    /* Adjust styles for screens with a max width of 768px */

    width: 90%;
  }

  @media (min-width: 1575px) {
    /* Adjust styles for screens with a max width of 768px */
    width: 820px;
  }
  @media (min-width: 1600px) {
    /* Adjust styles for screens with a max width of 768px */
    width: 820px;
  }
`;
