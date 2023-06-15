import { Route, Routes } from "react-router-dom";
import UserNavigation from "../pages/adminuser pages/user Navigation/userNavigation.component";
import UserUiData from "../Data/useruidata";
import UploadIdea from "../pages/supervisors pages/upload ideas/uploadidea.component";
import SelectedBy from "../pages/company owner/selectedby.component";

const CompanyOwner = () => {
  const CompanyownerData = UserUiData.find(
    (item) => item.Role === "Company Owner"
  );

  return (
    <Routes>
      <Route path="/" element={<UserNavigation item={CompanyownerData} />}>
        <Route index element={<UploadIdea />} />
        <Route path="selectedby" element={<SelectedBy />} />
      </Route>
    </Routes>
  );
};
export default CompanyOwner;
