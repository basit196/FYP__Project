import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./manageideas.styles.scss";
import FormTitle from "../../../component/formtiltle component/formtitle.component";
import Table from "../../../component/table component/table.component";
import { useContext } from "react";
import { IdeaContext } from "../../../context/ideascontext";
import Search from "../../../component/Search component/Search.component";
import { UserContext } from "../../../context/user";
import UpdateRequestpIdea from "../../../component/updaterequestidea component/updaterequestidea.component";
const ManageIdeas = () => {
  const { idea } = useContext(IdeaContext);
  const {clickedit,dataRequest}=useContext(UserContext)
  return (
    <div className="manage-idea">
      <div className="manage-idea-container">
        <div className="manage-idea-content">
          <FormTitle icon={faEdit} text={"Manage Ideas"} />
          <Search data={idea} type={"Idea Table"} />
        </div>
        <Table
          data={idea}
          headData={[
            { headtext: "ID" },
            { headtext: "Title" },
            { headtext: "Field" },
            { headtext: "Supervisor" },
            { headtext: "Project category" },
            { headtext: "Images" },
            { headtext: "Abstract" },
            { headtext: "Project Type" },
            { headtext: "Actions" },
          ]}
          type="Idea Table"
        />
      </div>
      {clickedit && (
        <UpdateRequestpIdea text="Idea-data" item={dataRequest} />
      )}
    </div>
  );
};
export default ManageIdeas;
