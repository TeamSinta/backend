import QuestionList from "@/components/common/modal/modalContents/QuestionList";
import TemplateList from "@/components/common/modal/modalContents/TemplateList";
import Calendar from "@/pages/Calendar";
import Candidates from "@/pages/Candidates";
import DashBoard from "@/pages/Dashboard";
import Interviews from "@/pages/Interviews";
import NotFound from "@/pages/NotFound";
import Roles from "@/pages/Roles";
import { Route, Routes } from "react-router-dom";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/interviews" element={<Interviews />}>
        <Route path="/interviews/template" element={<TemplateList />} />
        <Route path="/interviews/template/:id" element={<QuestionList />} />
      </Route>
      <Route path="/candidates" element={<Candidates />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default Routers;
