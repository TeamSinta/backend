import { styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const StyledCard = styled(Card)`
  display: flex;
  width: 286px;
  height: 134px;
  position: relative;
  background: #f6f6fb;
  border-radius: 12px;
  &:hover {
    background: #eaeaf4;
    transition: background-color 0.3s ease-in-out;
  }
`;

export const StyledCardContent = styled(CardContent)`
  top: 6px;
  left: 2px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const StyledCardMedia = styled(CardMedia)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82px;
  height: 94px;
  background-image: url("https://i.postimg.cc/qR0phQNJ/ed446e8d10de855690a5e6c000177fe2.png"),
    linear-gradient(0deg, black 0%, white 100%);
  border-radius: 8px;
  margin-top: 18px;
  margin-left: 14px;
`;

export const StyledBox = styled(Box)`
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TeammateImage = styled("img")`
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

export const CenteredTypography = styled(Typography)`
  text-align: center;
  color: #121212;
  font-size: 20px;
  font-family: Chillax;
  font-weight: 600;
  line-height: 25px;
  word-wrap: break-word;
`;
