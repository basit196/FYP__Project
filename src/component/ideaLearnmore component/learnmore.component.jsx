import { useParams } from "react-router-dom";
import CoverImage from "../cover-image component/cover-image.component";
import Footer from "../footer component/footer.component.jsx";
import "./learnmore.style.scss";
import { useContext, useEffect, useState } from "react";
import { IdeaContext } from "../../context/ideascontext";
import Title from "../title component/title.component";
import Paragraph from "../Paragraph component/paragraph.component";
import { UserContext } from "../../context/user";
const LearnMore = () => {
  const { idea } = useContext(IdeaContext);
  const { user } = useContext(UserContext);
  const { ideaText } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idea.length > 0) {
      setLoading(false);
    }
  }, [idea]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="learnmore">
      {idea.length>0?idea
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
                  <h3 className="learnmore-supervisor-heading">Uploaded by:</h3>
                  {user
                    .filter((users) => users.id === key.uploadedBy.id)
                    .map((uploadedBy) => {
                      return (
                        <p className="learnmore-supervisor-paragraph">
                          {uploadedBy.Name}({uploadedBy.role})
                        </p>
                      );
                    })}
                </div>
              </div>
              <Footer />
            </>
          );
        }):<div>Data not Found</div>}
    </div>
  );
};
export default LearnMore;
