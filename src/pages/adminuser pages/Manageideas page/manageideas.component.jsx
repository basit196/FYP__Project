import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./manageideas.styles.scss";
import FormTitle from "../../../component/formtiltle component/formtitle.component";
import { useContext } from "react";
import { IdeaContext } from "../../../context/ideascontext";
import Search from "../../../component/Search component/Search.component";
import { UserContext } from "../../../context/user";
import ManageIdeaTable from "./manageideatable/manageideatable.component";
import UpdateRequestpIdea from "./updaterequestidea component/updaterequestidea.component";

const ManageIdeas = () => {
  const { idea } = useContext(IdeaContext);
  const { clickedit, dataRequest } = useContext(UserContext);
  return (
    <div className="manage-idea">
      {idea.length > 0 ? (
        <>
          <div className="manage-idea-container">
            <div className="manage-idea-content">
              <FormTitle icon={faEdit} text={"Manage Ideas"} />
              <>
                <Search data={idea} type={"Idea Table"} />
                <ManageIdeaTable />
              </>
            </div>
          </div>
          {clickedit && (
            <UpdateRequestpIdea text="Idea-data" item={dataRequest} />
          )}{" "}
        </>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default ManageIdeas;
