import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/user";
import { IdeaContext } from "../../context/ideascontext";

const SelectedBy = () => {
  const { idea } = useContext(IdeaContext);
  const { currentUser, user } = useContext(UserContext);
  const [newArray, setnewArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user.length > 0 && idea.length > 0) {
      const filteredArray = idea.filter(
        (item) => item.uploadedBy.id === currentUser.id
      );
      setnewArray(filteredArray);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user, idea, currentUser.id]);

  return (
    <div className="student-table-container">
      <div className="view-idea-heading">
        <h3 className="view-idea-heading-text">Selected By</h3>
      </div>
      <div className="student-table-content">
        <table className="student-table">
          <thead>
            <tr>
              <th>Idea Title</th>
              <th>Field </th>
              <th>Status</th>
              <th>Student Name</th>
              <th>Student Email</th>
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
                  <td>{item.title}</td>
                  <td>{item.field}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.student &&
                      item.student.map((student) => {
                        const findUser = user.find(
                          (userItem) => userItem.id === student.id
                        );
                        return findUser && findUser.Name;
                      })}
                  </td>
                  <td>
                    {item.student &&
                      item.student.map((student) => {
                        const findUser = user.find(
                          (userItem) => userItem.id === student.id
                        );
                        return findUser && findUser.Email;
                      })}
                  </td>
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

export default SelectedBy;
