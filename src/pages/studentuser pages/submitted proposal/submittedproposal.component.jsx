import { faClose, faEdit, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import "./submittedproposal.styles.scss";
import { UserContext } from "../../../context/user";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  db,
  storage,
  updateData,
} from "../../../utiles/firebase/firebase.utiles";
const ProposalStatus = {
  PENDING: "Pending",
  REJECTED: "Rejected",
  APPROVAL: "Approved",
};
const SubmittedProposal = () => {
  const [proposals, setProposal] = useState({});
  const [noProposal, setNoProposal] = useState(true);
  const [yesProposal, setYesProposal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [Edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser, user } = useContext(UserContext);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const checkUserProposal = async () => {
      const docRef = collection(db, "Proposals-data");
      const querySnapshot = await getDocs(
        query(
          docRef,
          where("createdBy", "array-contains", {
            id: currentUser.id,
          })
        )
      );
      if (!querySnapshot.empty) {
        const proposalData = querySnapshot.docs[0].data();
        setProposal(proposalData);
        console.log(proposalData);
        setYesProposal(true);
        setNoProposal(false);
      } else {
        setNoProposal(true);
        setYesProposal(false);
      }
      setIsLoading(false);
    };
    checkUserProposal();
  }, [proposals.id, isLoading, Edit]);

  const handleProposalEdit = () => {
    setEdit(true);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    try {
      setloading(true);

      let pdf = "";
      const uploadTask = storage.ref(`Proposals/${file.name}`).put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            pdf = url;
            updateData("Proposals-data", {
              id: proposals.id,
              comment: proposals.comment || "",
              createdBy: proposals.createdBy || "",
              file: pdf || "",
              groupID: proposals.groupID || "",
              status: "Pending" || "",
              supervisor: proposals.supervisor || "",
              timestamp: formattedDate || "",
              title: title || "",
            }).then(() => {
              setEdit(false);
              setloading(false);
            });
          });
        }
      );
    } catch {
      console.log("did not save");
    }
  };
  const matchedStudents =
    proposals.createdBy &&
    proposals.createdBy.reduce((matchedArr, student) => {
      const matchedUser = user.find((users) => users.id === student.id);

      if (matchedUser) {
        const matchedStudent = { ...matchedUser, grade: student.grade };

        matchedArr.push(matchedStudent);
      }

      return matchedArr;
    }, []);
  const matchSupervisor =
    proposals.supervisor &&
    user.find((users) => users.id === proposals.supervisor.id);
  const handleclose = () => {
    setEdit(false);
  };
  return (
    <div className="submitted">
      {isLoading ? (
        <div className="submitted-container">
          <div className="submitted-proposal-wait">
            Please Wait <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <>
          {yesProposal ? (
            <div className="submitted-container">
              <div className="submitted-proposal">
                <div className="submitted-proposal-content">
                  <h2 className="submitted-proposal-h2">
                    Proposal Status:
                    {proposals.status === "Approved" ? (
                      <span className="submitted-proposal-approved">
                        {proposals.status}
                      </span>
                    ) : (
                      <span className="submitted-proposal-status">
                        {proposals.status}
                      </span>
                    )}
                  </h2>
                  {proposals.status === ProposalStatus.PENDING && (
                    <div className="submitted-proposal-instruction">
                      <h3 className="submitted-proposal-h3">
                        Instructions for Pending Status
                      </h3>
                      <p className="submitted-proposal-paragraph">
                        Your proposal is currently under review. Please wait for
                        further updates from the evaluation committee.
                      </p>
                    </div>
                  )}
                  {proposals.status === ProposalStatus.REJECTED && (
                    <div className="submitted-proposal-instruction">
                      <h3 className="submitted-proposal-h3">
                        Instructions for Rejected Status
                      </h3>
                      <p className="submitted-proposal-paragraph">
                        Unfortunately, your proposal has been rejected. The
                        evaluation committee has provided comments and feedback.
                        Please review the comments and make necessary revisions
                        before resubmitting your proposal.
                      </p>
                    </div>
                  )}
                  {proposals.status === ProposalStatus.APPROVAL && (
                    <div className="submitted-proposal-instruction">
                      <h3 className="submitted-proposal-h3">
                        Instructions for Approval Status
                      </h3>
                      <p className="submitted-proposal-paragraph">
                        Congratulations! Your proposal has been approved. Please
                        proceed with the necessary steps for your project as
                        instructed by your advisor or the project coordinator.
                      </p>
                    </div>
                  )}
                  <h3 className="submitted-proposal-heading">Your Proposal </h3>
                  <div>
                    <label className="submitted-proposal-info">
                      Title:{" "}
                      <span className="submitted-proposal-span">
                        {proposals.title}
                      </span>
                    </label>
                  </div>{" "}
                  <div>
                    <label className="submitted-proposal-info">
                      Supervisor:
                      <span className="submitted-proposal-span">
                        {matchSupervisor && matchSupervisor.Name}
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="submitted-proposal-info">
                      Document Link:{" "}
                      <a
                        href={proposals.file}
                        className="submitted-proposal-link"
                        target="_blank"
                      >
                        Uploaded Proposal
                      </a>
                    </label>
                  </div>
                  <div className="submitted-proposal-group">
                    <h3 className="submitted-proposal-heading">
                      Your Added Group Member
                    </h3>
                    <div className="submitted-proposal-member-name">
                      {proposals.createdBy &&
                        matchedStudents.map((student, index) => {
                          return (
                            <div
                              className="submitted-proposal-count"
                              key={index}
                            >
                              Member {index + 1}:{" "}
                              <span className="submitted-proposal-name">
                                {student.Name}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <label className="submitted-proposal-commentInfo">
                    <h3 className="submitted-proposal-heading">Comments </h3>
                    <span className="submitted-proposal-span">
                      {proposals.comment.map((item) => (
                        <div className="submitted-proposal-comment">
                          <div className="submitted-proposal-card">
                            <div className="submitted-proposal-card-description">
                              {item.description}
                            </div>
                            <div className="submitted-proposal-card-date">
                              {item.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </span>
                  </label>
                </div>
                {proposals.status === ProposalStatus.PENDING && (
                  <div className="action-buttons">
                    <button className="edit-button-disabled" disabled>
                      <FontAwesomeIcon icon={faEdit} />
                      Edit Proposal
                    </button>
                  </div>
                )}
                {proposals.status === ProposalStatus.REJECTED && (
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={handleProposalEdit}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit Proposal
                    </button>
                  </div>
                )}
                {proposals.status === ProposalStatus.APPROVAL && <div></div>}
              </div>
            </div>
          ) : (
            noProposal && (
              <div className="submitted-container">
                <h2 className="submitted-proposal-noproposal">
                  <FontAwesomeIcon icon={faFile} /> No Proposal submitted
                </h2>
              </div>
            )
          )}
        </>
      )}
      {Edit && (
        <div className="Edit">
          <div className="updated-table-row-close">
            <FontAwesomeIcon icon={faClose} onClick={handleclose} />
          </div>
          <div className="Edit-proposal">
            <form onSubmit={handleSubmit} className="Edit-form-container">
              <div className="Edit-form-container-items">
                <label htmlFor="title" className="Edit-form-container-label">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className="Edit-form-container-input-text"
                  required
                />
              </div>
              <div className="Edit-form-container-items">
                <label htmlFor="file">Proposal:</label>
                <input
                  type="file"
                  id="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button type="submit" className="Edit-form-container-button">
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubmittedProposal;
