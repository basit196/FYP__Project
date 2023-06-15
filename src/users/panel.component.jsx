import { Route, Routes } from "react-router-dom";
import UserUiData from "../Data/useruidata";
import UserNavigation from "../pages/adminuser pages/user Navigation/userNavigation.component";
import SetDeadLine from "../pages/Panel pages/setdeadline/setdeadline.component";
import ViewProposal from "../pages/Panel pages/viewproposals/viewproposal.component";
import Tab from "../pages/Panel pages/viewproposals/tabstatus/tabstatus.component";
import ViewDefenseProject from "../pages/Panel pages/Denfense projects/defenseproject.component";
import ViewOldProposal from "../pages/Panel pages/viewoldproposal/viewoldproposal.component";
const Panel = () => {
  const PanelData = UserUiData.find((item) => item.Role === "Panel");
  return (
    <Routes>
      <Route path="/" element={<UserNavigation item={PanelData} />}>
        {" "}
        <Route index element={<SetDeadLine />} />
        <Route path="proposals" element={<Tab />} />
        <Route path="viewdefenseproject" element={<ViewDefenseProject />} />
        <Route path="viewoldproposal" element={<ViewOldProposal />} />
      </Route>
    </Routes>
  );
};
export default Panel;
