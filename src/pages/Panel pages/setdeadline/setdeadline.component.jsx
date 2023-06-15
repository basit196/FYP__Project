import "./setdeadline.component.styles.scss";
import "react-nested-dropdown/dist/styles.css";

import { default as ReactSelect } from "react-select";

import React, { useContext, useEffect, useState } from "react";
import { DefenseDealine } from "../../../Data/DefenseDeadlineData";
import { colourStyles } from "../../../component/filter component/filterstyle";
import { DeadlineContext } from "../../../context/deadline";
import { addDataInExistingColAndDoc } from "../../../utiles/firebase/firebase.utiles";
const SetDeadLine = () => {
  const { deadline } = useContext(DeadlineContext);
  const [deadlinedata, setDeadlinedata] = useState({
    id: "",
    deadlinedate: "",
    description: "",
    timestamp: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [dateError, setDateError] = useState(false);
  const [FieldError, setFieldError] = useState(false);
  console.log(deadlinedata);
  useEffect(() => {
    const maxId = deadline.reduce((max, currentdeadline) => {
      const deadlineId = parseInt(currentdeadline.id);
      return deadlineId > max ? deadlineId : max;
    }, 0);
    const idnumber = maxId + 1;
    setDeadlinedata((prevFormData) => ({
      ...prevFormData,
      id: idnumber.toString(),
    }));
  }, [deadline]);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDeadlinedata({ ...deadlinedata, [name]: value });
    setDateError(false);
    setFieldError(false);
  };
  const handleOptionChange = (value, name) => {
    setDeadlinedata({ ...deadlinedata, [name]: value });
    setDateError(false);
    setFieldError(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      deadlinedata.description === "" ||
      deadlinedata.type === "" ||
      deadlinedata.deadlinedate === ""
    ) {
      setFieldError(true);
    } else if (formattedDate >= deadlinedata.deadlinedate) {
      setDateError(true);
    } else {
      setIsLoading(true);
      await addDataInExistingColAndDoc("Deadline-data", {
        id: deadlinedata.id,
        timestamp: formattedDate || "",
        description: deadlinedata.description || "",
        type: deadlinedata.type || "",
        deadlinedate: deadlinedata.deadlinedate || "",
      });
      setIsLoading(false);

      setDeadlinedata({
        id: "",
        timestamp: "",
        description: "",
        type: "",
        deadlinedate: "",
      });
    }
  };

  return (
    <div className="set-deadline">
      <form className="set-deadline-form" onSubmit={handleSubmit}>
        <h2 className="set-deadline-form__title">Set Deadline</h2>
        <div className="set-deadline-form__input-group">
          <label htmlFor="description" className="set-deadline-form__label">
            Description:
          </label>
          <input
            type="text"
            id="description"
            value={deadlinedata.description}
            name="description"
            onChange={handleChange}
            className="set-deadline-form__input"
          />
        </div>
        <div className="set-deadline-form__input-group">
          <label htmlFor="deadline" className="set-deadline-form__label">
            Deadline:
          </label>
          <input
            type="date"
            id="deadline"
            value={deadlinedata.deadlinedate}
            name="deadlinedate"
            onChange={handleChange}
            className="set-deadline-form__input"
          />
          {dateError && (
            <p className="set-deadline-form__dateerror">
              Select one day after date
            </p>
          )}
        </div>
        <div className="set-deadline-form__input-group">
          <label htmlFor="type" className="set-deadline-form__label">
            Deadline:
          </label>
          <ReactSelect
            isSearchable
            options={DefenseDealine[0].children}
            onChange={(selectedOption) =>
              handleOptionChange(selectedOption.label, selectedOption.value)
            }
            className="select-drop-down"
            placeholder={DefenseDealine[0].label}
            styles={colourStyles}
          />{" "}
        </div>
        {FieldError && (
          <p className="set-deadline-form__dateerror">Fill all fields</p>
        )}
        <button
          type="submit"
          className="set-deadline-form__button"
          value={isLoading ? "Loading..." : "Submit"}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Set Deadline"}
        </button>
      </form>{" "}
    </div>
  );
};

export default SetDeadLine;
