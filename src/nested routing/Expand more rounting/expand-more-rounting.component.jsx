import { Route, Routes } from "react-router-dom";
import LearnMore from "../../component/ideaLearnmore component/learnmore.component";
import ExpandMore from "../../component/Expand more/ExpandMore.component";
const ExpandMoreRounting = () => {
  return (
    <Routes>
      <Route index element={<ExpandMore />} />
      <Route path=":ideaText" element={<LearnMore />} />
    </Routes>
  );
};
export default ExpandMoreRounting;
