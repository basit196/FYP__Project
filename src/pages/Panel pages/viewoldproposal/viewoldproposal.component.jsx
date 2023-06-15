import { useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { IdeaContext } from "../../../context/ideascontext";
import Paginate from "../../../component/Pagination component/pagination.component";
import { db } from "../../../utiles/firebase/firebase.utiles";
import { UserContext } from "../../../context/user";
import ViewProposalPopUp from "../viewproposals/viewproposalpopup/viewproposalpopup.component";
import { ProposalContext } from "../../../context/proposalcontext";
import "./viewoldproposal.styles.scss";
const ViewOldProposal = () => {
  const [selectedvalue, setselectedvalue] = useState(null);
  const [selectedlabel, setselectedlabel] = useState("");
  const { view, setIsView } = useContext(IdeaContext);
  const { user } = useContext(UserContext);
  const { proposal } = useContext(ProposalContext);
  const [Item, setItem] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ideaRef = collection(db, "Proposals-data");
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
  }, [proposal]);

  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const newArry = proposal.filter(
    (item) =>
      item.status === "Approved" &&
      item.timestamp.slice(0, 4) !== year.toString()
  );
  let IdeaData = newArry;
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
  const currentPosts =
    IdeaData && IdeaData.slice(indexOfFirstPost, indexOfLastPost);

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
    <div className="view-old-container">
      <div className="view-proposal">
        <div className="view-proposal-head">
          <div className="view-proposal-heading">
            <h3 className="view-proposal-heading-text">View Old Proposal</h3>
          </div>
        </div>
        {loading ? (
          <div className="view-proposal-container">
            <div className="submitted-proposal-wait">
              Loading <div className="spinner"></div>
            </div>
          </div>
        ) : IdeaData.length === 0 ? (
          <div className="view-proposal-container">
            <div className="no-data-message">No data available</div>
          </div>
        ) : (
          <>
            {" "}
            <div className="view-proposal-container">
              <div className="view-proposal-scroll">
                <div className="view-proposal-content">
                  {proposal &&
                    currentPosts.map((item) => {
                      return (
                        <div className="view-proposal-card">
                          <div className="view-proposal-card-container">
                            <div className="view-proposal-card-row">
                              <div className="view-proposal-card-title">
                                <div className="view-proposal-card-text-container">
                                  <h2 className="view-proposal-card-title-text">
                                    Title
                                  </h2>
                                  <h2 className="view-proposal-card-title-text view-proposal-card-paragraph">
                                    {item.title}
                                  </h2>
                                </div>
                                <div className="view-proposal-card-field">
                                  <div className="view-proposal-card-field-content">
                                    <h3 className="view-proposal-card-field-heading">
                                      Submitted on:
                                    </h3>
                                    <p className="view-proposal-card-field-text">
                                      {item.timestamp}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="view-proposal-card-status">
                                <button
                                  className="view-proposal-button"
                                  onClick={() => handleclick(item)}
                                >
                                  View
                                </button>
                              </div>
                            </div>

                            <div className="view-proposal-card-row">
                              <div className="view-proposal-card-supervisor">
                                <span className="view-proposal-card-heading">
                                  Supervisor
                                </span>
                                <span className="view-proposal-card-text">
                                  {user
                                    .filter(
                                      (users) => users.id === item.supervisor.id
                                    )
                                    .map((supervisor) => {
                                      return (
                                        <span className="table-data-item">
                                          {supervisor.Name}
                                        </span>
                                      );
                                    })}{" "}
                                </span>
                              </div>
                              <div className="view-proposal-status">
                                <div>
                                  {item.createdBy &&
                                  item.createdBy.length === 1 ? (
                                    <p className="view-proposal-student">
                                      {item.createdBy.length} Students are in
                                      group
                                    </p>
                                  ) : (
                                    <p className="view-proposal-student">
                                      {item.createdBy && item.createdBy.length}{" "}
                                      Students are in group{" "}
                                    </p>
                                  )}
                                </div>
                                <div className="view-proposal-status-container">
                                  <span className="view-proposal-card-heading">
                                    Status{" "}
                                  </span>
                                  <span className="view-proposal-card-text status-color">
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
                <div className="view-proposal-pagination">
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
            {view && <ViewProposalPopUp item={Item} />}
          </>
        )}
      </div>{" "}
    </div>
  );
};

export default ViewOldProposal;
