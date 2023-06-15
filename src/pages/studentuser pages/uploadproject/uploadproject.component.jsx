import "./uploadproject.styles.scss";
import { useContext, useEffect, useState } from "react";
import shortid from "shortid";
import { UserContext } from "../../../context/user";
import {
  arrayUnion,
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../utiles/firebase/firebase.utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import UploadFinalProjectForm from "./uploadfinalprojectform/uploadfinalprojectform.component";
import DefenseOptionForm from "./defenseoption/defenseoption.component";
import { ProjectContext } from "../../../context/projectcontext";
import UploadMidProjectForm from "./uploadmidprojectform/uploadmidprojectform.component";
import { DeadlineContext } from "../../../context/deadline";
import { ProposalContext } from "../../../context/proposalcontext";

const UploadProposal = () => {
  const { currentUser } = useContext(UserContext);
  const {
    project,
    projectSubmittedForm,
    setProjectSubmittedFrom,
    projectRadiofilled,
    setProjectRadiofilled,
    selectedDefenseOption,
    setIsDefenseOptionSelected,
    isDefenseOptionSelected,
  } = useContext(ProjectContext);
  const { proposal } = useContext(ProposalContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [groupID, setGroupID] = useState("");
  const [showGroupCode, setShowGroupCode] = useState(false);
  const [projectError, setProjectError] = useState(false);
  const [codeEnter, setCodeEnter] = useState(false);
  const [code, setCode] = useState("");
  const [noGroup, setNoGroup] = useState(false);
  const [confirmation, setconfirmation] = useState(false);
  const [optionError, setOptionError] = useState(false);
  const { deadline } = useContext(DeadlineContext);
  const [latestFinalProjectDeadline, setLatestFinalProjectDeadline] =
    useState(null);
  const [latestMidProjectDeadline, setLatestMidProjectDeadline] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const handleBack = (event) => {
    event.preventDefault();
    setProjectRadiofilled(false);
    setIsDefenseOptionSelected(true);
    setSelectedOption("");
    setOptionError(false);
    setProjectError(false);
  };
  const [midDefenseGrade, setMidDefenseGrade] = useState(null);
  const [finalDefenseGrade, setFinalDefenseGrade] = useState(null);
  const [proposalData, setproposalData] = useState({});
  const [studentError, setStudentError] = useState(false);
  useEffect(() => {
    const proposalFind = proposal.find((item) =>
      item.createdBy.some((student) => student.id === currentUser.id)
    );
    setproposalData(proposalFind);
  }, [proposal]);
  useEffect(() => {
    const midDefenseGradeObj = project.find((item) => {
      const studentObj = item.Student.find(
        (student) =>
          currentUser.id === student.id &&
          student.grade !== null &&
          item.IsDefense === "Mid"
      );
      return studentObj !== undefined;
    });

    const finalDefenseGradeObj = project.find((item) => {
      const studentObj = item.Student.find(
        (student) =>
          currentUser.id === student.id &&
          student.grade !== null &&
          item.IsDefense === "Final"
      );
      return studentObj !== undefined;
    });

    setMidDefenseGrade(
      midDefenseGradeObj
        ? midDefenseGradeObj.Student.find(
            (student) => student.id === currentUser.id
          ).grade
        : null
    );
    setFinalDefenseGrade(
      finalDefenseGradeObj
        ? finalDefenseGradeObj.Student.find(
            (student) => student.id === currentUser.id
          ).grade
        : null
    );
  }, [project, currentUser.id]);

  const handleOptionChange = (event) => {
    setOptionError(false);

    setSelectedOption(event.target.value);
  };
  const handlechange = (event) => {
    setNoGroup(false);
    const value = event.target.value;
    setCode(value);
  };

  const generateGroupID = () => {
    const uniqueID = shortid.generate();
    return uniqueID;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    setNoGroup(false);
    setOptionError(false);

    if (selectedOption === "") {
      setOptionError(true);
    } else {
      setProjectError(false);
      try {
        let querySnapshot;

        if (selectedDefenseOption === "finalDefense") {
          const docRef = collection(db, "Project-data");
          querySnapshot = await getDocs(
            query(
              docRef,
              where("IsDefense", "==", "Final"),
              where("Student", "array-contains", {
                id: currentUser.id,
                grade: finalDefenseGrade,
              })
            )
          );
        } else if (selectedDefenseOption === "midDefense") {
          const docRef = collection(db, "Project-data");
          querySnapshot = await getDocs(
            query(
              docRef,
              where("IsDefense", "==", "Mid"),
              where("Student", "array-contains", {
                id: currentUser.id,
                grade: midDefenseGrade,
              })
            )
          );
        }
        if (!querySnapshot.empty) {
          setProjectError(true);
          return;
        } else if (querySnapshot.empty) {
          if (selectedOption === "individual") {
            setProjectSubmittedFrom(true);
            setProjectRadiofilled(false);
            setSelectedOption("");
            setGroupID("");
          } else if (selectedOption === "newGroup") {
            const generatedGroupID = generateGroupID();
            setShowGroupCode(true);
            setGroupID(generatedGroupID);
          } else if (selectedOption === "existingGroup") {
            setCodeEnter(true);
          }
        }
      } catch (error) {
        console.error("Error checking user in Proposals-data:", error);
      }
    }
  };

  const handleShowCode = () => {
    setShowGroupCode(false);
    setProjectSubmittedFrom(true);
    setProjectRadiofilled(false);
  };
  const handleMatchCode = async () => {
    const projectFind = project.find((item) => item.groupID === code);
    const proposalFind = proposal.find((items) =>
      items.createdBy.find((item) => item.id === currentUser.id)
    );
    const matchStudent = proposalFind.createdBy.some((item) =>
      projectFind.Student.some((items) => items.id === item.id)
    );

    if (matchStudent) {
      try {
        let querySnapshot;
        if (selectedDefenseOption === "finalDefense") {
          const docRef = collection(db, "Project-data");
          querySnapshot = await getDocs(
            query(
              docRef,
              where("groupID", "==", code),
              where("IsDefense", "==", "Final")
            )
          );
        } else if (selectedDefenseOption === "midDefense") {
          const docRef = collection(db, "Project-data");
          querySnapshot = await getDocs(
            query(
              docRef,
              where("groupID", "==", code),
              where("IsDefense", "==", "Mid")
            )
          );
        }
        if (!querySnapshot.empty && code !== "") {
          const doc = querySnapshot.docs[0];
          await updateDoc(doc.ref, {
            Student: arrayUnion({
              id: currentUser.id,
              grade: 0,
            }),
          });
          setProjectSubmittedFrom(false);
          setProjectRadiofilled(false);
          setCodeEnter(false);
          setconfirmation(true);
        } else {
          setNoGroup(true);
        }
      } catch (error) {
        console.error("Error matching code in Proposals-data:", error);
      }
    } else {
      setStudentError(true);
    }
  };
  const handleSuccessfull = () => {
    setProjectRadiofilled(true);
    setconfirmation(false);
  };
  const handleclose = () => {
    setCodeEnter(false);
    setShowGroupCode(false);
  };
  useEffect(() => {
    const collectionRef = collection(db, "Deadline-data");
    const unsubscribe = onSnapshot(
      query(collectionRef, where("type", "==", "Final Defense Deadline")),
      (querySnapshot) => {
        const updatedData = querySnapshot.docs.map((doc) => doc.data());
        const lastObject = updatedData[updatedData.length - 1];
        if (lastObject !== latestFinalProjectDeadline) {
          setLatestFinalProjectDeadline(lastObject);
          setLoading(false);
        }
      }
    );
    return () => unsubscribe();
  }, [deadline]);
  useEffect(() => {
    const collectionRef = collection(db, "Deadline-data");
    const unsubscribe = onSnapshot(
      query(collectionRef, where("type", "==", "Mid Defense Deadline")),
      (querySnapshot) => {
        const updatedData = querySnapshot.docs.map((doc) => doc.data());
        const lastObject = updatedData[updatedData.length - 1];
        if (lastObject !== latestMidProjectDeadline) {
          setLatestMidProjectDeadline(lastObject);
          setLoading(false);
        }
      }
    );
    return () => unsubscribe();
  }, [deadline]);
  const isValidFinalDeadline =
    latestFinalProjectDeadline &&
    new Date(latestFinalProjectDeadline.deadlinedate) >= new Date();
  const isValidMidDeadline =
    latestMidProjectDeadline &&
    new Date(latestMidProjectDeadline.deadlinedate) >= new Date();

  return (
    <div className="upload-proposal">
      {isDefenseOptionSelected && <DefenseOptionForm />}
      {projectRadiofilled &&
        !isDefenseOptionSelected &&
        (loading ? (
          <div className="proposals-form">
            <div className="submitted-proposal-wait">
              Loading <div className="spinner"></div>
            </div>
          </div>
        ) : (!isValidFinalDeadline &&
            selectedDefenseOption === "finalDefense") ||
          (!isValidMidDeadline && selectedDefenseOption === "midDefense") ? (
          <div className="proposals-form">
            <p className="no-form-to-show">
              The Form is Currently Unavailable{" "}
            </p>
          </div>
        ) : (
          <form
            className={`proposals-form ${
              isDefenseOptionSelected ? "" : "show-form"
            }`}
            onSubmit={handleSubmit}
          >
            <div className="proposals-form-container">
              <div className="proposals-form-head">
                <button className="back-the-form" onClick={handleBack}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                <h2 className="project-form-heading ">Project Submission</h2>
              </div>
              <div className="proposals-form-options">
                <p className="proposals-form-options-heading">
                  Choose an option
                </p>
                {proposalData.groupID === "" ? (
                  <div className="proposals-form-group-input">
                    <input
                      type="radio"
                      id="individual"
                      name="proposalOption"
                      value="individual"
                      checked={selectedOption === "individual"}
                      onChange={handleOptionChange}
                    />
                    <label
                      htmlFor="individual"
                      className="proposals-form-label"
                    >
                      Doing FYP on an individual basis
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="proposals-form-group-input">
                      <input
                        type="radio"
                        id="newGroup"
                        name="proposalOption"
                        value="newGroup"
                        checked={selectedOption === "newGroup"}
                        onChange={handleOptionChange}
                      />
                      <label
                        htmlFor="newGroup"
                        className="proposals-form-label"
                      >
                        Create a New Group for Project Upload
                      </label>
                    </div>
                    <div className="proposals-form-group-input">
                      <input
                        type="radio"
                        id="existingGroup"
                        name="proposalOption"
                        value="existingGroup"
                        checked={selectedOption === "existingGroup"}
                        onChange={handleOptionChange}
                      />
                      <label
                        htmlFor="existingGroup"
                        className="proposals-form-label"
                      >
                        {" "}
                        Join an Existing Project Group
                      </label>
                    </div>
                  </>
                )}
              </div>
              <div className="proposals-form-button-container">
                <button type="submit" className="proposals-form-button">
                  Proceed
                </button>
                {optionError && (
                  <span className="proposals-form-error">
                    Please select at least one option
                  </span>
                )}
                {projectError && (
                  <span className="proposals-form-error">
                    You have already submitted your Project
                  </span>
                )}{" "}
              </div>
            </div>
          </form>
        ))}
      {showGroupCode && (
        <div className="show-code">
          <div className="updated-table-row-close">
            <FontAwesomeIcon icon={faClose} onClick={handleclose} />
          </div>
          <div className="show-code-container">
            <p className="show-code-paragraph">Your Group Code</p>
            <h1 className="show-code-text">{groupID}</h1>
            <button onClick={handleShowCode} className="proposals-form-button">
              OK
            </button>
          </div>
        </div>
      )}
      {codeEnter && (
        <div className="show-code">
          <div className="updated-table-row-close">
            <FontAwesomeIcon icon={faClose} onClick={handleclose} />
          </div>
          <div className="show-code-container">
            <p className="show-code-paragraph">Enter Group Code</p>
            <input
              id="myTextArea"
              className="textarea-upload-proposal"
              type="text"
              name="title"
              onChange={handlechange}
              required
            />{" "}
            <button onClick={handleMatchCode} className="proposals-form-button">
              OK
            </button>
            {noGroup && (
              <span className="proposals-form-error">Invalid code</span>
            )}{" "}
            {studentError && (
              <span className="proposals-form-error">
                Enter your group code
              </span>
            )}
          </div>
        </div>
      )}
      {confirmation && (
        <div className="show-code">
          <div className="show-code-container">
            <p className="show-code-paragraph">
              Your are added in the group successfully
            </p>
            <button
              onClick={handleSuccessfull}
              className="proposals-form-button"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {projectSubmittedForm && selectedDefenseOption === "midDefense" && (
        <UploadMidProjectForm groupID={groupID} />
      )}
      {projectSubmittedForm && selectedDefenseOption === "finalDefense" && (
        <UploadFinalProjectForm groupID={groupID} />
      )}
    </div>
  );
};

export default UploadProposal;
