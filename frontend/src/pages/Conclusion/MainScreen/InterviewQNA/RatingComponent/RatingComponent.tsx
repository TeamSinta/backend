import React, { useEffect, useState } from "react";

import { StyledIcon } from "./StyledRatingComponent";
import {
  StyledIconBtnM,
  StyledRatingBtnM,
} from "@/components/common/buttons/button/StyledBtn";
import ElWrap from "@/components/layouts/elWrap/ElWrap";
import { ICustomIconProps } from "@/components/common/svgIcons/CustomIcons";
import {
  DislikeIcon,
  NeutralIcon,
  WrongIcon,
  LikeIcon,
  TopStarIcon,
} from "@/components/common/svgIcons/Icons";

interface Props {
  question: any;
  setRating(rate: any, question: any): any;
  rating: number;
  width?: number;
  height?: number;
}

export const WrongButton = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 1) {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={24}>
          <StyledRatingBtnM
            style={{
              background: "#FABBCF",
              boxShadow: "none",
            }}
          >
            <WrongIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        <ElWrap w={24}>
          <StyledRatingBtnM>
            <WrongIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  }
};

export const DislikeButton = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 2) {
    return (
      <div style={{ marginRight: "5px" }}>
        <ElWrap w={24}>
          <StyledRatingBtnM
            style={{ background: "#FABBCF", boxShadow: "none" }}
          >
            <DislikeIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={24}>
          <StyledRatingBtnM>
            <DislikeIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  }
};

export const NeutralButton = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 3) {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={24}>
          <StyledRatingBtnM
            style={{ background: "#FFFABF", boxShadow: "none" }}
          >
            <NeutralIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={24}>
          <StyledRatingBtnM>
            <NeutralIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  }
};

export const LikeButton = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 4) {
    return (
      <div style={{ marginRight: "5px" }}>
        <ElWrap w={24}>
          <StyledRatingBtnM
            style={{ background: "#DBFDDC", boxShadow: "none" }}
          >
            <LikeIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={24}>
          <StyledRatingBtnM>
            <LikeIcon />
          </StyledRatingBtnM>
        </ElWrap>
      </div>
    );
  }
};

export const TopStarButton = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 5) {
    return (
      <ElWrap w={24}>
        <StyledRatingBtnM style={{ background: "#DBFDDC", boxShadow: "none" }}>
          <TopStarIcon />
        </StyledRatingBtnM>
      </ElWrap>
    );
  } else {
    return (
      <ElWrap w={24}>
        <StyledRatingBtnM>
          <TopStarIcon />
        </StyledRatingBtnM>
      </ElWrap>
    );
  }
};

export function RatingComponent({
  question,
  setRating,
  rating,
  width = 0,
  height = 0,
}: Props) {
  const [activeTab, setActiveTab] = useState<any>(null);
  const handleRating = (rate: any) => {
    setActiveTab(rate);
    setRating(rate, question);
  };

  return (
    <div
      style={{
        display: "flex",

        margin: "0px",
      }}
    >
      <StyledIcon>
        <span onClick={() => handleRating(1)}>
          <WrongButton width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>
      <StyledIcon>
        <span onClick={() => handleRating(2)}>
          <DislikeButton width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>{" "}
      <StyledIcon>
        <span onClick={() => handleRating(3)}>
          <NeutralButton width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>{" "}
      <StyledIcon>
        <span onClick={() => handleRating(4)}>
          <LikeButton width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>{" "}
      <StyledIcon>
        <span onClick={() => handleRating(5)}>
          <TopStarButton width={width} height={height} active={activeTab} />
        </span>
      </StyledIcon>
    </div>
  );
}
