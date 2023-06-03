import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./viewideapopup.styles.scss";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { IdeaContext } from "../../context/ideascontext";
import { updateData } from "../../utiles/firebase/firebase.utiles";
import { UserContext } from "../../context/user";
const ViewIdeaPopUp = ({ item }) => {
  const { currentUser } = useContext(UserContext);
  const { setIsView } = useContext(IdeaContext);
  const closeEdit = () => {
    setIsView(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedStudents = [...item.student, { id: currentUser.id, name: currentUser.Name }];

    try {
      updateData("Idea-data", {
        id: item.id,
        projectCategory: item.projectCategory || "",
        projectType: item.projectType || "",
        ImageUrl: item.ImageUrl || "",
        supervisor: item.supervisor || "",
        title: item.title || "",
        field: item.field || "",
        abstract: item.abstract || "",
        status: "selected" || "",
        student:updatedStudents||"",
      });

      console.log("change successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  return (
    <div className="view-idea-popup">
      <div className="updated-table-row-close">
        <FontAwesomeIcon icon={faClose} onClick={closeEdit} />
      </div>
      <div className="view-idea-popup-content">
        <div className="view-idea-popup-image">
          <div
            className="view-idea-popup-image"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7),
                rgba(0, 0, 0, 0.7)), url(${item.ImageUrl} )`,
            }}
          ></div>
          <div className="view-idea-popup-field">
            <h2 className="view-idea-popup-field-text">{item.field} </h2>
          </div>
        </div>
        <div className="view-idea-popup-detail">
          <div className="view-idea-popup-main">
            <div className="view-idea-popup-title">
              <h2 className="view-idea-popup-text">Title</h2>
              <h2 className="view-idea-popup-heading">{item.title}</h2>
            </div>
            <div className="view-idea-popup-abstract">
              <h2 className="view-idea-popup-text">Abstract</h2>
              <p className="view-idea-popup-paragraph">{item.abstract}</p>
            </div>
          </div>
          {item.status === "unselected" ? (
            <button className="view-idea-popup-button" onClick={handleSubmit}>
              Select
            </button>
          ) : (
            <button className="view-idea-popup-button-disable" disabled>
              Selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewIdeaPopUp;
