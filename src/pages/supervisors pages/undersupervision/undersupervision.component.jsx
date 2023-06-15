import { useContext, useEffect, useState } from "react";
import "./undersupervision.styles.scss";
import { UserContext } from "../../../context/user";
import { ProposalContext } from "../../../context/proposalcontext";

const UnderSupervision = () => {
  const { proposal } = useContext(ProposalContext);
  const { currentUser, user } = useContext(UserContext);
  const [newArray, setnewArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user.length > 0 && proposal.length > 0) {
      const filteredArray = proposal.filter(
        (item) => item.supervisor.id === currentUser.id
      );
      setnewArray(filteredArray);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user, proposal, currentUser.id]);

  return (
    <div className="student-table-container">
      <div className="view-idea-heading">
        <h3 className="view-idea-heading-text">Under Supervision</h3>
      </div>
      <div className="student-table-content">
        <table className="student-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Proposal Title</th>
              <th>Proposal </th>
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
                    {item.createdBy &&
                      item.createdBy.map((student) => {
                        const findUser = user.find(
                          (userItem) => userItem.id === student.id
                        );
                        return findUser && findUser.Name;
                      })}
                  </td>
                  <td>{item.title}</td>
                  <td>
                    <a href={item.file} target="_blank">
                      Document 1
                    </a>
                  </td>

                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <div>No Data Found</div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnderSupervision;
