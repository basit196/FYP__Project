import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./table.styles.scss";
import { ProjectContext } from "../../context/projectcontext";
import { UserContext } from "../../context/user";
import {
  db,
  handleDeletedocument,
} from "../../utiles/firebase/firebase.utiles";
import { doc, collection, getDoc } from "firebase/firestore";
import Paginate from "../Pagination component/pagination.component";

const Table = ({ data, headData, type }) => {
  const { search, searchkeyword, setClickEdit, setDataRequest } =
    useContext(UserContext);
  const { filterprojects } = useContext(ProjectContext);
  const [Data, setData] = useState(data);
  const [videoId, setVideId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [deleted, setDeleted] = useState(false); // State variable to track deletion
  let tableData;
  let dataarray = Data;

  useEffect(() => {
    if (search.length > 0) {
      setData(search);
    }
  }, [search]);

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
  const deletData = async (collectionKey, id) => {
    try {
      // Delete the document from Firestore
      handleDeletedocument(collectionKey, id);

      // Remove the deleted data from the table UI
      const updatedDataArray = Data.filter((data) => data.id !== id);
      setData(updatedDataArray);
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  useEffect(() => {
    setDeleted(false);
  }, [Data, deleted]);
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
  if (type === "user Table") {
    dataarray.sort((a, b) => a.id - b.id);
    if (filterprojects.length > 0) {
      currentPosts = currentPosts.filter((item) => {
        const matchesFilters = filterprojects.every((filterproject) => {
          const value = filterproject.value;
          return item.role === value || filterproject.value === null;
        });
        return matchesFilters;
      });
    }
    tableData = currentPosts.map((key) => (
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
          <span className="table-data-item">{key.role.toUpperCase()}</span>
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
    ));
  } else if (type === "Project Table") {
    dataarray.sort((a, b) => a.id - b.id);
    tableData = currentPosts.map((item) => (
      <tr key={item.id}>
        <td className="table-data">
          <span className="table-data-item">{item.id}</span>
        </td>
        <td className="table-data">
          <span className="table-data-item">{item.date}</span>
        </td>
        <td className="table-data">
          {item.Student.map((student) => {
            return (
              <span key={student.id} className="table-data-item">
                {" "}
                {student.name} ,
              </span>
            );
          })}
        </td>
        <td className="table-data">{item.title}</td>
        <td className="table-data">
          <span className="table-data-item">{item.supervisor}</span>
        </td>
        <td className="table-data">
          <span className="table-data-item">{item.department}</span>
        </td>
        <td className="table-data">
          <span className="table-data-item">{item.projectCategory}</span>
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
              onClick={() => deletData("Project-data", item.id)}
            />
          </div>
        </td>
      </tr>
    ));
  } else if (type === "Idea Table") {
    dataarray.sort((a, b) => a.id - b.id);

    tableData = currentPosts.map((dataitem) => (
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
        <td className="table-data">{dataitem.supervisor}</td>
        <td className="table-data">
          <span className="table-data-item">{dataitem.projectCategory}</span>
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
              onClick={() => deletData("Idea-data", dataitem.id)}
            />
          </div>
        </td>
      </tr>
    ));
  }

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
              {searchkeyword === "" ? (
                tableData
              ) : search.length === 0 ? (
                <tr>
                  <td>No matching results found.</td>
                </tr>
              ) : (
                tableData
              )}
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

export default Table;
