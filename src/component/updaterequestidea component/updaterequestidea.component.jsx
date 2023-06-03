import "./updaterequest.styles.scss";
import { default as ReactSelect } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { UserContext } from "../../context/user";
import { storage, updateData } from "../../utiles/firebase/firebase.utiles";
import { UpdateRequestpProjectData } from "../../Data/updaterequesteprojectdata";
import { colourStyles } from "../filter component/filterstyle";
const UpdateRequestpIdea = ({ item, text }) => {
  const { setClickEdit } = useContext(UserContext);
  const [inputdata, setInputData] = useState(item);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputData({ ...inputdata, [name]: value });
  };

  const handleOptionChange = (name, value) => {
    setInputData({ ...inputdata, [name]: value });
  };
  const handleuploadchange = (event) => {
    const { name } = event.target;
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;
    // Handle video file
    reader.onload = (event) => {
      setSelectedFile(file);
      setInputData({ ...inputdata, [name]: fileName });
    };

    reader.readAsDataURL(file);
  };

  //when the data is ready to sumbit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let image = inputdata.ImageUrl;

      if (selectedFile) {
        const uploadTask = storage
          .ref(`images/${selectedFile.name}`)
          .put(selectedFile);
        await uploadTask;

        const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
        image = imageUrl;
      }

      updateData("Idea-data", {
        id: inputdata.id,
        projectCategory: inputdata.projectCategory || "",
        projectType: inputdata.projectType || "",
        ImageUrl: image || "",
        supervisor: inputdata.supervisor || "",
        title: inputdata.title || "",
        field: inputdata.field || "",
        abstract: inputdata.abstract || "",
        status: inputdata.status || "",
      });

      console.log("change successfully!");
      setInputData(inputdata);
      setClickEdit(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const closeEdit = () => {
    setClickEdit(false);
  };

  return (
    <div className="updated-table-row">
      <div className="updated-table-row-close">
        <FontAwesomeIcon icon={faClose} onClick={closeEdit} />
      </div>
      <div className="updated-project-table-row-container">
        <div className="updated-table-row-container-head">
          <span className="updated-table-row-container-head-item">
            <span className="updated-table-row-container-bold">Id:</span>
            <span>{inputdata.id}</span>
          </span>
          <span className="updated-table-row-container-head-item">
            <span className="updated-table-row-container-bold">
              Collection:
            </span>
            <span>{text}</span>
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="updated-project-table-row-form"
        >
          <div className="project-table-form-input">
            <div className="input-container-form">
              <label htmlFor="field" className="project-table-form-label">
                Field
              </label>
              <input
                id="field"
                type="text"
                name="field"
                value={inputdata.field}
                placeholder="Field"
                className="register-user-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container-form">
              <label htmlFor="abstract" className="project-table-form-label">
                Abstract
              </label>
              <input
                id="abstract"
                type="text"
                name="abstract"
                value={inputdata.abstract}
                placeholder="Remarks"
                className="register-user-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container-form">
              <label htmlFor="supervisor" className="project-table-form-label">
                Supervisor{" "}
              </label>
              <input
                id="supervisor"
                type="text"
                name="supervisor"
                value={inputdata.supervisor}
                placeholder="Supervisor"
                className="register-user-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="report-container">
              <input
                id="report"
                type="file"
                name="report"
                accept="image/*"
                onChange={handleuploadchange}
              />
              <label htmlFor="report" className="report-project-form">
                File accepted : *png,jpeg,jpg
              </label>{" "}
            </div>
          </div>
          <div className="project-table-form-input">
            <div className="input-container-form">
              <label htmlFor="title" className="project-table-form-label">
                Title{" "}
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={inputdata.title}
                placeholder="Title"
                className="register-user-input"
                onChange={handleChange}
                required
              />{" "}
            </div>
            <div className="input-container-form">
              <label
                htmlFor="projectCategory"
                className="project-table-form-label"
              >
                Project Category{" "}
              </label>

              <ReactSelect
                id="projectCategory"
                isSearchable
                onChange={(selectedOption) => {
                  handleOptionChange(
                    UpdateRequestpProjectData[0].label,
                    selectedOption.label
                  );
                }}
                options={UpdateRequestpProjectData[0].children}
                className="select-drop-down project-form-dropdown"
                placeholder={item.projectCategory}
                styles={colourStyles}
              />
            </div>
            <div className="input-container-form">
              <label htmlFor="department" className="project-table-form-label">
                Project type{" "}
              </label>
              <ReactSelect
                isSearchable
                onChange={(selectedOption) => {
                  handleOptionChange(
                    UpdateRequestpProjectData[2].label,
                    selectedOption.label
                  );
                }}
                options={UpdateRequestpProjectData[2].children}
                className="select-drop-down project-form-dropdown"
                placeholder={item.projectType}
                styles={colourStyles}
              />{" "}
            </div>
            <div className="input-container-form"></div>
            <button type="submit" className="project-table-form-button">
              Update
            </button>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateRequestpIdea;
