import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./viewideapopup.styles.scss";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { IdeaContext } from "../../../../context/ideascontext";
import { db, updateData } from "../../../../utiles/firebase/firebase.utiles";
import { UserContext } from "../../../../context/user";
import { doc, onSnapshot } from "firebase/firestore";
const ViewIdeaPopUp = ({ item }) => {
  const { currentUser, user } = useContext(UserContext);
  const { setIsView } = useContext(IdeaContext);
  const [FindStudent, setFindStudent] = useState(false);
  const [studentAdd, setStudentAdd] = useState(false);
  const [updatedItem, setUpdatedItem] = useState(item);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const itemRef = doc(db, "Idea-data", item.id);
    const unsubscribe = onSnapshot(itemRef, (snapshot) => {
      if (snapshot.exists()) {
        setUpdatedItem(snapshot.data());
      }
    });

    return () => unsubscribe();
  }, [item.id]);
  const closeEdit = () => {
    setIsView(false);
  };
  const CloseStudent = () => {
    setStudentAdd(false);
  };
  const handleAddYes = async (event) => {
    event.preventDefault();
    setLoading(true);

    const updatedStudents = [...updatedItem.student, { id: currentUser.id }];
    try {
      await updateData("Idea-data", {
        id: updatedItem.id,
        projectCategory: updatedItem.projectCategory || "",
        projectType: updatedItem.projectType || "",
        ImageUrl: updatedItem.ImageUrl || "",
        supervisor: updatedItem.supervisor || "",
        title: updatedItem.title || "",
        field: updatedItem.field || "",
        abstract: updatedItem.abstract || "",
        status: "selected" || "",
        student: updatedStudents || "",
        isAdd: true,
      });

      console.log("change successfully!");
      setStudentAdd(false);
      setFindStudent(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const handleAddNo = async (event) => {
    event.preventDefault();
    setLoading(true);
    const updatedStudents = [...updatedItem.student, { id: currentUser.id }];
    try {
      await updateData("Idea-data", {
        id: item.id,
        projectCategory: updatedItem.projectCategory || "",
        projectType: updatedItem.projectType || "",
        ImageUrl: updatedItem.ImageUrl || "",
        supervisor: updatedItem.supervisor || "",
        title: updatedItem.title || "",
        field: updatedItem.field || "",
        abstract: updatedItem.abstract || "",
        status: "selected" || "",
        student: updatedStudents || "",
        isAdd: false,
      });

      console.log("change successfully!");
      setStudentAdd(false);
      setFindStudent(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const handleSelect = () => {
    const isStudent = updatedItem.student.some((student) => {
      return student.id === currentUser.id;
    });
    if (isStudent) {
      setFindStudent(true);
    } else setStudentAdd(true);
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
                rgba(0, 0, 0, 0.7)), url(${updatedItem.ImageUrl} )`,
            }}
          ></div>
          <div className="view-idea-popup-field">
            <div className="view-idea-popup-side-image">
              <h2 className="view-idea-popup-field-text">
                {updatedItem.field}
              </h2>
              <div className="view-idea-popup-btns-container">
                <div className="view-idea-popup-btns">
                  {updatedItem.status === "unselected" ? (
                    <button
                      className="view-idea-popup-button"
                      onClick={handleSelect}
                    >
                      Select
                    </button>
                  ) : (
                    <button className="view-idea-popup-button-disable" disabled>
                      Selected
                    </button>
                  )}
                  {updatedItem.student?.length === 0 ? (
                    <button className="view-idea-popup-button-disable" disabled>
                      Add
                    </button>
                  ) : updatedItem.isAdd ? (
                    <button
                      className="view-idea-popup-button"
                      onClick={handleSelect}
                    >
                      Add
                    </button>
                  ) : (
                    <button className="view-idea-popup-button-disable" disabled>
                      Add
                    </button>
                  )}
                </div>
                {FindStudent && (
                  <p className="view-idea-popup-student-avaliable">
                    You already got this idea
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="view-idea-popup-selected-by">
            <span>Selected by:</span>
            <div className="view-idea-popup-students">
              {user &&
                updatedItem.student.map((item, index) => {
                  const studentsFind = user.find(
                    (users) => item.id === users.id
                  );
                  return (
                    <span key={index}>
                      {studentsFind.username}
                      {index !== updatedItem.student.length - 1 && " , "}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="view-idea-popup-detail">
          <div className="view-idea-popup-main">
            <div className="view-idea-popup-title">
              <h2 className="view-idea-popup-text">Title</h2>
              <h2 className="view-idea-popup-heading">{updatedItem.title}</h2>
            </div>
            <div className="view-idea-popup-abstract">
              <h2 className="view-idea-popup-text">Abstract</h2>
              <p className="view-idea-popup-paragraph">
                {updatedItem.abstract}
              </p>
            </div>
          </div>
        </div>
      </div>
      {studentAdd && (
        <div className="add-student">
          <div className="add-student-container">
            <FontAwesomeIcon
              icon={faClose}
              onClick={CloseStudent}
              className="add-student-icon"
            />
            <p>Would you like to add another member to your group?</p>
            <div className="view-idea-popup-btns">
              <button className="view-idea-popup-no" onClick={handleAddNo}>
                No
              </button>
              <button className="view-idea-popup-yes" onClick={handleAddYes}>
                yes
              </button>
            </div>
          </div>
          {loading && (
            <div className="view-idea-popup-wait">
              wait <div className="spinner"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ViewIdeaPopUp;
