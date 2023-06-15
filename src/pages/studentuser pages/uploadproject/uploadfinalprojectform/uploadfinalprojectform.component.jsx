import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/user";
import {
  addDataInExistingColAndDoc,
  storage,
} from "../../../../utiles/firebase/firebase.utiles";
import "./uploadfinalproject.styles.scss";
import { ProjectContext } from "../../../../context/projectcontext";
import { ProposalContext } from "../../../../context/proposalcontext";
const UploadFinalProjectForm = ({ groupID }) => {
  const {
    project,
    setProjectSubmittedFrom,
    setIsDefenseOptionSelected,
    setProjectRadiofilled,
    setSelectedDefenseOption,
  } = useContext(ProjectContext);
  const { user, currentUser } = useContext(UserContext);
  const { proposal } = useContext(ProposalContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedPresentationFile, setPresentationFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [projectdata, setProjectdata] = useState({
    IsDefense: "Final",
    Student: [],
    report: "",
    Presentation: "",
    status: "Pending",
    date: "",
    department: "",
    groupID: groupID,
    projectCategory: "",
    projectType: "",
    remarks: "Pending",
    video: "",
    web: "",
    title: "",
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
  const handlechange = (event) => {
    const { name, value } = event.target;
    setProjectdata({ ...projectdata, [name]: value });
  };
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
    } else if (file.type.startsWith("video/")) {
      setSelectedVideoFile(file);
      setProjectdata({ ...projectdata, [name]: fileName });
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
    const userFind = project.find((item) => {
      return (
        item.IsDefense === "Mid" &&
        item.Student.some((student) => student.id === currentUser.id)
      );
    });
    const count = userFind.count;
    const supervisor = userFind.supervisor;
    const projectCategory = userFind.projectCategory;
    const projectType = userFind.projectType;
    const title = userFind.title;
    console.log(userFind);

    if (!projectdata.report) {
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
    if (userFind) {
      try {
        let video = projectdata.video;
        let report = projectdata.report;
        let presentation = projectdata.Presentation;

        if (selectedVideoFile) {
          const uploadTask = storage
            .ref(`videos/${selectedVideoFile.name}`)
            .put(selectedVideoFile);
          await uploadTask;
          const videoUrl = await uploadTask.snapshot.ref.getDownloadURL();
          video = videoUrl;
        }

        if (selectedFile) {
          const reportUploadTask = storage
            .ref(`reports/${selectedFile.name}`)
            .put(selectedFile);
          await reportUploadTask;

          const reportUrl =
            await reportUploadTask.snapshot.ref.getDownloadURL();
          report = reportUrl;
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
          date: formattedDate || "",
          projectCategory: projectCategory || "",
          projectType: projectType || "",
          department: currentUser.department || "",
          report: report || "",
          web: projectdata.web || "",
          video: video ? video : "",
          status: projectdata.status || "",
          remarks: projectdata.remarks || "",
          supervisor: supervisor || "",
          title: title || "",
          Student: selectedStudent || "",
          groupID: projectdata.groupID || "",
          count: count,
          presentation: presentation ? presentation : "",
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
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <div className="project-scroll">
        <div className="form-groups">
          <h2 className="project-form-heading">Upload Final Project</h2>
          <div className="form-group">
            <div>
              <label htmlFor="weblink" className="form-group-label">
                Paste Github/Web Link (optional)
              </label>
              <input
                id="weblink"
                className="textarea-upload-project"
                type="text"
                name="web"
                value={projectdata.web}
                onChange={handlechange}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="form-group-items">
              <div className="form-group-filtering">
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
                <div className="form-group-file">
                  <label htmlFor="report" className="form-group-label">
                    Upload Thesis
                  </label>
                  <input
                    type="file"
                    id="report"
                    name="report"
                    accept="application/pdf"
                    onChange={handleuploadchange}
                    required
                  />
                </div>
                <div className="form-group-file">
                  <label htmlFor="videofile" className="form-group-label">
                    Upload Video (optional)
                  </label>
                  <input
                    type="file"
                    id="videofile"
                    name="video"
                    accept="video/*"
                    onChange={handleuploadchange}
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
export default UploadFinalProjectForm;
