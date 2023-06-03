import { Link } from "react-router-dom";
import Paragraph from "../../../component/Paragraph component/paragraph.component";
import "./hire-talent.style.scss";
const HireTalent = () => {
  const hireTalent = {
    para: "The Students Emplolyement is Big Challange and Here we would like to address this challange. We are planning to host Students database accessible to industry and Society. The best way for prospective employers to reach students is through database, where you can review  student resumes, work, Teachers remarks. Both on-campus and off-campus employers may request a login and password to gain access to the Students database. We would like to Introduce Talent acquistion process of indentifying Certified skilss to meet your organizational needs. Our Database will answer for identifying, acquiring, assessing, and hiring candidates to fill employeers needs. We will set Professional Yard Sticks for effective talent acquistion include sourcing strategies, candidates assessment, compliance and hiring standards, and fluency in employment brading practices and corporate hiring initiatives.",
  };
  return (
    <div className="hire-talent">
      <Paragraph text={hireTalent.para} />
      <div className="hire-button">
        <Link
          path="/"
          className="rectangle-button"
          children="Access Students Database"
        />
      </div>
    </div>
  );
};
export default HireTalent;
