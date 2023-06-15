import "./updaterequestproject.styles.scss";
import { default as ReactSelect } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { UserContext } from "../../../../context/user";
import {
  storage,
  updateData,
} from "../../../../utiles/firebase/firebase.utiles";
import { UpdateRequestpProjectData } from "../../../../Data/updaterequesteprojectdata";
import { colourStyles } from "../../../../component/filter component/filterstyle";
import { pdf } from "../../../../utiles/mimeTypes/mimeTypes";
const UpdateRequestpProject = ({ item, text }) => {
  const { user, setClickEdit } = useContext(UserContext);
  const [inputdata, setInputData] = useState(item);
  const [videoselectedFile, setvideoSelectedFile] = useState(null);
  const [reportselectedFile, setreportSelectedFile] = useState(null);
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "grade") {
      setInputData({
        ...inputdata,
        [name]: parseInt(value, 10),
      });
    } else {
      setInputData({
        ...inputdata,
        [name]: value,
      });
    }
  };
  const handleStudentChange = (event, studentId) => {
    const { name, value } = event.target;

    let updatedValue = parseInt(value, 10);

    if (name === "grade") {
      // Prevent entering values higher than 100
      updatedValue = Math.min(updatedValue, 100);
    }

    setInputData((prevInputData) => {
      const updatedStudent = prevInputData.Student.map((student) => {
        if (student.id === studentId) {
          return { ...student, grade: updatedValue };
        }
        return student;
      });

      return { ...prevInputData, Student: updatedStudent };
    });
  };

  const supervisor = user.filter((item) => item.role === "Supervisor");
  const supervisorOptions = supervisor.map((item) => ({
    value: item.id,
    label: item.Name,
  }));

  const handleOptionChange = (name, value) => {
    setInputData({ ...inputdata, [name]: value });
  };
  const handleOptionSupervisorChange = (value) => {
    setInputData({
      ...inputdata,
      supervisor: { id: value },
    });
  };
  const handleuploadchange = (event) => {
    const { name } = event.target;
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;

    if (file.type === pdf) {
      // Handle PDF file
      reader.onload = (event) => {
        setreportSelectedFile(file);
        setInputData({ ...inputdata, [name]: fileName });
      };

      reader.readAsDataURL(file);
    } else {
      reader.onload = (event) => {
        setvideoSelectedFile(file);
        setInputData({ ...inputdata, [name]: fileName });
      };

      reader.readAsDataURL(file);
    }
  };

  //when the data is ready to sumbit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let video = inputdata.video;
      let report = inputdata.report;

      if (videoselectedFile) {
        const uploadTask = storage
          .ref(`videos/${videoselectedFile.name}`)
          .put(videoselectedFile);
        await uploadTask;

        const videoUrl = await uploadTask.snapshot.ref.getDownloadURL();
        video = videoUrl;
      }

      if (reportselectedFile) {
        const reportUploadTask = storage
          .ref(`reports/${reportselectedFile.name}`)
          .put(reportselectedFile);
        await reportUploadTask;

        const reportUrl = await reportUploadTask.snapshot.ref.getDownloadURL();
        report = reportUrl;
      }

      updateData("Project-data", {
        id: inputdata.id,
        date: inputdata.date || "",
        projectCategory: inputdata.projectCategory || "",
        projectType: inputdata.projectType || "",
        department: inputdata.department || "",
        report: report || "",
        web: inputdata.web || "",
        video: video ? video : "",
        status: inputdata.status || "",
        remarks: inputdata.remarks || "",
        supervisor: inputdata.supervisor || "",
        title: inputdata.title || "",
        Student: inputdata.Student || "",
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
  const matchedStudents = inputdata.Student.reduce((matchedArr, student) => {
    const matchedUser = user.find((users) => users.id === student.id);

    if (matchedUser) {
      const matchedStudent = { ...matchedUser, grade: student.grade };

      matchedArr.push(matchedStudent);
    }

    return matchedArr;
  }, []);

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
            <div className="group-of-student">
              <h3 className="group-of-student-heading">
                Total No Of Students: {inputdata.Student.length}
              </h3>
              {matchedStudents.map((student, index) => (
                <div className="student-group-input-container">
                  <label htmlFor={student.id} className="student-group-member">
                    {index + 1}: {student.Name}
                  </label>
                  <input
                    id={student.id}
                    key={student.id}
                    type="number"
                    name="grade"
                    value={
                      inputdata.Student.find((item) => item.id === student.id)
                        .grade
                    }
                    className="register-user-input"
                    onChange={(event) => handleStudentChange(event, student.id)}
                    min={0}
                    max={100}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="project-table-form-input">
            <div className="input-container-form">
              <label htmlFor="Remarks" className="project-table-form-label">
                Remarks
              </label>
              <input
                id="Remarks"
                type="text"
                name="remarks"
                value={inputdata.remarks}
                placeholder="Remarks"
                className="register-user-input"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container-form">
              <label htmlFor="Status" className="project-table-form-label">
                Status
              </label>
              <input
                id="Status"
                type="text"
                name="status"
                value={inputdata.status}
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
              <ReactSelect
                isSearchable
                onChange={(selectedOption) =>
                  handleOptionSupervisorChange(selectedOption.value)
                }
                options={supervisorOptions}
                className="select-drop-down"
                placeholder={item.supervisor.name}
                styles={colourStyles}
              />
            </div>
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
              <label htmlFor="date" className="project-table-form-label">
                Date{" "}
              </label>

              <input
                id="date"
                type="date"
                name="date"
                value={inputdata.date}
                placeholder="Name"
                className="register-user-input"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="project-table-form-input">
            <div className="input-container-form">
              <label
                htmlFor="projectCategory"
                className="project-table-form-label"
              >
                Project Category
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
                Department{" "}
              </label>

              <ReactSelect
                id="department"
                isSearchable
                onChange={(selectedOption) => {
                  handleOptionChange(
                    UpdateRequestpProjectData[1].label,
                    selectedOption.label
                  );
                }}
                options={UpdateRequestpProjectData[1].children}
                className="select-drop-down project-form-dropdown"
                placeholder={item.department}
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
            <div className="input-container-form">
              <label htmlFor="web" className="project-table-form-label">
                Git Hub/web link{" "}
              </label>
              <input
                id="web"
                type="text"
                name="web"
                value={inputdata.web}
                placeholder="Web url"
                className="register-user-input"
                onChange={handleChange}
              />{" "}
            </div>
            <div className="report-container">
              <input
                id="report"
                type="file"
                name="report"
                accept="application/pdf"
                onChange={handleuploadchange}
              />
              <label htmlFor="report" className="report-project-form">
                File accepted : *pdf
              </label>{" "}
            </div>
            <div className="report-container">
              <input
                id="video"
                name="video"
                type="file"
                accept="video/*"
                onChange={handleuploadchange}
              />{" "}
              <label htmlFor="video" className="report-project-form">
                File accepted : *mp3,*mp4
              </label>{" "}
            </div>
            <button type="submit" className="project-table-form-button">
              Update
            </button>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateRequestpProject;
