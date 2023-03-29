import styled from "styled-components";

export const H1 = styled.h1`
  font-family: "ChillaxSemi";
  font-size: 32px;
`;

export const H2Bold = styled.h2`
  font-family: "ChillaxSemi";
  font-size: 24px;
`;

export const H2Medium = styled(H2Bold)`
  font-family: "Chillax";
`;

export const H3Bold = styled.h3`
  font-family: "ChillaxSemi";
  font-size: 20px;
`;

export const H3Medium = styled(H3Bold)`
  font-family: "Chillax";
`;

export const BodyLBold = styled.div`
  font-family: "ChillaxSemi";
  font-size: 16px;
`;

export const BodyLMedium = styled(BodyLBold)`
  font-family: "Chillax";
`;

export const BodyMBold = styled(BodyLBold)`
  font-size: 14px;
`;

export const BodyMMedium = styled(BodyLMedium)`
  font-size: 14px;
`;

export const BodySBold = styled(BodyLBold)`
  font-size: 12px;
`;

export const BodySMedium = styled(BodyLMedium)`
  font-size: 12px;
`;

export const TypeScleDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 400px;
`;
