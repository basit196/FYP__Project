import { faProjectDiagram } from "@fortawesome/free-solid-svg-icons";
import "./manageproject.styles.scss";
import FormTitle from "../../../component/formtiltle component/formtitle.component";
import Table from "../../../component/table component/table.component";
import { useContext } from "react";
import { ProjectContext } from "../../../context/projectcontext";
import Search from "../../../component/Search component/Search.component";
import { UserContext } from "../../../context/user";
import UpdateRequestpProject from "../../../component/updaterequestproject component/updaterequestproject.component";
const ManageProject = () => {
  const { project } = useContext(ProjectContext);
  const { clickedit, dataRequest } = useContext(UserContext);
  return (
    <div className="manage-project">
      <div className="manage-project-container">
        <div className="manage-project-content">
          <FormTitle icon={faProjectDiagram} text={"Manage Project"} />
          <Search data={project} type={"Project Table"} />
        </div>
        <Table
          data={project}
          headData={[
            { headtext: "ID" },
            { headtext: "Date" },
            { headtext: "Student" },
            { headtext: "Title" },
            { headtext: "Supervisor" },
            { headtext: "Department" },
            { headtext: "Project Category" },
            { headtext: "Project Type" },
            { headtext: "Status" },
            { headtext: "Remarks" },

            { headtext: "Links" },
            { headtext: "Actions" },
          ]}
          type={"Project Table"}
        />
      </div>
      {clickedit && (
        <UpdateRequestpProject text="Project-data" item={dataRequest} />
      )}
    </div>
  );
};
export default ManageProject;
