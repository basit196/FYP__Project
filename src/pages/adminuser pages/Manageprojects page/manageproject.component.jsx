import { faProjectDiagram } from "@fortawesome/free-solid-svg-icons";
import "./manageproject.styles.scss";
import FormTitle from "../../../component/formtiltle component/formtitle.component";
import { useContext } from "react";
import { ProjectContext } from "../../../context/projectcontext";
import Search from "../../../component/Search component/Search.component";
import { UserContext } from "../../../context/user";
import ManageProjectTable from "./manageprojecttable/manageprojecttable.component";
import UpdateRequestpProject from "./updaterequestproject component/updaterequestproject.component";
import Filter from "../../../component/filter component/filter.component";
import { DefenseData } from "../../../Data/DefenseData";
const ManageProject = () => {
  const { project } = useContext(ProjectContext);
  const { clickedit, dataRequest } = useContext(UserContext);
  return (
    <div className="manage-project">
      {project.length>0?
        <>
          <div className="manage-project-container">
            <div className="manage-project-content">
              <FormTitle icon={faProjectDiagram} text={"Manage Project"} />
              <Filter filterArray={DefenseData} />

              <Search data={project} type={"Project Table"} />
            </div>
            <ManageProjectTable />
          </div>
          {clickedit && (
            <UpdateRequestpProject text="Project-data" item={dataRequest} />
          )}
        </> : <div>
          Data Not Found
        </div>
      }
    </div>
  );
};
export default ManageProject;
