import { Route, Routes } from "react-router-dom";
import ExpandMoreRounting from "../Expand more rounting/expand-more-rounting.component";
import IdeaPage from "../../pages/visitoruser pages/ideaspage/ideaspage.component";
import LearnMore from "../../component/ideaLearnmore component/learnmore.component";

const IdeaRouting = () => {
  return (
    <Routes>
      <Route index element={<IdeaPage />} />
      <Route path=":ideaText" element={<LearnMore />} />
      <Route path="Expand-more/*" element={<ExpandMoreRounting />} />
    </Routes>
  );
};
export default IdeaRouting;
