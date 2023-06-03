import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./studentdashboard.styles.scss";
import { faBell } from "@fortawesome/free-solid-svg-icons";
const StudentDashboard = () => {
  return (
    <div className="deadline-announcement-container">
      <div className="deadline-announcement">
        <div className="announcement-icon">
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div className="announcement-content">
          <h3 className="announcement-content-heading">Submission Deadline Reminder</h3>
          <p className="announcement-content-paragraph">
            The submission deadline for the Final Year Projects is approaching.
            Please make sure to submit your project  before the
            deadlines.
          </p>
          <div className="deadline">
            <span className="deadline-label">Project Deadline:</span>
            <span className="deadline-date">May 31, 2023</span>
          </div>
        
        </div>
      </div>{" "}
      <div className="deadline-announcement">
        <div className="announcement-icon">
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div className="announcement-content">
          <h3 className="announcement-content-heading">Submission Deadline Reminder</h3>
          <p className="announcement-content-paragraph">
            The submission deadline for the Final Year Proposal is approaching.
            Please make sure to submit your proposal  before the
            deadlines.
          </p>
        
          <div className="deadline">
            <span className="deadline-label">Proposal Deadline:</span>
            <span className="deadline-date">June 15, 2023</span>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};
export default StudentDashboard;
