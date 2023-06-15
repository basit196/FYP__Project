import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./manageideatable.styles.scss";
import { UserContext } from "../../../../context/user";
import { handleDeletedocument } from "../../../../utiles/firebase/firebase.utiles";
import Paginate from "../../../../component/Pagination component/pagination.component";
import { IdeaContext } from "../../../../context/ideascontext";

const ManageIdeaTable = () => {
  //get the seacrh values from the context
  const { user, search, setClickEdit, setDataRequest } =
    useContext(UserContext);
  //get the idea data from the context for the table
  const { idea } = useContext(IdeaContext);
  //set the idea data in data variable
  const [Data, setData] = useState(idea);
  //set the state to confirm message display for delete the idea
  const [deleteConfirmation, setDeletconfirmation] = useState(false);
  useEffect(() => {
    if (search.length > 0) {
      setData(search);
    }
  }, [search]);
  //set the state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts = Data.slice(indexOfFirstPost, indexOfLastPost);
  console.log(currentPosts);
  //set the methods for pagination
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
    if (currentPage !== Math.ceil(Data.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
      paginate(currentPage + 1);
    }
  };
  // the arrayfor the head of the table
  const headData = [
    { headtext: "ID" },
    { headtext: "Title" },
    { headtext: "Field" },
    { headtext: "Supervisor" },
    { headtext: "Project category" },
    { headtext: "Images" },
    { headtext: "Abstract" },
    { headtext: "Project Type" },
    { headtext: "Actions" },
  ];

  //mount the data when data is change in idea collection
  useEffect(() => {
    setData(idea);
  }, [idea]);
  //method that edit the idea and allow the popup to visiable
  const editData = (key) => {
    setDataRequest(key);
    setClickEdit(true);
  };

  const deletData = async () => {
    setDeletconfirmation(true);
  };
  //confirm delete the data
  const confirmDelete = (collectionKey, id) => {
    try {
      handleDeletedocument(collectionKey, id);
      setDeletconfirmation(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const confirmDeletecancel = () => {
    setDeletconfirmation(false);
  };
  //sort the data that get
  Data.sort((a, b) => a.id - b.id);

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
              {currentPosts.map((dataitem) => (
                <tr key={dataitem.id}>
                  <td className="table-data">
                    <span className="table-data-item">{dataitem.id}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{dataitem.title}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{dataitem.field}</span>
                  </td>
                  <td className="table-data">
                    {user
                      .filter((users) => users.id === dataitem.uploadedBy.id)
                      .map((supervisor) => {
                        return (
                          <span className="table-data-item">
                            {supervisor.Name}
                          </span>
                        );
                      })}{" "}
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">
                      {dataitem.projectCategory}
                    </span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{dataitem.ImageUrl}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{dataitem.abstract}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">
                      {dataitem.projectType.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-data">
                    <div className="table-btns">
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="table-btn"
                        onClick={() => editData(dataitem)}
                      />
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="table-btn"
                        onClick={deletData}
                      />
                    </div>
                  </td>
                  {deleteConfirmation && (
                    <div className="delete-idea">
                      <div className="delete-idea-container">
                        <p>Are you sure to delete it?</p>
                        <div className="delete-idea-btns">
                          <button
                            className="delete-idea-btn-yes"
                            onClick={() =>
                              confirmDelete("Idea-data", dataitem.id)
                            }
                          >
                            Yes
                          </button>
                          <button
                            className="delete-idea-btn-no"
                            onClick={confirmDeletecancel}
                          >
                            No
                          </button>{" "}
                        </div>
                      </div>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="table-pagination">
        <div className="project-pagination">
          <Paginate
            key={Data.length}
            postsPerPage={postsPerPage}
            totalPosts={Data.length}
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

export default ManageIdeaTable;
