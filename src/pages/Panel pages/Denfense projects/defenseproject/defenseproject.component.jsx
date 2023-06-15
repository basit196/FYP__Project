import { useContext } from "react";
import { ProjectContext } from "../../../../context/projectcontext";
import ProjectCard from "../projectcard/projectcard.component";
const DefenseProject = ({ status }) => {
  const { project } = useContext(ProjectContext);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const newMidArray = project.filter(
    (item) =>
      item.IsDefense === status &&
      item.date.slice(0, 4) === year.toString() &&
      item.status === "Pending" &&
      item.Student.length === item.count
  );
  return (
    <div className="proposal-list">
      <div className="card-container">
        <ProjectCard project={newMidArray} status={status} />
      </div>
    </div>
  );
};
export default DefenseProject;
