import {
  H2Bold,
  BodyLMedium,
  BodyLSemiBold,
  BodyMSemiBold,
} from "@/components/common/typeScale/StyledTypeScale";
import GoogleLoginButton from "@/components/pages/login/googleLoginBtn/GoogleLoginButton";
import {
  Container,
  GrayBodyLMedium,
  GrayBodyMMedium,
  MainContainer,
  StyledImage,
  StyledLogo,
  TextBox,
  TextRow,
} from "../Login/StyledLogin";
import { Stack } from "@mui/material";
import LoginPageImage from "src/assets/svg/LogInPageIllustration.svg";
import LogoImage from "src/assets/images/SintaLogo.png";

const LoginScreen = () => {
  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        style={{ height: "100vh" }}
      >
        <StyledLogo src={LogoImage} alt="sinta_logo" />
        <MainContainer>
          <Container>
            <StyledImage src={LoginPageImage} alt="loginpage_picture" />
            <Stack gap="8px">
              <H2Bold>Sign In to Sinta</H2Bold>
              <BodyLMedium>
                Continue with the Google account or email address you use to
                sign in.
              </BodyLMedium>
              <GoogleLoginButton />
            </Stack>
            <TextRow>
              <GrayBodyLMedium>New to Sinta?</GrayBodyLMedium>
              <BodyLSemiBold> Join.</BodyLSemiBold>
            </TextRow>
          </Container>
          <TextBox>
            <GrayBodyMMedium>By signing in you agree to our</GrayBodyMMedium>
            <BodyMSemiBold>Terms of Use</BodyMSemiBold>
            <GrayBodyMMedium>and </GrayBodyMMedium>
            <BodyMSemiBold>Privacy Policy.</BodyMSemiBold>
          </TextBox>
        </MainContainer>
      </Stack>
    </>
  );
};

export default LoginScreen;
