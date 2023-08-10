import {
  NavBookmarkIcon,
  NavCamIcon,
  NavCircle,
  NavFlagIcon,
  NavFullScreenIcon,
  NavMicIcon,
  NavScreenShareIcon,
} from "@/components/common/svgIcons/Icons";
import {
  StyledBottomBar,
  StyledBottomNavButtons,
  StyledColumns,
  StyledFinishBtn,
} from "./StyledBottomNavBar";
import { Grid } from "@mui/material";
import "./index.css";

function BottomNavBar(props: any) {
  const { setReactClicked, reactClicked } = props;
  return (
    <StyledBottomBar>
      <Grid container>
        <Grid lg={3} md={3} sm={3} xl={3} xs={3}>
          <StyledColumns>
            <StyledBottomNavButtons style={{ marginLeft: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  className="record-label"
                  style={{ marginLeft: "5px", marginRight: "5px" }}
                >
                  Start Recording
                </span>{" "}
                <span className="icon" style={{ marginLeft: "5px" }}>
                  <NavFullScreenIcon />
                </span>
              </div>
            </StyledBottomNavButtons>
            <StyledBottomNavButtons>
              <NavMicIcon />
            </StyledBottomNavButtons>
            <StyledBottomNavButtons>
              <NavCamIcon />
            </StyledBottomNavButtons>
          </StyledColumns>
        </Grid>
        <Grid lg={1} md={1} sm={1} xl={1} xs={1}></Grid>
        <Grid lg={6} md={6} sm={6} xl={6} xs={6}>
          {" "}
          <StyledColumns>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "🔥",
                });
              }}
            >
              🔥
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "👎",
                });
              }}
            >
              👎
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "👍",
                });
              }}
            >
              👍
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "❤️",
                });
              }}
            >
              <i className="fa fa-heart" style={{ color: "#FF3D2F" }}></i>
            </StyledBottomNavButtons>
            <StyledBottomNavButtons
              onClick={() => {
                setReactClicked({
                  clicked: reactClicked?.clicked + 1,
                  message: "😂",
                });
              }}
            >
              😂
            </StyledBottomNavButtons>
            <div style={{ marginRight: "10px", marginLeft: "10px" }}>
              <NavCircle />
            </div>
            <StyledBottomNavButtons>
              <NavBookmarkIcon />
            </StyledBottomNavButtons>
            <StyledBottomNavButtons>
              <NavFlagIcon />
            </StyledBottomNavButtons>
            <StyledBottomNavButtons>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  className="screen-share"
                  style={{ marginLeft: "5px", marginRight: "5px" }}
                >
                  Share Screen{" "}
                </span>{" "}
                <span className="icon" style={{ marginLeft: "10px" }}>
                  <NavScreenShareIcon />
                </span>
              </div>
            </StyledBottomNavButtons>
          </StyledColumns>
        </Grid>

        <Grid lg={2} md={2} sm={2} xl={2} xs={2}>
          {" "}
          <StyledColumns style={{ paddingRight: "20px", float: "right" }}>
            <StyledFinishBtn className="accentPurple">Finish</StyledFinishBtn>
          </StyledColumns>
        </Grid>
      </Grid>
    </StyledBottomBar>
  );
}

export default BottomNavBar;
