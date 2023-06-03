import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./cover-image.style.scss";
import { faProjectDiagram } from "@fortawesome/free-solid-svg-icons";
const CoverImage = ({ imageUrl, text, title, projectType }) => {
  return (
    <div
      className="cover-img"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgb(0, 0, 0, 0.7), rgb(0, 0, 0, 0.7)), url(${imageUrl})`,
      }}
    >
      <div className="cover-img-heading">{text}</div>
      {title && (
        <div className="cover-img-subheading">
          <div>
            TITLE : <span>{title}</span>
          </div>
          <div className="cover-img-project-icon">
            <FontAwesomeIcon icon={faProjectDiagram} />
            <span>{projectType.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default CoverImage;
