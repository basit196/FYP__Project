import "./uploadproposal.styles.scss";
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
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { DeadlineContext } from "../../../context/deadline";
import UploadProposalForm from "./uploadproposalform/uploadproposalform.component";
import { ProposalContext } from "../../../context/proposalcontext";

const UploadProposal = () => {
  const { currentUser } = useContext(UserContext);
  const { deadline } = useContext(DeadlineContext);
  const {
    proposal,
    proposalSubmitted,
    setProposalSubmitted,
    proposalfilled,
    setProposalfilled,
  } = useContext(ProposalContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [groupID, setGroupID] = useState("");
  const [showGroupCode, setShowGroupCode] = useState(false);
  const [proposalError, setProposalError] = useState(false);
  const [codeEnter, setCodeEnter] = useState(false);
  const [code, setCode] = useState("");
  const [noGroup, setNoGroup] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [optionError, setOptionError] = useState(false);
  const [latestProposalDeadline, setLatestProposalDeadline] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setProposalError(false);
      try {
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
          setProposalError(true);
        } else {
          if (selectedOption === "individual") {
            setProposalSubmitted(true);
            setProposalfilled(false);
            setGroupID(false);
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
    setProposalSubmitted(true);
    setProposalfilled(false);
  };
  const handleMatchCode = async () => {
    const Islimitfull = proposal.find((item) => item.groupID === code);
    try {
      const docRef = collection(db, "Proposals-data");
      const querySnapshot = await getDocs(
        query(docRef, where("groupID", "==", code)),
        where("toAddGroupMember", "==", true)
      );

      if (
        !querySnapshot.empty &&
        code !== "" &&
        Islimitfull.createdBy.length !== Islimitfull.count
      ) {
        const doc = querySnapshot.docs[0];
        await updateDoc(doc.ref, {
          createdBy: arrayUnion({
            id: currentUser.id,
          }),
        });
        setProposalSubmitted(false);
        setProposalfilled(false);
        setCodeEnter(false);
        setConfirmation(true);
      } else {
        setNoGroup(true);
      }
    } catch (error) {
      console.error("Error matching code in Proposals-data:", error);
    }
  };

  const handleSuccessfull = () => {
    setProposalfilled(true);
    setConfirmation(false);
    setConfirmation(false);
  };

  const handleclose = () => {
    setCodeEnter(false);
    setShowGroupCode(false);
  };
  useEffect(() => {
    const collectionRef = collection(db, "Deadline-data");
    const unsubscribe = onSnapshot(
      query(collectionRef, where("type", "==", "Proposal Deadline")),
      (querySnapshot) => {
        const updatedData = querySnapshot.docs.map((doc) => doc.data());
        const lastObject = updatedData[updatedData.length - 1];
        if (lastObject !== latestProposalDeadline) {
          setLatestProposalDeadline(lastObject);
          setLoading(false);
        }
      }
    );
    return () => unsubscribe();
  }, [deadline]);

  const isValidProposalDeadline =
    latestProposalDeadline &&
    new Date(latestProposalDeadline.deadlinedate) >= new Date();
  return (
    <div className="upload-proposal">
      {loading ? (
        <div className="proposals-form">
          <div className="submitted-proposal-wait">
            Loading <div className="spinner"></div>
          </div>
        </div>
      ) : !isValidProposalDeadline ? (
        <div className="proposals-form">
          <p className="no-form-to-show">The Form is Currently Unavailable </p>
        </div>
      ) : (
        proposalfilled && (
          <form className="proposals-form" onSubmit={handleSubmit}>
            <div className="proposals-form-container ">
              <h2 className="proposals-form-heading">Proposal Submission</h2>
              <div className="proposals-form-options">
                <p className="proposals-form-options-heading">
                  Choose an option
                </p>
                <div className="proposals-form-group-input">
                  <input
                    type="radio"
                    id="individual"
                    name="proposalOption"
                    value="individual"
                    checked={selectedOption === "individual"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="individual" className="proposals-form-label">
                    Doing FYP on an individual basis
                  </label>
                </div>
                <div className="proposals-form-group-input">
                  <input
                    type="radio"
                    id="newGroup"
                    name="proposalOption"
                    value="newGroup"
                    checked={selectedOption === "newGroup"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="newGroup" className="proposals-form-label">
                    Create a New Group for Proposal Upload
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
                    Join an Existing Proposal Group
                  </label>
                </div>
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
                {proposalError && (
                  <span className="proposals-form-error">
                    You have already submitted your proposal
                  </span>
                )}{" "}
              </div>
            </div>
          </form>
        )
      )}
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
              <span className="proposals-form-error">
                There is no such GroupID. Try again
              </span>
            )}
          </div>
        </div>
      )}{" "}
      {confirmation && (
        <div className="show-code">
          <div className="show-code-container">
            <p className="show-code-paragraph">
              You are added to the group successfully
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
      {proposalSubmitted && (
        <UploadProposalForm groupID={groupID} option={selectedOption} />
      )}
    </div>
  );
};

export default UploadProposal;
