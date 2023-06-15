import { useContext, useEffect, useState } from "react";
import "./ExpandMore.style.scss";
import { IdeaContext } from "../../context/ideascontext";
import ImageCardItem from "../image_card_item/image_card_item.component";
import Title from "../title component/title.component";

const ExpandMore = () => {
  const { idea } = useContext(IdeaContext);
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
    <div className="expand-more-background">
      <div className="expand-more">
        {idea.length > 0 ? (
          idea
            .map((key) => key.projectType)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((projectType) => {
              return (
                <div className="expand-more-container" key={projectType}>
                  <Title text={projectType.toUpperCase()} />{" "}
                  <div className="expand-more-item">
                    {idea
                      .filter((key) => key.projectType === projectType)
                      .map((key) => {
                        return <ImageCardItem key={key.id} item={key} />;
                      })}
                  </div>
                </div>
              );
            })
        ) : (
          <div>Data is Not Foynd</div>
        )}
      </div>{" "}
    </div>
  );
};
export default ExpandMore;
