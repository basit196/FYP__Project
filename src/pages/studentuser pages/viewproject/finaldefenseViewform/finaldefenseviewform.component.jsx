import "./finaldefenseviewform.styles.scss";
import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserContext } from "../../../../context/user";
import { db } from "../../../../utiles/firebase/firebase.utiles";
import { ProjectContext } from "../../../../context/projectcontext";
const ProjectStatus = {
  PENDING: "Pending",
  Completed: "Completed",
};
const FinalDefenseviewform = () => {
  const [Project, setProject] = useState({});
  const [noProposal, setNoProposal] = useState(true);
  const [yesProposal, setYesProposal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, user } = useContext(UserContext);
  const { project } = useContext(ProjectContext);
  const [userGrade, setUserGrade] = useState(null);

  useEffect(() => {
    const gradeFind = project.filter((item) => {
      const StudentObj = item.Student.find(
        (student) => currentUser.id === student.id && item.IsDefense === "Final"
      );
      if (StudentObj) {
        setUserGrade(StudentObj.grade);
      }
    });
  }, [project, currentUser, isLoading]);
  console.log(userGrade);
  useEffect(() => {
    const checkUserProposal = async () => {
      const docRef = collection(db, "Project-data");
      let queryRef;

      if (userGrade !== null) {
        queryRef = query(
          docRef,
          where("IsDefense", "==", "Final"),
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
  }, [Project.id, userGrade,isLoading]);

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

  return (
    <div className="submitted">
      {isLoading ? (
        <div>
          <div className="submitted-project-wait">
            Please Wait <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <>
          {yesProposal ? (
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
                        Supervisor:
                        <span className="submitted-project-span">
                          {matchSupervisor && matchSupervisor.Name}
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Document Link:
                        {Project.report && (
                          <a
                            href={project.report}
                            className="submitted-project-link"
                            target="_blank"
                          >
                            Uploaded Thesis
                          </a>
                        )}
                      </label>{" "}
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Video Link:
                        {Project.video && (
                          <a
                            href={project.video}
                            className="submitted-project-link"
                            target="_blank"
                          >
                            Uploaded Video
                          </a>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Web Link:
                        {Project.web && (
                          <a
                            href={Project.web}
                            className="submitted-project-link"
                            target="_blank"
                          >
                            Uploaded web link
                          </a>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="submitted-project-info">
                        Presentation File:
                        <a
                          href={project.presentation}
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
    </div>
  );
};
export default FinalDefenseviewform;
