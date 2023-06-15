import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/user";
import {
  addDataInExistingColAndDoc,
  storage,
} from "../../../../utiles/firebase/firebase.utiles";
import "./uploadmidprojectform.style.scss";
import { ProjectContext } from "../../../../context/projectcontext";
import { ProposalContext } from "../../../../context/proposalcontext";
const UploadMidProjectForm = ({ groupID }) => {
  const {
    project,
    setProjectSubmittedFrom,
    setIsDefenseOptionSelected,
    setProjectRadiofilled,
    setSelectedDefenseOption,
  } = useContext(ProjectContext);
  const { proposal } = useContext(ProposalContext);
  const { user, currentUser } = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPresentationFile, setPresentationFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userFind = proposal.find((item) =>
    item.createdBy.some((student) => student.id === currentUser.id)
  );
  const count = userFind.count;
  const supervisor = userFind.supervisor;
  const projectCategory = userFind.projectCategory;
  const projectType = userFind.projectType;
  const title = userFind.title;
  const [projectdata, setProjectdata] = useState({
    IsDefense: "Mid",
    comments: "",
    Student: [],
    document: "",
    Presentation: "",
    status: "Pending",
    date: "",
    department: "",
    groupID: groupID,
    remarks: "Pending",
  });

  useEffect(() => {
    const maxId = project.reduce((max, currentproject) => {
      const projectId = parseInt(currentproject.id);
      return projectId > max ? projectId : max;
    }, 0);
    const idnumber = maxId + 1;
    setProjectdata((prevFormData) => ({
      ...prevFormData,
      id: idnumber.toString(),
    }));
  }, [project]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const handleuploadchange = (event) => {
    const { name } = event.target;
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;

    if (file.type === "application/pdf") {
      reader.onload = () => {
        setSelectedFile(file);
        setProjectdata({ ...projectdata, [name]: fileName });
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
          setProjectdata({ ...projectdata, [name]: fileName });
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !projectdata.document
    ) {
      console.log("Please fill in all the required fields.");
      return;
    }
    setIsLoading(true);
    const selectedStudent = [
      {
        id: currentUser.id,
        grade: 0,
      },
    ];
    try {
      let document = projectdata.document;
      let presentation = projectdata.Presentation;
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
      addDataInExistingColAndDoc("Project-data", {
        id: projectdata.id,
        IsDefense: projectdata.IsDefense || "",
        comments: projectdata.comments || "",
        date: formattedDate || "",
        projectCategory: projectCategory || "",
        projectType: projectType || "",
        department: currentUser.department || "",
        document: document ? document : "",
        status: projectdata.status || "",
        remarks: projectdata.remarks || "",
        supervisor: supervisor || "",
        title: title || "",
        Student: selectedStudent || "",
        groupID: projectdata.groupID || "",
        presentation: presentation ? presentation : "",
        count: count,
      });

      console.log("change successfully!");
      setProjectdata(projectdata);
      setProjectSubmittedFrom(false);
      setProjectRadiofilled(false);
      setIsDefenseOptionSelected(true);
      setSelectedDefenseOption("");
    } catch (error) {
      console.error("Error submitting proposal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <div className="project-scroll">
        <div className="form-groups">
          <h2 className="project-form-heading">Upload Mid Project</h2>
          <div className="form-group">
            <div className="form-group-items">
              <div className="form-group-filtering">
                <div className="form-group-file">
                  <label htmlFor="file" className="form-group-label">
                    Upload document file
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="document"
                    accept="application/pdf"
                    onChange={handleuploadchange}
                    required
                  />{" "}
                </div>
                <div className="form-group-file">
                  <label htmlFor="presentation" className="form-group-label">
                    Upload Presentation
                  </label>
                  <input
                    type="file"
                    id="presentation"
                    name="Presentation"
                    accept="application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={handleuploadchange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          className="proposal-form-button"
          type="submit"
          value={isLoading ? "Loading..." : "Submit"}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};
export default UploadMidProjectForm;
