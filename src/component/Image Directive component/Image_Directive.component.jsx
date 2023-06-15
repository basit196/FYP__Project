import "./Image_Directive.styles.scss";
import { Fragment, useEffect, useState } from "react";
import { useContext } from "react";
import { IdeaContext } from "../../context/ideascontext";
import ImageCardItem from "../image_card_item/image_card_item.component";

const Image_Directive = () => {
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
    <div className="image-directive">
      {idea.length > 0 ? (
        idea
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
          })
      ) : (
        <div className="image-directive">
          <div className="data-error">Data not Found</div>
        </div>
      )}
    </div>
  );
};

export default Image_Directive;
