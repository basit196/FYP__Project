import { useParams } from "react-router-dom";
import CoverImage from "../cover-image component/cover-image.component";
import Footer from "../footer component/footer.component.jsx";
import "./learnmore.style.scss";
import { useContext } from "react";
import { IdeaContext } from "../../context/ideascontext";
import Title from "../title component/title.component";
import Paragraph from "../Paragraph component/paragraph.component";
const LearnMore = () => {
  const { idea } = useContext(IdeaContext);
  const { ideaText } = useParams();
  return (
    <div className="learnmore">
      {idea
        .filter((item) => item.field === ideaText)
        .map((key) => {
          return (
            <>
              <CoverImage
                key={key.field}
                imageUrl={key.ImageUrl}
                text={`${key.field}`}
                title={key.title}
                projectType={key.projectType}
              />
              <div className="learnmore-content">
                <Title text="Abstract" />
                <div className="learnmore-abstract">
                  <Paragraph text={key.abstract} />
                  <p className="learnmore-paragraph"></p>
                </div>
                <div className="learnmore-supervisor-name">
                  <h3 className="learnmore-supervisor-heading">
                    Supervised by:{" "}
                  </h3>
                  <p className="learnmore-supervisor-paragraph">
                    {key.supervisor}
                  </p>
                </div>
              </div>
              <Footer />
            </>
          );
        })}
    </div>
  );
};
export default LearnMore;
