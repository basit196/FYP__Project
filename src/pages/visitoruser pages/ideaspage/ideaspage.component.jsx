import { Link } from "react-router-dom";
import Image_Directive from "../../../component/Image Directive component/Image_Directive.component.jsx";
import Paragraph from "../../../component/Paragraph component/paragraph.component.jsx";
import Title from "../../../component/title component/title.component.jsx";
import "./ideaspage.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
const IdeaPage = () => {
  const ideaText = {
    para: "IDEA's Drive version. Without idea - any efforts can't get desitnation. As we all knoe that FYP is pre departure stage towards  Professional life. At this stage, we all have to allign with applied idea cum field w.r.t to our taste & skills",
  };

  return (
    <div className="idea-page-container">
      <div className="ideas-text-container">
        <Title text="IDEA" />
        <Paragraph text={ideaText.para} />
        <Title text="IDEA BOOK" />
      </div>
      <div className="idea-book-images-container">
        <div className="idea-book-images">
          <Image_Directive />
        </div>
        <div className="Explore-Button">
          <Link path="/ideas" className="Expand-button" to="Expand-more">
            Explore More
            <FontAwesomeIcon icon={faCaretDown} className="icon" />
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};
export default IdeaPage;
