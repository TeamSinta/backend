import Calendar from "@/pages/Calendar";
import Candidates from "@/pages/Candidates";
import { Conclusion } from "@/pages/Interviews/Conclusion";
import DashBoard from "@/pages/Dashboard/Dashboard";
import Interview from "@/pages/Interview/Interview";
import InterviewStage from "@/pages/InterviewStage";
import Templates from "@/pages/Templates";
import NotFound from "@/pages/NotFound";
import InterviewDetails from "@/pages/InterviewDetails";
import { Route, Routes } from "react-router-dom";
import LoginScreen from "@/pages/Login/Login";
import LogOutScreen from "@/pages/LogOut";
import Conclusions from "@/pages/Interviews/InterviewsHome";
import { ProtectedRoutes } from "./authenticated/privateRoutes";

const Routers = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/logout" element={<LogOutScreen />} />

      <Route path="" element={<ProtectedRoutes />}>
        <Route path="/" element={<DashBoard />} />
        <Route path="/dashboard" element={<DashBoard />} />

        <Route path="/templates" element={<Templates />}>
          <Route path="/templates/:id" element={<InterviewDetails />} />
        </Route>

        <Route
          path="/templates/stage/:department/:round"
          element={<InterviewStage />}
        />
        {/* <Route
        path="/interviews/:department/:round"
        element={<InterviewStage />}
      /> */}

        <Route path="/candidates" element={<Candidates />} />
        <Route path="/calendar" element={<Calendar />} />

        <Route path="/interviews" element={<Conclusions />} />
        <Route path="/interviews/Conclusion" element={<Conclusion />} />

        <Route path="/video-call" element={<Interview />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
export default Routers;
