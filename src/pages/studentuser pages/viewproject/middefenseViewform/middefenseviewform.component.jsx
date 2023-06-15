import "./middefenseviewform.styles.scss";
import {
  faClose,
  faDownload,
  faEdit,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserContext } from "../../../../context/user";
import {
  db,
  storage,
  updateData,
} from "../../../../utiles/firebase/firebase.utiles";
import { ProjectContext } from "../../../../context/projectcontext";
const ProjectStatus = {
  PENDING: "Pending",
  Completed: "Completed",
};
const MidDefenseviewform = () => {
  const [Project, setProject] = useState({});
  const [noProposal, setNoProposal] = useState(true);
  const [yesProposal, setYesProposal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, user } = useContext(UserContext);
  const { project } = useContext(ProjectContext);
  const [userGrade, setUserGrade] = useState(null);
  const [Edit, setEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPresentationFile, setPresentationFile] = useState(null);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const gradeFind = project.filter((item) => {
      const StudentObj = item.Student.find(
        (student) => currentUser.id === student.id && item.IsDefense === "Mid"
      );
      console.log(StudentObj);

      if (StudentObj) {
        setUserGrade(StudentObj.grade);
      }
    });
  }, [project, userGrade]);

  const handleProposalEdit = () => {
    setEdit(true);
  };
  useEffect(() => {
    const checkUserProposal = async () => {
      const docRef = collection(db, "Project-data");
      let queryRef;

      if (userGrade !== null) {
        queryRef = query(
          docRef,
          where("IsDefense", "==", "Mid"),
          where("Student", "array-contains", {
            id: currentUser.id,
            grade: userGrade,
          })
        );
        const querySnapshot = await getDocs(queryRef);

        if (!querySnapshot.empty) {
          const projectData = querySnapshot.docs[0].data();
          setProject(projectData);
          setYesProposal(true);
          setNoProposal(false);
        } else {
          setNoProposal(true);
          setYesProposal(false);
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    checkUserProposal();
  }, [Project.id, userGrade]);
  const matchedStudents =
    Project.Student &&
    Project.Student.reduce((matchedArr, student) => {
      const matchedUser = user.find((users) => users.id === student.id);

      if (matchedUser) {
        const matchedStudent = { ...matchedUser, grade: student.grade };

        matchedArr.push(matchedStudent);
      }

      return matchedArr;
    }, []);
  const matchSupervisor =
    Project.supervisor &&
    user.find((users) => users.id === Project.supervisor.id);
  const handleuploadchange = (event) => {
    const { name } = event.target;
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;

    if (file.type === "application/pdf") {
      reader.onload = () => {
        setSelectedFile(file);
        setProject({ ...Project, [name]: fileName });
      };
      reader.readAsDataURL(file);
    } else if (
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      {
        reader.onload = () => {
          setPresentationFile(file);
          setProject({ ...Project, [name]: fileName });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    try {
      setloading(true);
      let document = "";
      let presentation = "";
      if (selectedFile) {
        const reportUploadTask = storage
          .ref(`document/${selectedFile.name}`)
          .put(selectedFile);
        await reportUploadTask;

        const reportUrl = await reportUploadTask.snapshot.ref.getDownloadURL();
        document = reportUrl;
      }
      if (selectedPresentationFile) {
        const presentationUploadTask = storage
          .ref(`presentation/${selectedPresentationFile.name}`)
          .put(selectedPresentationFile);
        await presentationUploadTask;

        const presentationUrl =
          await presentationUploadTask.snapshot.ref.getDownloadURL();
        presentation = presentationUrl;
      }
      updateData("Project-data", {
        id: Project.id,
        IsDefense: Project.IsDefense || "",
        comments: Project.comments || "",
        date: formattedDate || "",
        projectCategory: Project.projectCategory || "",
        projectType: Project.projectType || "",
        department: Project.department || "",
        document: document ? document : "",
        status: "Pending" || "",
        remarks: "Pending" || "",
        supervisor: Project.supervisor || "",
        title: Project.title || "",
        Student: Project.Student || "",
        groupID: Project.groupID || "",
        presentation: presentation ? presentation : "",
        count: Project.count,
      });

      console.log("change successfully!");
      setProject(Project);
      setloading(false);
      setEdit(false)
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };
  const handleclose = () => {
    setEdit(false);
  };
  return (
    <div className="submitted">
      {userGrade === null && isLoading ? (
        <div>
          <div className="submitted-project-wait">
            Please Wait <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <>
          {userGrade !== null && yesProposal ? (
            <div className="submitted-content">
              <div className="submitted-project">
                <div className="submitted-project-content">
                  <h2 className="submitted-project-h2">
                    Project Status:
                    {Project.status === "Pending" ? (
                      <span className="submitted-project-status">
                        {Project.status}
                      </span>
                    ) : (
                      <span className="submitted-project-approved">
                        {Project.status}
                      </span>
                    )}
                  </h2>
                  {Project.status === ProjectStatus.PENDING && (
                    <div className="submitted-project-instruction">
                      <h3 className="submitted-project-h3">
                        Instructions for Pending Status
                      </h3>
                      <p className="submitted-project-paragraph">
                        Your project is currently under review. Please wait for
                        further updates from the evaluation committee.
                      </p>
                    </div>
                  )}

                  {Project.status === ProjectStatus.Completed && (
                    <div className="submitted-project-instruction">
                      <h3 className="submitted-project-h3">
                        Instructions for Completed Status
                      </h3>
                      <p className="submitted-project-paragraph">
                        Congratulations! Your Project has been Completed.
                      </p>
                    </div>
                  )}
                  <div className="submitted-project-groups">
                    <h3 className="submitted-project-heading">Your Project </h3>
                    <div>
                      <label className="submitted-project-info">
                        Title:{" "}
                        <span className="submitted-project-span">
                          {Project.title}
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Remarks:{" "}
                        <span className="submitted-project-span">
                          {Project.remarks}
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Supervisor:{" "}
                        <span className="submitted-project-span">
                          {matchSupervisor && matchSupervisor.Name}
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Document Link:{" "}
                        <a
                          href={Project.document}
                          className="submitted-project-link"
                          target="_blank"
                        >
                          Uploaded Document
                        </a>
                      </label>
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Presentation File:
                        <a
                          href={Project.presentation}
                          className="submitted-project-link"
                          target="_blank"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </a>
                      </label>
                    </div>
                    <div className="submitted-project-group">
                      <h3 className="submitted-project-heading">
                        Your Added Group Member
                      </h3>
                      <div className="submitted-project-member-name">
                        {Project.Student &&
                          matchedStudents.map((student, index) => {
                            return (
                              <div className="submitted-project-member">
                                <div className="submitted-project-member-name">
                                  <span
                                    key={index}
                                    className="submitted-project-count"
                                  >
                                    Member{index + 1}
                                    <span className="submitted-project-name">
                                      {student.Name}
                                    </span>
                                  </span>{" "}
                                </div>
                                <div className="submitted-project-member-name">
                                  <span className="submitted-project-count">
                                    Grade
                                    <span className="submitted-project-name">
                                      {student.grade}
                                    </span>
                                  </span>{" "}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <label className="submitted-proposal-commentInfo">
                      <h3 className="submitted-project-heading">Comments</h3>
                      <span className="submitted-proposal-span">
                        {Project.comments.map((item) => (
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
                      </span>{" "}
                    </label>{" "}
                    {Project.remarks === "unsatisfactory" && (
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={handleProposalEdit}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            noProposal && (
              <div>
                <h2 className="submitted-project-noproject">
                  <FontAwesomeIcon icon={faFile} /> No Project submitted
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
            <h4>Upload Documents </h4>
            <form onSubmit={handleSubmit} className="Edit-form-container">
              <div className="Edit-form-container-items">
                <label htmlFor="file">Document:</label>
                <input
                  type="file"
                  id="file"
                  accept=".pdf"
                  onChange={handleuploadchange}
                  required
                />
                <label htmlFor="presentation">Presentation:</label>
                <input
                  type="file"
                  id="presentation"
                  accept="application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handleuploadchange}
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
export default MidDefenseviewform;
