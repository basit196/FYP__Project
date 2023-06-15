import { useContext, useEffect, useState } from "react";
import "./uploadidea.styles.scss";
import { UpdateRequestpProjectData } from "../../../Data/updaterequesteprojectdata";
import { default as ReactSelect } from "react-select";
import { colourStyles } from "../../../component/filter component/filterstyle";
import { UserContext } from "../../../context/user";
import { IdeaContext } from "../../../context/ideascontext";
import {
  addDataInExistingColAndDoc,
  storage,
} from "../../../utiles/firebase/firebase.utiles";

const UploadIdea = () => {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentUser } = useContext(UserContext);
  const { idea } = useContext(IdeaContext);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadIdea, setUploadIdea] = useState({
    id: "",
    ImageUrl: "",
    abstract: "",
    field: "",
    isAdd: false,
    projectCategory: "",
    projectType: "",
    status: "unselected",
    student: [],
    uploadedBy: { id: currentUser.id },
    title: "",
  });
  console.log(uploadIdea);
  useEffect(() => {
    if (idea.length > 0) {
      const maxId = idea.reduce((max, currentproposal) => {
        const IdeaId = parseInt(currentproposal.id);
        return IdeaId > max ? IdeaId : max;
      }, 0);
      const idnumber = maxId + 1;
      setUploadIdea((prevFormData) => ({
        ...prevFormData,
        id: idnumber.toString(),
      }));
    } else {
      setUploadIdea((prevFormData) => ({
        ...prevFormData,
        id: "1",
      }));
    }
  }, [idea]);
  const handleuploadchange = (event) => {
    const { name } = event.target;
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;
    reader.onload = (event) => {
      setSelectedFile(file);
      setUploadIdea({ ...uploadIdea, [name]: fileName });
    };

    reader.readAsDataURL(file);
  };
  const handlefilter = (label, value) => {
    setUploadIdea({
      ...uploadIdea,
      [label]: value,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setUploadIdea({ ...uploadIdea, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !uploadIdea.title ||
      uploadIdea.projectCategory === null ||
      uploadIdea.projectType === null
    ) {
      console.log("Please fill in all the required fields.");
      return;
    }
    setIsLoading(true);
    try {
      let image = "";
      const uploadTask = storage
        .ref(`images/${selectedFile.name}`)
        .put(selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            image = url;
            addDataInExistingColAndDoc("Idea-data", {
              id: uploadIdea.id || "",
              field: uploadIdea.field || "",
              uploadedBy: uploadIdea.uploadedBy || {},
              ImageUrl: image || "",
              student: [] || [],
              title: uploadIdea.title || "",
              projectCategory: uploadIdea.projectCategory,
              projectType: uploadIdea.projectType,
              isAdd: uploadIdea.isAdd,
              status: uploadIdea.status,
              abstract: uploadIdea.abstract || "",
            }).then(() => {
              console.log("Proposal sent successfully!");
              setUploadIdea({
                title: "",
                supervisor: [],
                file: "",
                status: "Pending",
                supervisor: {},
                timestamp: "",
                title: "",
                count: 1,
              });
              setIsLoading(false);
            });
          });
        }
      );
    } catch (error) {
      setIsLoading(false);

      console.error("Error submitting proposal:", error);
    }
  };

  return (
    <form className="my-form" onSubmit={handleSubmit}>
      <div className="upload-idea">
        <div className="upload-idea-main-form">
          <div className="form-field">
            <h2 className="upload-heading">Upload Idea</h2>
          </div>
          <div className="form-field">
            <label htmlFor="title" className="label">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              className="upload-file"
              value={uploadIdea.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="abstract">Abstract:</label>
            <textarea
              id="abstract"
              className="upload-file"
              name="abstract"
              value={uploadIdea.abstract}
              onChange={handleChange}
              
              required
            />
          </div>
          <div className="image-field">
            <div className="form-field">
              <label htmlFor="image">Image:</label>
              <input
                type="file"
                id="image"
                value={image}
                onChange={handleuploadchange}
                accept="image/*"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="field">Field:</label>
              <input
                type="text"
                id="field"
                name="field"
                value={uploadIdea.field}
                onChange={handleChange}
                className="upload-file"
                required
              />
            </div>
          </div>
          <div className="project-fields">
            <div className="form-field">
              <label htmlFor="projectCategory">Project Category:</label>
              <ReactSelect
                isSearchable
                onChange={(selectedOption) =>
                  handlefilter(
                    UpdateRequestpProjectData[0].label,
                    selectedOption.value
                  )
                }
                options={UpdateRequestpProjectData[0].children}
                className="select-drop-down"
                placeholder="Project Category"
                styles={colourStyles}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="projectType">Project Type:</label>
              <ReactSelect
                isSearchable
                onChange={(selectedOption) =>
                  handlefilter(
                    UpdateRequestpProjectData[2].label,
                    selectedOption.value
                  )
                }
                options={UpdateRequestpProjectData[2].children}
                className="select-drop-down"
                placeholder="Project Type"
                styles={colourStyles}
                required
              />
            </div>
          </div>{" "}
        </div>

        <button type="submit">{isLoading ? "Loading....." : "Submit"}</button>
      </div>
    </form>
  );
};

export default UploadIdea;
