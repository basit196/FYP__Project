import { useContext } from "react";
import "./ExpandMore.style.scss";
import { IdeaContext } from "../../context/ideascontext";
import ImageCardItem from "../image_card_item/image_card_item.component";
import Title from "../title component/title.component";

const ExpandMore = () => {
  const { idea } = useContext(IdeaContext);
  return (
    <div className="expand-more">
      {idea
        .map((key) => key.projectType)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((projectType) => {
          console.log(projectType);
          return (
            <div className="expand-more-container" key={projectType}>
              <Title text={projectType.toUpperCase()} />{" "}
              {/* Display the title */}
              <div className="expand-more-item">
                {idea
                  .filter((key) => key.projectType === projectType)
                  .map((key) => {
                    return <ImageCardItem key={key.id} item={key} />;
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default ExpandMore;
