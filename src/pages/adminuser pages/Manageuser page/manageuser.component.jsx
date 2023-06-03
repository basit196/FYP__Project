import "./manageuser.styles.scss";
import Filter from "../../../component/filter component/filter.component";
import { RegisterData } from "../../../Data/Registeruser_Data";
import Table from "../../../component/table component/table.component";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import FormTitle from "../../../component/formtiltle component/formtitle.component";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/user";
import UpdateRequestIdea from "../../../component/updaterequest component'/updaterequest.component";
import Paginate from "../../../component/Pagination component/pagination.component";

const ManageUser = () => {
  const { user, clickedit, dataRequest } = useContext(UserContext);

  return (
    <div className="manage-user">
      <div className="manage-user-container">
        <div className="manage-user-content">
          <FormTitle icon={faPencil} text={"Manage User"} />
          <Filter filterArray={RegisterData} />
        </div>
        <Table
          data={user}
          headData={[
            { headtext: "ID" },
            { headtext: "Name" },
            { headtext: "UserName" },
            { headtext: "Password" },
            { headtext: "Email" },
            { headtext: "Image" },
            { headtext: "Department" },
            { headtext: "Role" },
            { headtext: "Actions" },
          ]}
          type={"user Table"}
        />
      </div>
      {clickedit && <UpdateRequestIdea text="Users-Data" item={dataRequest} />}
    </div>
  );
};
export default ManageUser;
