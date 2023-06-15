import React, { useContext, useEffect, useState } from "react";
import "./defenseoption.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { ProjectContext } from "../../../../context/projectcontext";
import { ProposalContext } from "../../../../context/proposalcontext";
import { UserContext } from "../../../../context/user";

const DefenseOptionForm = () => {
  const {
    project,
    selectedDefenseOption,
    setSelectedDefenseOption,
    setIsDefenseOptionSelected,
    setProjectRadiofilled,
  } = useContext(ProjectContext);
  const { proposal } = useContext(ProposalContext);
  const { currentUser } = useContext(UserContext);
  const [optionError, setOptionError] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [proposalError, setProposalError] = useState(false);
  const [proposalFind, setProposalFind] = useState(false);
  const [midProjectError, setmidProjectError] = useState(false);
  const [midSubmitError, setmidSumbitError] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedDefenseOption(event.target.value);
    setOptionError(false);
    setmidProjectError(false);
  };
  useEffect(() => {
    if (
      proposal.length > 0 &&
      proposal.some(
        (item) =>
          item.createdBy.some((student) => student.id === currentUser.id) &&
          item.status === "Approved"
      )
    ) {
      setProposalFind(true);
    } else {
      setProposalFind(false);
    }
  }, [proposal, currentUser]);
  const userFind = project.find((item) => {
    return (
      item.IsDefense === "Mid" &&
      item.Student.some((student) => student.id === currentUser.id)
    );
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setmidProjectError(false);

    if (selectedDefenseOption === "") {
      setOptionError(true);
    } else {
      if (proposalFind) {
        if (userFind) {
          if (selectedDefenseOption === "midDefense") {
            setmidProjectError(true);
          } else if (
            (userFind &&
              selectedDefenseOption === "finalDefense" &&
              userFind.remarks === "unsatisfactory") ||
            userFind.remarks === "Pending"
          ) {
            setmidProjectError(true);
          }
        } else {
          if (selectedDefenseOption === "finalDefense") {
            setmidSumbitError(true);
          } else {
            setIsFormVisible(false);
            setProjectRadiofilled(true);
            setTimeout(() => {
              setIsDefenseOptionSelected(false);
            }, 1);
          }
        }
      } else {
        setProposalError(true);
      }
    }
  };
  return (
    <div className={`defense-option-form ${isFormVisible ? "" : "hide-form"}`}>
      <h2 className="defense-option-form-heading">Select Defense Option</h2>
      <form onSubmit={handleSubmit} className="defense-option-form-container">
        <div className="defense-option-form-options">
          <div className="defense-option-form-option">
            <input
              type="radio"
              id="midDefense"
              name="defenseOption"
              value="midDefense"
              checked={selectedDefenseOption === "midDefense"}
              onChange={handleOptionChange}
            />
            <label htmlFor="midDefense">Mid Defense</label>
          </div>
          <div className="defense-option-form-option">
            <input
              type="radio"
              id="finalDefense"
              name="defenseOption"
              value="finalDefense"
              checked={selectedDefenseOption === "finalDefense"}
              onChange={handleOptionChange}
            />
            <label htmlFor="finalDefense">Final Defense</label>
          </div>{" "}
        </div>
        <div className="defense-option-form-button-container">
          <button type="submit" className="defense-option-form-button">
            Next{" "}
            <FontAwesomeIcon
              icon={faArrowRightLong}
              className="defense-option-form-button-icon"
            />
          </button>
          {optionError && (
            <span className="proposals-form-error">
              Please select at least one option
            </span>
          )}{" "}
          {proposalError && (
            <span className="proposals-form-error">
              Please Submit Your Proposal First{" "}
            </span>
          )}{" "}
          {midProjectError && (
            <span className="proposals-form-error">
              Check Your mid Project Status{" "}
            </span>
          )}{" "}
          {midSubmitError && (
            <span className="proposals-form-error">
              Submit your mid project{" "}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default DefenseOptionForm;
