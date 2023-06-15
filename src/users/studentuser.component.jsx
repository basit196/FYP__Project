import { Route, Routes } from "react-router-dom";
import UserNavigation from "../pages/adminuser pages/user Navigation/userNavigation.component";
import UserUiData from "../Data/useruidata";
import StudentDashboard from "../pages/studentuser pages/studentDashboard/studentdashboard.component";
import ViewIdeas from "../pages/studentuser pages/viewideas/viewideas.component";
import UploadProposal from "../pages/studentuser pages/uploadproposal/uploadproposal.component";
import SubmittedProposal from "../pages/studentuser pages/submitted proposal/submittedproposal.component";
import UploadProject from "../pages/studentuser pages/uploadproject/uploadproject.component";
import ViewProject from "../pages/studentuser pages/viewproject/viewproject.component";

const Student = () => {
  const studentData = UserUiData.find((item) => item.Role === "Student");
  return (
    <Routes>
      <Route path="/" element={<UserNavigation item={studentData} />}>
        <Route index element={<StudentDashboard />} />
        <Route path="viewideas" element={<ViewIdeas />} />
        <Route path="uploadproposal" element={<UploadProposal />} />
        <Route path="submittedProposal" element={<SubmittedProposal />} />
        <Route path="uploadproject" element={<UploadProject />} />
        <Route path="viewproject" element={<ViewProject />} />
      </Route>
    </Routes>
  );
};
export default Student;
