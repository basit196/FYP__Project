import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/user";
import { ProposalContext } from "../../../../context/proposalcontext";
import {
  addDataInExistingColAndDoc,
  storage,
} from "../../../../utiles/firebase/firebase.utiles";
import { default as ReactSelect } from "react-select";
import { colourStyles } from "../../../../component/filter component/filterstyle";
import "./uploadproposalform.style.scss";
import { UpdateRequestpProjectData } from "../../../../Data/updaterequesteprojectdata";

const UploadProposalForm = ({ groupID, option }) => {
  const { user, currentUser } = useContext(UserContext);
  const [supervisors, setSupervisor] = useState([]);
  const { proposal, setProposalSubmitted, setProposalfilled } =
    useContext(ProposalContext);
  const [proposaldata, setProposaldata] = useState({
    id: "",
    comment: [],
    createdBy: [],
    file: "",
    status: "Pending",
    supervisor: {},
    timestamp: "",
    title: "",
    count: option === "individual" ? 1 : 2,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user.length > 0) {
      const supervisor = user.filter((item) => item.role === "Supervisor");
      const supervisorOptions = supervisor.map((item) => ({
        value: item.id,
        label: item.Name,
      }));
      setSupervisor(supervisorOptions);
    }
  }, [user]);
  useEffect(() => {
    if (proposal.length > 0) {
      const maxId = proposal.reduce((max, currentproposal) => {
        const proposalId = parseInt(currentproposal.id);
        return proposalId > max ? proposalId : max;
      }, 0);
      const idnumber = maxId + 1;
      setProposaldata((prevFormData) => ({
        ...prevFormData,
        id: idnumber.toString(),
      }));
    } else {
      setProposaldata((prevFormData) => ({
        ...prevFormData,
        id: "1",
      }));
    }
  }, [proposal]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const handlechange = (event) => {
    const { name, value } = event.target;
    if (name === "count") {
      let inputValue = parseInt(value);
      inputValue = Math.min(Math.max(inputValue, 2), 5);
      setProposaldata({ ...proposaldata, [name]: inputValue });
    } else {
      setProposaldata({ ...proposaldata, [name]: value });
    }
  };
  const handleOptionChange = (label, value) => {
    setProposaldata({
      ...proposaldata,
      supervisor: { id: value },
    });
  };
  const handlefilter = (label, value) => {
    setProposaldata({
      ...proposaldata,
      [label]: value,
    });
  };

  const handleuploadchange = (event) => {
    const { name } = event.target;
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;
    reader.onload = (event) => {
      setSelectedFile(file);
      setProposaldata({ ...proposaldata, [name]: fileName });
    };

    reader.readAsDataURL(file);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !proposaldata.title ||
      !proposaldata.file ||
      !proposaldata.supervisor.id
    ) {
      console.log("Please fill in all the required fields.");
      return;
    }
    setIsLoading(true);

    const selectedStudent = [
      {
        id: currentUser.id,
      },
    ];
    try {
      let pdf = "";
      const uploadTask = storage
        .ref(`Proposals/${proposaldata.file}`)
        .put(selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            pdf = url;
            addDataInExistingColAndDoc("Proposals-data", {
              id: proposaldata.id || "",
              file: pdf || "",
              supervisor: proposaldata.supervisor || {},
              comment: proposaldata.comment || [],
              createdBy: selectedStudent || [],
              status: proposaldata.status || "",
              timestamp: formattedDate || "",
              title: proposaldata.title || "",
              groupID: groupID || "",
              count: proposaldata.count || 1,
              projectCategory: proposaldata.projectCategory,
              projectType: proposaldata.projectType,
            }).then(() => {
              console.log("Proposal sent successfully!");
              setProposaldata({
                comment: [],
                createdBy: [],
                file: "",
                status: "Pending",
                supervisor: {},
                timestamp: "",
                title: "",
                count: 1,
              });
              setProposalSubmitted(false);
              setProposalfilled(true);
              setSelectedFile(null);
              document.getElementById("file").value = "";
              setIsLoading(false);
            });
          });
        }
      );
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };
  return (
    <form className="proposal-form" onSubmit={handleSubmit}>
      <div className="proposal-scroll">
        <div className="form-groups">
          <h2 className="proposal-form-heading">Upload Proposal</h2>
          <div className="form-group">
            <label htmlFor="title" className="form-group-label">
              Title:
            </label>
            <input
              id="myTextArea"
              className="textarea-upload-proposal"
              type="text"
              name="title"
              value={proposaldata.title}
              onChange={handlechange}
              required
            />
          </div>
          <div className="form-group">
            <div className="form-group-items">
              <div className="form-group-filtering">
                <div className="form-group-file">
                  <label htmlFor="file" className="form-group-label">
                    Upload Proposal:
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleuploadchange}
                    required
                  />{" "}
                </div>

                <div>
                  <ReactSelect
                    isSearchable
                    onChange={(selectedOption) =>
                      handleOptionChange(
                        selectedOption.label,
                        selectedOption.value
                      )
                    }
                    options={supervisors}
                    className="select-drop-down"
                    placeholder="Select Supervisor"
                    styles={colourStyles}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="form-group-items">
              <div className="form-group-filtering">
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
                />{" "}
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
            </div>
            <div></div>
          </div>
          {groupID !== false && (
            <div className="form-group-file">
              <label htmlFor="count" className="form-group-label">
                Select Number of Student:
              </label>
              <input
                id="count"
                className="textarea-upload-proposal"
                type="number"
                name="count"
                min={2}
                max={5}
                value={proposaldata.count}
                onChange={handlechange}
                required
              />
            </div>
          )}
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
export default UploadProposalForm;
