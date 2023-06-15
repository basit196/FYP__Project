import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./manageuserTable.styles.scss";
import { ProjectContext } from "../../../../context/projectcontext";
import { UserContext } from "../../../../context/user";
import { handleDeletedocument } from "../../../../utiles/firebase/firebase.utiles";
import Paginate from "../../../../component/Pagination component/pagination.component";

const ManageUserTable = () => {
  const { user, setDataRequest, setClickEdit } = useContext(UserContext);
  const { filterprojects } = useContext(ProjectContext);
  const [Data, setData] = useState(user);
  const [deleted, setDeleted] = useState(false);
  const headData = [
    { headtext: "ID" },
    { headtext: "Name" },
    { headtext: "UserName" },
    { headtext: "Password" },
    { headtext: "Email" },
    { headtext: "Image" },
    { headtext: "Department" },
    { headtext: "Role" },
    { headtext: "Actions" },
  ];
  let dataarray = Data;
  if (filterprojects.length > 0) {
    dataarray = dataarray.filter((item) => {
      const matchesFilters = filterprojects.every((filterproject) => {
        const value = filterproject.value;
        return item.role === value || filterproject.value === null;
      });
      return matchesFilters;
    });
  }
  const editData = (key) => {
    setDataRequest(key);
    setClickEdit(true);
  };
  const deletData = async (collectionKey, id) => {
    try {
      handleDeletedocument(collectionKey, id);
      const updatedDataArray = Data.filter((data) => data.id !== id);
      setData(updatedDataArray);
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  useEffect(() => {
    setData(user);
    setDeleted(false);
  }, [user, deleted]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts = dataarray.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      paginate(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage !== Math.ceil(dataarray.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
      paginate(currentPage + 1);
    }
  };
  dataarray.sort((a, b) => a.id - b.id);


  return (
    <div className="table-content">
      <div className="table-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {headData.map((headItem) => (
                  <th key={headItem.headtext} className="table-head">
                    {headItem.headtext}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((key) => (
                <tr key={key.id}>
                  <td className="table-data">
                    <span className="table-data-item">{key.id}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{key.Name}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{key.username}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{key.password}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{key.Email}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{key.image}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">
                      {key.department.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">
                      {key.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-data">
                    <div className="table-btns">
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="table-btn"
                        onClick={() => editData(key)}
                      />
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="table-btn"
                        onClick={() => deletData("Users-Data", key.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="table-pagination">
        <div className="project-pagination">
          <Paginate
            key={dataarray.length}
            postsPerPage={postsPerPage}
            totalPosts={dataarray.length}
            paginate={paginate}
            previousPage={previousPage}
            nextPage={nextPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageUserTable;
