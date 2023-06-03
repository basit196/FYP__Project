import "./Image_Directive.styles.scss";
import { Fragment } from "react";
import { useContext } from "react";
import { IdeaContext } from "../../context/ideascontext";
import ImageCardItem from "../image_card_item/image_card_item.component";

const Image_Directive = () => {
  const { idea } = useContext(IdeaContext);
  return (
    <div className="image-directive">
      {idea
        .filter((_, idx) => idx < 4)
        .map((key) => {
          const { projectType } = key;
          return (
            <Fragment key={key.id}>
              <ImageCardItem
                key={key.id}
                item={key}
                projectType={projectType}
              />
            </Fragment>
          );
        })}
    </div>
  );
};
export default Image_Directive;
