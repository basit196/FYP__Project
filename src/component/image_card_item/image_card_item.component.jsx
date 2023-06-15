import "./image_card_item.styles.scss";
import {
  faAngleDoubleRight,
  faProjectDiagram,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/user";

const ImageCardItem = ({ projectType = "", item }) => {
  const { user } = useContext(UserContext);
  const [supervisor, setsupervisor] = useState({});
  useEffect(() => {
    if (user.length > 0) {
      const matchSupervisor =
        item.uploadedBy &&
        user.find((users) => users.id === item.uploadedBy.id);
      setsupervisor(matchSupervisor);
    }
  }, [user]);

  return (
    <div className="card-image-container">
      <div
        className="card-image"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7),
                rgba(0, 0, 0, 0.7)), url(${item.ImageUrl} )`,
        }}
      >
        {projectType && (
          <div className="card-image-project-based">
            <FontAwesomeIcon icon={faProjectDiagram} />
            <span>{projectType.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="card-info">
        <h1 className="card-heading">{item.field}</h1>
        <p className="card-paragraph">
          <FontAwesomeIcon icon={faUser} />
          {supervisor && supervisor.Name}{" "}
        </p>
      </div>
      <div className="card-text">
        <h1 className="card-heading">Title</h1>
        <p className="card-paragraph"> {item.title}</p>
      </div>
      <Link id={item.id} className="round-button" to={item.field}>
        <FontAwesomeIcon icon={faAngleDoubleRight} className="card-icon" />{" "}
        Learn more
      </Link>
    </div>
  );
};
export default ImageCardItem;
