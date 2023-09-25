import styled from "styled-components";
import { BoderBox, Title } from "../StyledInterview";

export const OverviewSections = styled(BoderBox)`
  padding: 24px;
  height: 100%;
  width: 360px;

  ${Title} {
    margin-bottom: 24px;
  }

  ${(props) => props.theme.devices.lg} {
    width: 100%;
  }
`;

export const SectionLists = styled.div`
  height: 310px;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding-bottom: 16px;
  overflow: scroll;
`;

export const SectionList = styled.button`
  padding: 12px 16px;
  display: flex;
  gap: 6px;
  flex-direction: column;
  border: 0 black solid;
  background-color: ${(props) => props.theme.colors.white};

  &:hover {
    background: ${(props) => props.theme.colors.lightPurple};
    cursor: pointer;
    transition: 0.2s ease-in-out;
    transform: none;
    flex: none;
    order: 0;
    flex-grow: 0;
    border-radius: 12px;

    /* border: 1px solid ${(props) => props.theme.colors.black}; */
  }

  &.active {
    border-radius: 12px;
    background-color: ${(props) => props.theme.colors.lightPurple};
  }

  .info {
    display: flex;
    gap: 16px;

    .icon-div {
      display: flex;
      gap: 5px;
      svg {
        width: 20px;
        height: 20px;
        stroke: ${(props) => props.theme.colors.black};
      }
    }
  }
`;
