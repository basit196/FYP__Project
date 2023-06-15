import "./formtitle.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const FormTitle = ({ icon, text }) => {
  return (
    <div className="form-title-heading">
      <h3>
        <FontAwesomeIcon icon={icon} className="form-title-icon" /> {text}
      </h3>
    </div>
  );
};
export default FormTitle;
