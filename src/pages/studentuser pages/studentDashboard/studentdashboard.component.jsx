import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./studentdashboard.styles.scss";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { DeadlineContext } from "../../../context/deadline";
const StudentDashboard = () => {
  const { deadline } = useContext(DeadlineContext);
  const currentDate = new Date();
  const filteredDeadlines = deadline.filter((item) => {
    const deadlineDate = new Date(item.deadlinedate);
    deadlineDate.setDate(deadlineDate.getDate() + 1);
    return deadlineDate >= currentDate;
  });
  return (
    <div className="deadline-announcement-container">
      <div className="view-idea-heading">
        <h3 className="view-idea-heading-text">Deadlines</h3>
      </div>
      <div className="deadline-announcement-content">
        {filteredDeadlines.map((item) => {
          const { deadlinedate } = item;
          const newDate = new Date(deadlinedate);
          const formattedDate = newDate.toLocaleDateString();
          return (
            <div key={item.id} className="deadline-announcement">
              <div className="announcement-icon">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <div className="announcement-content">
                <h3 className="announcement-content-heading">
                  Submission Deadline Reminder
                </h3>
                <p className="announcement-content-paragraph">
                  {item.description}
                </p>
                <div className="deadline">
                  <span className="deadline-label">{item.type}</span>
                  <span className="deadline-date">{formattedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default StudentDashboard;
