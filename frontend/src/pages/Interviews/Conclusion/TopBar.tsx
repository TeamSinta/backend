import React, { useMemo, useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import "./index.css";
import { TOP_BAR_INFO } from "./Constants";
import { BodyLBold } from "@/components/common/typeScale/StyledTypeScale";
const TopBar = () => {
  const { BIO_DATA, OVERALL_SCORE, SENTIMENT } = TOP_BAR_INFO;

  return (
    <React.Fragment>
      <Grid container spacing={1} className="bar ">
        <Grid item={true} xs={12} md={5} className="column">
          <div>
            <p className="bio-data-name">{BIO_DATA.NAME}</p>
            <p className="bio-data-designation">{BIO_DATA.DESIGNATION}</p>
            <p className="bio-data-stage">
              <span className="bio-data-stage-label">
                {BIO_DATA.STAGE_LABEL}:{" "}
              </span>{" "}
              <span
                style={{
                  fontFamily: "ChillaxSemi",
                  fontWeight: "600",
                }}
              >
                {BIO_DATA.STAGE_NAME} .{" "}
              </span>
              <span className="bio-data-stage-date">{BIO_DATA.DATE}</span>
            </p>
          </div>
        </Grid>
        <Grid item={true} xs={12} md={3} className="column">
          <div>
            <p>{OVERALL_SCORE.LABEL}</p>
            <div id="progressContainer">
              <progress
                id="myProgress"
                style={{
                  height: "20px",
                }}
                value={OVERALL_SCORE.PERCENTAGE}
                max="100"
              ></progress>
            </div>
            <p>{OVERALL_SCORE.PERCENTAGE}%</p>
          </div>
        </Grid>
        <Grid item={true} xs={12} md={3} className="column">
          <div>
            {" "}
            <p>{SENTIMENT.LABEL}</p>
            <div>
              <span>
                <i className="fa fa-thumbs-up sentimentIcon"></i>
              </span>
              <span
                style={{
                  fontFamily: "ChillaxSemi",
                  fontWeight: "600",
                }}
              >
                {SENTIMENT.TYPE}
              </span>
            </div>
            <p>
              {SENTIMENT.RATING} <span className="sentiment-meta">/ 5</span>{" "}
            </p>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TopBar;
