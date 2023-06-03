import { Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/adminuser pages/Dashboard page/Dashboardpage.component";
import ManageUser from "../pages/adminuser pages/Manageuser page/manageuser.component";
import UserNavigation from "../pages/adminuser pages/user Navigation/userNavigation.component";
import UserUiData from "../Data/useruidata";
import RegisterUser from "../pages/adminuser pages/RegisterUser page/RegisterUser.component";
import ManageIdeas from "../pages/adminuser pages/Manageideas page/manageideas.component";
import ManageProject from "../pages/adminuser pages/Manageprojects page/manageproject.component";

const Admin = () => {
  const adminData = UserUiData.find((item) => item.Role === "Admin");
  return (
    <Routes>
      <Route path="/" element={<UserNavigation item={adminData} />}>
        <Route index element={<DashboardPage />} />
        <Route path="RegisterUser" element={<RegisterUser />} strict />
        <Route path="ManageUser" element={<ManageUser />} strict />
        <Route path="ViewAllIdeas" element={<ManageIdeas />} strict />
        <Route path="ViewAllProjects" element={<ManageProject />} strict />
      </Route>
    </Routes>
  );
};
export default Admin;
