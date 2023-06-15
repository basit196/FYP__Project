import { Route, Routes } from "react-router-dom";
import UserNavigation from "../pages/adminuser pages/user Navigation/userNavigation.component";
import UserUiData from "../Data/useruidata";
import UploadIdea from "../pages/supervisors pages/upload ideas/uploadidea.component";
import UnderSupervision from "../pages/supervisors pages/undersupervision/undersupervision.component";
import ViewMidProject from "../pages/supervisors pages/Viewmidproject/viewmidproject.component";
import ViewFinalProject from "../pages/supervisors pages/viewfinalproject/viewfinalproject.component";

const Supervisor = () => {
  const supervisorData = UserUiData.find((item) => item.Role === "Supervisor");
  return (
    <Routes>
      <Route path="/" element={<UserNavigation item={supervisorData} />}>
        <Route index element={<UploadIdea />} />
        <Route path="undersupervision" element={<UnderSupervision />} />
        <Route path="viewmidproject" element={<ViewMidProject />} />
        <Route path="viewfinalproject" element={<ViewFinalProject />} />
      </Route>
    </Routes>
  );
};
export default Supervisor;
