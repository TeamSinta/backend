import {
  BodySBold,
  BodySMedium,
} from "@/components/common/typeScale/StyledTypeScale";
import styled, { css } from "styled-components";

export enum DropdownLayoutType {
  FLEX = "FLEX",
  BLOCK = "BLOCK",
}

export interface IDropdownLayout {
  layoutType: DropdownLayoutType;
}

interface IDropdownOpen {
  open: boolean;
}

export const SelectedItemDiv = styled.div`
  display: flex;
  gap: 8px;
`;

export const SelectedItemIcon = styled(BodySBold)`
  background: ${(props) => props.theme.colors.pastelPurple};
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  border-radius: 8px;
`;

export const DropdownArrowIconDiv = styled.div<IDropdownOpen>`
  position: absolute;
  right: 16px;
  transform: translateY(50%);
  bottom: 50%;

  ${(props) =>
    props.open
      ? css`
          svg {
            transform: rotate(-180deg);
            transition: all 0.2s linear;
          }
        `
      : css`
          svg {
            transform: rotate(0deg);
            transition: all 0.2s linear;
          }
        `}
`;

export const DropdownLayout = styled.div<IDropdownLayout>`
  display: flex;
  flex-direction: ${(props) =>
    props.layoutType === DropdownLayoutType.FLEX ? "row" : "column"};
  /* gap: 8px; */
  position: relative;
`;

export const DropdownWrap = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownLabel = styled(BodySMedium)`
  display: flex;
  align-items: center;
`;

export const DropdownEl = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.whisperGrey};
  border-radius: 12px;
  padding: 8px 16px;
  height: 40px;
  border: 0;
  outline: none;
  font-size: 12px;

  div {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.palePurple};
    transition: 0.2s ease-in-out;
  }
`;

export const OptionLi = styled.li`
  opacity: 1;
  transform: translate(0, 0);
`;

export const OptionA = styled.a`
  cursor: pointer;
  display: block;
  padding: 10px 16px;
  font-size: 12px;
  text-decoration: none;
  outline: none;
  position: relative;
  transition: all 0.3s ease;
  &:hover {
    background: ${(props) => props.theme.colors.pastelPurple};
  }
`;

export const OptionUl = styled.ul<IDropdownOpen>`
  ${(props) =>
    props.open
      ? css`
          width: 100%;
          opacity: 1;
          visibility: visible;
          transform: scale(1) translate(0, 12px);
          transition: opacity 0.3s ease, visibility 0.3s ease,
            transform 0.3s cubic-bezier(0.4, 0.6, 0.5, 1.32);
          position: absolute;
          background: ${(props) => props.theme.colors.lightPurple};
          border-radius: 6px;
          overflow-x: hidden;
          overflow-y: auto;
          transform-origin: 0 0;
        `
      : css`
          margin: 0;
          padding: 0;
          list-style: none;
          opacity: 0;
          visibility: hidden;
          position: absolute;
          top: 42px;
          left: 0;
          z-index: 1;
          right: 0;
          border-radius: 6px;
          overflow-x: hidden;
          overflow-y: auto;
          transform-origin: 0 0;
          transition: opacity 0.2s ease, visibility 0.2s ease,
            transform 0.3s cubic-bezier(0.4, 0.6, 0.5, 1.32);
          transform: scale(0.8) translate(0, 4px);
          ${OptionLi} {
            opacity: 0;
            transform: translate(6px, 0);
            transition: all 0.3s ease;

            ${OptionA} {
              opacity: 0;
              transition: all 0.1s ease;
            }
          }
        `}
`;
