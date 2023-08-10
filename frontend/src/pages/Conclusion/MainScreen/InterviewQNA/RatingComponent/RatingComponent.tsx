import React, { useEffect, useState } from "react";

import { StyledIcon } from "./StyledRatingComponent";
import {
  StyledIconBtnM,
  StyledRatingBtnL,
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

export const WrongButtonL = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 1) {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={40}>
          <StyledRatingBtnL
            style={{
              background: "#FABBCF",
              boxShadow: "none",
            }}
          >
            <WrongIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        <ElWrap w={40}>
          <StyledRatingBtnL>
            <WrongIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  }
};

export const DislikeButtonL = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 2) {
    return (
      <div style={{ marginRight: "5px" }}>
        <ElWrap w={40}>
          <StyledRatingBtnL
            style={{ background: "#FABBCF", boxShadow: "none" }}
          >
            <DislikeIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={40}>
          <StyledRatingBtnL>
            <DislikeIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  }
};

export const NeutralButtonL = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 3) {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={40}>
          <StyledRatingBtnL
            style={{ background: "#FFFABF", boxShadow: "none" }}
          >
            <NeutralIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={40}>
          <StyledRatingBtnL>
            <NeutralIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  }
};

export const LikeButtonL = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 4) {
    return (
      <div style={{ marginRight: "5px" }}>
        <ElWrap w={40}>
          <StyledRatingBtnL
            style={{ background: "#DBFDDC", boxShadow: "none" }}
          >
            <LikeIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  } else {
    return (
      <div style={{ marginRight: "5px" }}>
        {" "}
        <ElWrap w={40}>
          <StyledRatingBtnL>
            <LikeIcon />
          </StyledRatingBtnL>
        </ElWrap>
      </div>
    );
  }
};

export const TopStarButtonL = (props: ICustomIconProps): JSX.Element => {
  const { width, fill, active, height } = props;
  if (active === 5) {
    return (
      <ElWrap w={40}>
        <StyledRatingBtnL style={{ background: "#DBFDDC", boxShadow: "none" }}>
          <TopStarIcon />
        </StyledRatingBtnL>
      </ElWrap>
    );
  } else {
    return (
      <ElWrap w={40}>
        <StyledRatingBtnL>
          <TopStarIcon />
        </StyledRatingBtnL>
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

export function RatingComponentL({
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
        marginLeft: "0.5%",
        marginRight: "0.5%",
        justifyContent: "space-between",
      }}
    >
      <StyledIcon>
        <span onClick={() => handleRating(1)}>
          <WrongButtonL width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>
      <StyledIcon>
        <span onClick={() => handleRating(2)}>
          <DislikeButtonL width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>{" "}
      <StyledIcon>
        <span onClick={() => handleRating(3)}>
          <NeutralButtonL width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>{" "}
      <StyledIcon>
        <span onClick={() => handleRating(4)}>
          <LikeButtonL width={width} height={height} active={activeTab} />
        </span>{" "}
      </StyledIcon>{" "}
      <StyledIcon>
        <span onClick={() => handleRating(5)}>
          <TopStarButtonL width={width} height={height} active={activeTab} />
        </span>
      </StyledIcon>
    </div>
  );
}
