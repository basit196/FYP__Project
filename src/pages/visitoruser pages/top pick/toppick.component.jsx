import Paragraph from "../../../component/Paragraph component/paragraph.component";
import "./toppick.style.scss";
import ImpactText from "../../../Data/toppick";
import Title from "../../../component/title component/title.component";
import { useContext, useState, useEffect } from "react";
import { ProjectContext } from "../../../context/projectcontext";
import Paginate from "../../../component/Pagination component/pagination.component";
import ProjectTable from "../../../component/Project Table component/projecttable.component";

const TopPick = () => {
  const { project } = useContext(ProjectContext);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const Tabledata = project.filter((item) => item.remarks === "Excellent");
  const currentPosts = Tabledata.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    if (project.length > 0) {
      setLoading(false);
    }
  }, [project]);

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
    if (currentPage !== Math.ceil(Tabledata.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
      paginate(currentPage + 1);
    }
  };

  return (
    <div className="impact-container">
      <Title text="Top Projects" />
      <div className="impact-text">
        {ImpactText.map((paragraph) => {
          return <Paragraph text={paragraph.para} />;
        })}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="impact-table">
          {currentPosts.length > 0 ? (
            currentPosts.map((data) => (
              <div className="impact-table-detail">
                <ProjectTable tableData={data} />
              </div>
            ))
          ) : (
            <div className="impact-table-error">Data is not Found</div>
          )}
        </div>
      )}
      <div className="toppick-pagination">
        <Paginate
          key={Tabledata.length}
          postsPerPage={postsPerPage}
          totalPosts={Tabledata.length}
          paginate={paginate}
          previousPage={previousPage}
          nextPage={nextPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TopPick;
