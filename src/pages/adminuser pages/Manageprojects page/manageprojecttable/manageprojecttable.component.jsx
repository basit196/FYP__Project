import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./manageprojecttable.styles.scss";
import { ProjectContext } from "../../../../context/projectcontext";
import { UserContext } from "../../../../context/user";
import {
  db,
  handleDeletedocument,
} from "../../../../utiles/firebase/firebase.utiles";
import { doc, collection, getDoc } from "firebase/firestore";
import Paginate from "../../../../component/Pagination component/pagination.component";

const ManageProjectTable = () => {
  const { user, search, setClickEdit, setDataRequest } =
    useContext(UserContext);
  const { project, filterprojects } = useContext(ProjectContext);
  const [Data, setData] = useState(project);
  const [videoId, setVideId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [deleteConfirmation, setDeletconfirmation] = useState(false);
  let dataarray = Data;
  if (filterprojects.length > 0) {
    dataarray = dataarray.filter((item) => {
      const matchesFilters = filterprojects.every((filterproject) => {
        const value = filterproject.value;
        return item.IsDefense === value || filterproject.value === null;
      });
      return matchesFilters;
    });
  }
  useEffect(() => {
    if (search.length > 0) {
      setData(search);
    }
  }, [search]);

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
  const headData = [
    { headtext: "ID" },
    { headtext: "Date" },
    { headtext: "Defense Type" },
    { headtext: "Students" },
    { headtext: "Title" },
    { headtext: "Supervisor" },
    { headtext: "Department" },
    { headtext: "Project Category" },
    { headtext: "Project Type" },
    { headtext: "Status" },
    { headtext: "Remarks" },
    { headtext: "Links" },
    { headtext: "Actions" },
  ];
  useEffect(() => {
    let elements = document.querySelectorAll("[id^='video-link-']");
    const videohandler = async (id) => {
      const collectionRef = collection(db, "Project-data");
      const docRef = doc(collectionRef, id);
      const docSnapshot = await getDoc(docRef);
      const existingData = docSnapshot.exists() ? docSnapshot.data() : "";
      const url = existingData.video;
      elements.forEach((element) => {
        if (element.id === `video-link-${id}`) {
          element.href = url;
        }
      });
    };
    elements.forEach((element) => {
      element.addEventListener("click", () => {
        const id = element.id.split("-")[2];
        videohandler(id);
      });
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("click", () => {
          const id = element.id.split("-")[2];
          videohandler(id);
        });
      });
    };
  }, [videoId]);
  useEffect(() => {
    let elements = document.querySelectorAll("[id^='report-link-']");
    const videohandler = async (id) => {
      const collectionRef = collection(db, "Project-data");
      const docRef = doc(collectionRef, id);
      const docSnapshot = await getDoc(docRef);
      const existingData = docSnapshot.exists() ? docSnapshot.data() : "";
      const url = existingData.report;
      elements.forEach((element) => {
        if (element.id === `report-link-${id}`) {
          element.href = url;
        }
      });
    };

    elements.forEach((element) => {
      element.addEventListener("click", () => {
        const id = element.id.split("-")[2];
        videohandler(id);
      });
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("click", () => {
          const id = element.id.split("-")[2];
          videohandler(id);
        });
      });
    };
  }, [reportId]);
  const editData = (key) => {
    setDataRequest(key);
    setClickEdit(true);
  };
  const deletData = async () => {
    setDeletconfirmation(true);
  };
  const confirmDelete = async (collectionKey, id) => {
    try {
      // Delete the document from Firestore
      handleDeletedocument(collectionKey, id);
      setDeletconfirmation(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const confirmDeletecancel = () => {
    setDeletconfirmation(false);
  };
  useEffect(() => {
    setData(project);
    setDeleted(false);
  }, [deleted, project]);

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
              {currentPosts.map((item) => (
                <tr key={item.id}>
                  <td className="table-data">
                    <span className="table-data-item">{item.id}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{item.date}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">
                      {item.IsDefense} Defense
                    </span>
                  </td>
                  <td className="table-data">
                    {item.Student.map((student, index) => {
                      const matchedUsers = user.filter(
                        (u) => u.id === student.id
                      );
                      const names = matchedUsers.map((u) => u.Name);

                      const otherStudents = item.Student.filter(
                        (s, i) => i !== index
                      );
                      const otherNames = otherStudents.map((s) => {
                        const matched = user.find((u) => u.id === s.id);
                        return matched ? matched.Name : "";
                      });

                      const allNames = [...names, ...otherNames].filter(
                        (name) => name !== ""
                      );

                      if (allNames.length === 1) {
                        return (
                          <span key={index} className="table-data-item">
                            {allNames[0]}
                          </span>
                        );
                      } else {
                        return (
                          <span key={index} className="table-data-item">
                            {allNames.join(", ")}
                          </span>
                        );
                      }
                    })}
                  </td>

                  <td className="table-data">{item.title}</td>
                  <td className="table-data">
                    {user
                      .filter((users) => users.id === item.supervisor.id)
                      .map((supervisor) => {
                        return (
                          <span className="table-data-item">
                            {supervisor.Name}
                          </span>
                        );
                      })}
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{item.department}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">
                      {item.projectCategory}
                    </span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{item.projectType}</span>
                  </td>

                  <td className="table-data">
                    <span className="table-data-item">{item.status}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-data-item">{item.remarks}</span>
                  </td>
                  <td className="table-data">
                    <span className="table-btns">
                      <a
                        id={`report-link-${item.id}`}
                        className="table-link"
                        target="_blank"
                        onClick={() => setReportId(item.id)}
                      >
                        Report
                      </a>
                      <a href={item.web} className="table-link">
                        Web
                      </a>
                      <a
                        id={`video-link-${item.id}`}
                        className="table-link"
                        target="_blank"
                        onClick={() => setVideId(item.id)}
                      >
                        Video
                      </a>
                    </span>
                  </td>
                  <td className="table-data">
                    <div className="table-btns">
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="table-btn"
                        onClick={() => editData(item)}
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
                              confirmDelete("Project-data", item.id)
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

export default ManageProjectTable;
