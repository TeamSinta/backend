import QuestionList from "@/components/common/modal/modalContents/QuestionList";
import TemplateList from "@/components/common/modal/modalContents/TemplateList";
import Calendar from "@/pages/Calendar";
import Candidates from "@/pages/Candidates";
import { Conclusion } from "@/pages/Interviews/Conclusion";
import DashBoard from "@/pages/Dashboard/Dashboard";
import Interview from "@/pages/Interview/Interview";
import Templates from "@/pages/Templates";
import NotFound from "@/pages/NotFound";
import InterviewDetails from "@/pages/InterviewDetails";
import { Route, Routes } from "react-router-dom";
import LoginScreen from "@/pages/Login/Login";
import LogOutScreen from "@/pages/LogOut";
import Conclusions from "@/pages/Interviews/InterviewsHome";

const Routers = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />;
      <Route path="/" element={<DashBoard />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/templates" element={<Templates />}>
        <Route path="/templates/template" element={<TemplateList />} />
        <Route path="/templates/template/:id" element={<QuestionList />} />
        <Route path="/templates/:id" element={<InterviewDetails />} />
      </Route>
      <Route path="/candidates" element={<Candidates />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/logout" element={<LogOutScreen />} />
      <Route path="/interviews" element={<Conclusions />} />
      <Route path="/interviews/Conclusion" element={<Conclusion />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/video-call" element={<Interview />} />
    </Routes>
  );
};
export default Routers;
