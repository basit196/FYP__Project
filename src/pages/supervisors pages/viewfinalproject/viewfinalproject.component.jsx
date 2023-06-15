import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/user";
import { ProjectContext } from "../../../context/projectcontext";

const ViewFinalProject = () => {
  const { project } = useContext(ProjectContext);
  const { currentUser, user } = useContext(UserContext);
  const [newArray, setnewArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  useEffect(() => {
    if (user.length > 0 && project.length > 0) {
      const filteredArray = project.filter(
        (item) =>
          item.supervisor.id === currentUser.id &&
          item.IsDefense === "Final" &&
          item.status === "Completed" &&
          item.date.slice(0, 4) === year.toString()
      );
      setnewArray(filteredArray);
      setIsLoading(false);
    }
  }, [user, project, currentUser.id]);

  return (
    <div className="student-table-container">
      <div className="view-idea-heading">
        <h3 className="view-idea-heading-text">Mid Defense Projects</h3>
      </div>
      <div className="student-table-content">
        <table className="student-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Proposal Title</th>
              <th>Thesis </th>
              <th>ppt* file</th>

              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : newArray.length > 0 ? (
              newArray.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.Student &&
                      item.Student.map((student, index) => {
                        const findUser = user.find(
                          (userItem) => userItem.id === student.id
                        );
                        return findUser && findUser.Name;
                      }).join(", ")}
                  </td>
                  <td>{item.title}</td>
                  <td>
                    <a href={item.report} target="_blank">
                      Document 1
                    </a>
                  </td>{" "}
                  <td>
                    <a href={item.presentation} target="_blank">
                      Document 1
                    </a>
                  </td>
                  <td>{item.remarks}</td>
                </tr>
              ))
            ) : (
              <div>No Data found</div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewFinalProject;
