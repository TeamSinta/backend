import styled from "styled-components";
import checked from "@/assets/svg/checked.svg";

export const Checked = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  &.checked {
    display: none;
    background-image: url(${checked});
    background-size: cover, contain;
    background-position: center, right bottom;
    background-repeat: no-repeat, no-repeat;
  }
`;

export const PhotoWrap = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  border-radius: 12px;
`;

export const PhotoCheckBox = styled.div<{ url: string }>`
  margin: 0;
  width: 40px;
  height: 40px;
  background-image: url(${(props) => props.url});
  background-size: cover, contain;
  background-position: center, right bottom;
  background-repeat: no-repeat, no-repeat;
  position: relative;
  border-radius: inherit;
`;

export const NameCheckBox = styled.div`
  margin: 0;
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.theme.colors.lightGrey};
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PhotoCheckBoxCover = styled.div`
  display: none;
  background: linear-gradient(
    0deg,
    rgba(100, 98, 241, 0.5),
    rgba(100, 98, 241, 0.5)
  );
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  border-radius: inherit;
`;

export const PhotoCheckBoxDiv = styled.div`
  cursor: pointer;
  position: relative;
  border-radius: inherit;
  &:hover {
    ${PhotoCheckBoxCover} {
      display: block;
    }
  }

  &.checked {
    ${Checked} {
      display: block;
    }
    ${PhotoCheckBoxCover} {
      display: block;
    }
  }
`;

export const PhotosWrap = styled.div`
  display: flex;
  gap: 8px;
`;

export const PhotoContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;
