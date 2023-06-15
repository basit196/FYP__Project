import "./manageuser.styles.scss";
import Filter from "../../../component/filter component/filter.component";
import { RegisterData } from "../../../Data/Registeruser_Data";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import FormTitle from "../../../component/formtiltle component/formtitle.component";
import { useContext } from "react";
import { UserContext } from "../../../context/user";
import ManageUserTable from "./mangeusertable/manageuserTable.component";
import UpdateRequestUser from "./updaterequest component'/updaterequest.component";

const ManageUser = () => {
  const { user, clickedit, dataRequest } = useContext(UserContext);

  return (
    <div className="manage-user">
      {user.length > 0 ? (
        <>
          <div className="manage-user-container">
            <div className="manage-user-content">
              <FormTitle icon={faPencil} text={"Manage User"} />
              <Filter filterArray={RegisterData} />
            </div>
            <ManageUserTable />
          </div>
          {clickedit && (
            <UpdateRequestUser text="Users-Data" item={dataRequest} />
          )}
        </>
      ) : (
        <div>Data not Found</div>
      )}
    </div>
  );
};
export default ManageUser;
