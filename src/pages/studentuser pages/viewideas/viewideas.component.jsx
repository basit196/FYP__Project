import "./viewideas.styles.scss";
import { useContext, useEffect, useState } from "react";
import { IdeaContext } from "../../../context/ideascontext";
import { colourStyles } from "../../../component/filter component/filterstyle";
import { default as ReactSelect } from "react-select";
import { viewIdea } from "../../../Data/viewideafiltering";
import Paginate from "../../../component/Pagination component/pagination.component";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../utiles/firebase/firebase.utiles";
import ViewIdeaPopUp from "./viewIdeapopup/viewideapopup.component";
import { UserContext } from "../../../context/user";

const ViewIdeas = () => {
  const [selectedvalue, setselectedvalue] = useState(null);
  const [selectedlabel, setselectedlabel] = useState("");
  const { idea, view, setIsView } = useContext(IdeaContext);
  const { user } = useContext(UserContext);
  const [Item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const ideaRef = collection(db, "Idea-data");
    const unsubscribe = onSnapshot(ideaRef, (snapshot) => {
      const updatedIdeas = snapshot.docs.map((doc) => doc.data());
      setItem((prevItem) => {
        const updatedItem = updatedIdeas.find(
          (item) => item.id === prevItem.id
        );
        return updatedItem || prevItem;
      });
      setLoading(false); // Set loading to false after data is fetched
    });

    return () => {
      unsubscribe();
    };
  }, [idea]);

  const handleOptionChange = (label, value) => {
    setselectedvalue(value);
    setselectedlabel(label);
  };

  let IdeaData = idea;
  if (selectedvalue !== null && selectedlabel !== "") {
    IdeaData = IdeaData.filter((item) => {
      const matchesFilters = item.status === selectedlabel.toLowerCase();
      return matchesFilters;
    });
  }

  const handleclick = (item) => {
    setItem(item);
    setIsView(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = IdeaData.slice(indexOfFirstPost, indexOfLastPost);

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
    if (currentPage !== Math.ceil(IdeaData.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
      paginate(currentPage + 1);
    }
  };

  return (
    <div className="view-idea">
      <div className="view-idea-head">
        <div className="view-idea-heading">
          <h3 className="view-idea-heading-text">View all ideas</h3>
        </div>
        <ReactSelect
          isSearchable
          onChange={(selectedOption) =>
            handleOptionChange(selectedOption.label, selectedOption.value)
          }
          options={viewIdea}
          className="select-drop-down"
          placeholder="Status"
          styles={colourStyles}
        />
      </div>
      {loading ? (
        <div className="view-idea-container">
          <div className="submitted-proposal-wait">
            Loading <div className="spinner"></div>
          </div>
        </div>
      ) : IdeaData.length === 0 ? (
        <div className="view-idea-container">
          <div className="no-data-message">No data available</div>
        </div>
      ) : (
        <>
          <div className="view-idea-container">
            <div className="view-idea-scroll">
              <div className="view-idea-content">
                {currentPosts.map((item) => {
                  return (
                    <div className="view-idea-card">
                      <img
                        src={item.ImageUrl}
                        className="view-idea-card-img"
                        alt="Idea"
                      />
                      <div className="view-idea-card-container">
                        <div className="view-idea-card-row">
                          <div className="view-idea-card-title">
                            <div className="view-idea-card-text-container">
                              <h2 className="view-idea-card-title-text">
                                Title
                              </h2>
                              <h2 className="view-idea-card-title-text view-idea-card-paragraph">
                                {item.title}
                              </h2>
                            </div>
                            <div className="view-idea-card-field">
                              <div className="view-idea-card-field-content">
                                <h3 className="view-idea-card-field-heading">
                                  Field
                                </h3>
                                <p className="view-idea-card-field-text">
                                  {item.field}
                                </p>
                              </div>
                              <div className="view-idea-card-filtering">
                                <span>Category: {item.projectCategory}</span>
                                <span>Type: {item.projectType}</span>
                              </div>
                            </div>
                          </div>
                          <div className="view-idea-card-status">
                            <button
                              className="view-idea-button"
                              onClick={() => handleclick(item)}
                            >
                              View
                            </button>
                          </div>
                        </div>

                        <div className="view-idea-card-row">
                          <div className="view-idea-card-supervisor">
                            <span className="view-idea-card-heading">
                              uploaded By :
                            </span>
                            <span className="view-idea-card-text">
                              {user
                                .filter(
                                  (users) => users.id === item.uploadedBy.id
                                )
                                .map((supervisor) => {
                                  return (
                                    <span className="table-data-item">
                                      {supervisor.Name}({supervisor.role})
                                    </span>
                                  );
                                })}{" "}
                            </span>
                          </div>
                          <div className="view-idea-status">
                            <div>
                              {item.student && item.student.length === 0 ? (
                                <p className="view-idea-student">
                                  No student picked this idea
                                </p>
                              ) : item.student && item.student.length === 1 ? (
                                <p className="view-idea-student">
                                  {item.student.length} student picked this idea
                                </p>
                              ) : (
                                <p className="view-idea-student">
                                  {item.student && item.student.length} students
                                  picked this idea
                                </p>
                              )}
                            </div>
                            <div className="view-idea-status-container">
                              <span className="view-idea-card-heading">
                                Status{" "}
                              </span>
                              <span className="view-idea-card-text status-color">
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="view-idea-pagination">
                <div className="project-pagination">
                  <Paginate
                    key={IdeaData.length}
                    postsPerPage={postsPerPage}
                    totalPosts={IdeaData.length}
                    paginate={paginate}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
          {view && <ViewIdeaPopUp item={Item} />}
        </>
      )}
    </div>
  );
};

export default ViewIdeas;
