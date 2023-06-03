import { default as ReactSelect } from "react-select";
import "./uploadproposal.styles.scss";
import { colourStyles } from "../../../component/filter component/filterstyle";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/user";
import { ProposalContext } from "../../../context/proposalcontext";
import {
  addDataInExistingColAndDoc,
  storage,
} from "../../../utiles/firebase/firebase.utiles";

const UploadProposal = () => {
  const { user } = useContext(UserContext);
  const { proposal } = useContext(ProposalContext);
  const [proposaldata, setProposaldata] = useState({
    comment: "",
    createdBy: [],
    file: "",
    status: "pending",
    supervisor: {},
    timestamp: "",
    title: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const supervisor = user.filter((item) => item.role === "Supervisor");
  const supervisorOptions = supervisor.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  useEffect(() => {
    const maxId = proposal.reduce((max, currentproposal) => {
      const proposalId = parseInt(currentproposal.id);
      return proposalId > max ? proposalId : max;
    }, 0);
    const idnumber = maxId + 1;
    setProposaldata((prevFormData) => ({
      ...prevFormData,
      id: idnumber.toString(),
    }));
  }, [proposal]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const handlechange = (event) => {
    const { name, value } = event.target;
    setProposaldata({ ...proposaldata, [name]: value });
  };
  const handleOptionChange = (label, value) => {
    setProposaldata({
      ...proposaldata,
      supervisor: { id: value, name: label },
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
              comment: proposaldata.comment || "",
              createdBy: proposaldata.createdBy || [],
              status: proposaldata.status || "",
              timestamp: formattedDate || "",
              title: proposaldata.title || "",
            });
            // Perform any actions that depend on the image URL here
          });
        }
      );

      console.log("Proposal sent successfully!");
      // Reset form data
      setProposaldata({
        id: "",
        file: "",
        supervisor: {},
        comment: "",
        createdBy: [],
        status: "",
        timestamp: "",
        title: "",
      });
      document.getElementById("file").value = "";
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };
console.log(proposaldata);
  return (
    <div className="upload-proposal">
      <form className="proposal-form" onSubmit={handleSubmit}>
        <h2 className="proposal-form-heading">Upload Proposal</h2>
        <div className="form-groups">
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
                />
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
                  options={supervisorOptions}
                  className="select-drop-down"
                  placeholder="Select Supervisor"
                  styles={colourStyles}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="proposal-form-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
export default UploadProposal;
