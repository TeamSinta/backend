import { Grid } from "@mui/material";
import { BottomNavBar } from "./Daily/BottomNavBar";
import Call from "./Daily/Call/Call";
import BottomNavBarCandidate from "./Daily/BottomNavBar/BottomNavBarCandidate ";

const InterviewScreenCandidate = ({ leaveCall }) => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Grid
        container
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          padding: "2%",
        }}
      >
        <Grid item xs={12}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <img
                alt="sinta-logo"
                src="src\assets\images\Sinta Gray Logo.png"
                width="100"
                height="40"
              ></img>
            </div>{" "}
            <div
              style={{
                position: "relative",
                width: "100%",
                marginTop: "30px",

                color: "white",
              }}
            >
              <div>
                <Call />
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      <BottomNavBarCandidate leaveCall={leaveCall} />
    </div>
  );
};

export default InterviewScreenCandidate;
