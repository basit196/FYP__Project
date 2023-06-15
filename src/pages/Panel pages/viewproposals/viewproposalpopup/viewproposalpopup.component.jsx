import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./viewproposalpopup.styles.scss";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { IdeaContext } from "../../../../context/ideascontext";
import { db } from "../../../../utiles/firebase/firebase.utiles";
import { default as ReactSelect } from "react-select";
import { UserContext } from "../../../../context/user";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Status } from "../../../../Data/StatusData";
import { colourStyles } from "../../../../component/filter component/filterstyle";
const ViewProposalPopUp = ({ item, sTatus }) => {
  const { user } = useContext(UserContext);
  const { setIsView } = useContext(IdeaContext);
  const [updatedItem, setUpdatedItem] = useState(item);
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (item.id) {
      const itemRef = doc(db, "Proposals-data", item.id);
      const unsubscribe = onSnapshot(itemRef, (snapshot) => {
        if (snapshot.exists()) {
          setUpdatedItem(snapshot.data());
        }
      });

      return () => unsubscribe();
    }
  }, [item.id]);
  const closeEdit = () => {
    setIsView(false);
  };
  const handleOptionChange = (label) => {
    setStatus(label);
  };
  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const newComment = {
      description: comments,
      date: `${year}-${month}-${day}`,
    };

    const updatedComments = [...updatedItem.comment, newComment];
  
    try {
      const docRef = doc(db, "Proposals-data", item.id);
      await updateDoc(docRef, {
        comment: updatedComments,
        status: status,
      });
      setStatus("");
      setComments("");
      setIsView(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="view-proposal-popup">
      <div className="updated-table-row-close">
        <FontAwesomeIcon icon={faClose} onClick={closeEdit} />
      </div>
      <div className="view-proposal-popup-content">
        <div className="panel-view-proposal-form">
          <div className="form-heading-container">
            <h2 className="form-heading">Title:</h2>
            <span> {item.title && item.title}</span>
          </div>
          <div className="form-section">
            <h3 className="section-heading">Proposal Document:</h3>
            <a
              href={updatedItem.file}
              className="document-link"
              target="_blank"
            >
              Proposal Document Link
            </a>{" "}
          </div>
          <div className="form-section">
            <h3 className="section-heading">Supervisor:</h3>
            {item.supervisor &&
              user
                .filter((users) => users.id === item.supervisor.id)
                .map((supervisor) => {
                  return <p>{supervisor.Name}</p>;
                })}{" "}
          </div>{" "}
          <div className="form-section">
            <h3 className="section-heading">Students:</h3>
            <div className="students-list">
              {item.createdBy &&
                item.createdBy.map((student, index) => {
                  const studentFind =
                    user &&
                    user.find((studentItem) => student.id === studentItem.id);

                  return (
                    <span className="student-item">
                      {index + 1}
                      {")"}
                      {studentFind && studentFind.Name} -{" "}
                      {studentFind && studentFind.username}
                    </span>
                  );
                })}
            </div>
          </div>
          {sTatus === "Rejected" && (
            <div className="form-section">
              <h3 className="section-heading">Previous comments</h3>
              {item.comment &&
                item.comment.map((item, index) => {
                  return (
                    <div>
                      {index + 1}
                      {")"}
                      {item.description}
                    </div>
                  );
                })}
            </div>
          )}
          {sTatus === "Pending" ? (
            <form className="form-container" onSubmit={handleSubmit}>
              <h3 className="section-heading">Status:</h3>
              <ReactSelect
                isSearchable
                onChange={(selectedOption) =>
                  handleOptionChange(selectedOption.label)
                }
                options={Status[0].options}
                className="select-drop-down"
                placeholder="Status"
                styles={colourStyles}
                required
              />

              <h3 className="section-heading">Comments:</h3>
              <textarea
                className="comments-textarea"
                value={comments}
                onChange={handleCommentsChange}
                required
              />
              {sTatus === "Pending" ? (
                <button className="submit-button" type="submit">
                  Upload
                </button>
              ) : sTatus === "Approved" ? (
                <button
                  type="submit"
                  className="View-proposal-disabled"
                  disabled
                >
                  Upload
                </button>
              ) : (
                ""
              )}
            </form>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewProposalPopUp;
