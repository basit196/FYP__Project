import { Route, Routes } from "react-router-dom";
import Navigation from "../pages/visitoruser pages/Navigation/navigation.component";
import HomePage from "../pages/visitoruser pages/home-page/home-page.component";
import IdeaRouting from "../nested routing/Ideas routing/ideasrouting.component";
import Projects from "../pages/visitoruser pages/Projects page/projects.component";
import TopPick from "../pages/visitoruser pages/top pick/toppick.component";
import HireTalent from "../pages/visitoruser pages/Hire Talent page/hire-talent.component";
import AboutUsPage from "../pages/visitoruser pages/about us page/about-us-page.component";
import Fyp from "../pages/visitoruser pages/Fyp page/fyp.component";
import Login from "../pages/visitoruser pages/login page/login.component";

const VisitorUser = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<HomePage />} />
        <Route path="ideas/*" element={<IdeaRouting />} />
        <Route path="projects/*" element={<Projects />} />
        <Route path="impact" element={<TopPick />} />
        <Route path="hiretalent" element={<HireTalent />} />
        <Route path="aboutus" element={<AboutUsPage />} />
        <Route path="fyp" element={<Fyp />} />
        <Route path="authentication" element={<Login />} />
      </Route>
    </Routes>
  );
};
export default VisitorUser;
