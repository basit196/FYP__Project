import Paragraph from "../../../component/Paragraph component/paragraph.component";
import "./toppick.style.scss";
import ImpactText from "../../../Data/toppick";
import Title from "../../../component/title component/title.component";
import { useContext, useState } from "react";
import { ProjectContext } from "../../../context/projectcontext";
import Paginate from "../../../component/Pagination component/pagination.component";
import ProjectTable from "../../../component/Project Table component/projecttable.component";
const TopPick = () => {
  const { project } = useContext(ProjectContext);
  const Tabledata = project.filter((item) => item.remarks === "Excellent");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = Tabledata.slice(indexOfFirstPost, indexOfLastPost);

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
      <div className="impact-table">
        {currentPosts.map((data) => {
          return (
            <div className="impact-table-detail">
              <ProjectTable tableData={data} />
            </div>
          );
        })}
      </div>
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
        />{" "}
      </div>
    </div>
  );
};
export default TopPick;
