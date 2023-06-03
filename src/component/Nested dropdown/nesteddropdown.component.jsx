import "./nesteddropdown.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ProjectContext } from "../../context/projectcontext";
import Dropdown from "react-multilevel-dropdown";
const NestedDropdown = ({ filterArray }) => {
  const { setSelectedOption } = useContext(ProjectContext);

  const handleOptionChange = (selectedOption, name, filter) => {
    setSelectedOption({
      ...selectedOption,
      name: name,
      filter: filter,
    });
  };
  return (
    <Dropdown
      title={
        <span className="nested-dropdown-title">
          <span>Filtering</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="nested-dropdown-icon"
          />{" "}
        </span>
      }
      className="nested-dropdown"
    >
      {filterArray.map((item) => {
        const { children, label } = item;
        return (
          <Dropdown.Item>
            {label}
            {children && (
              <Dropdown.Submenu className="project-dropdown-submenu">
                {children.map((subitem) => {
                  if (subitem.value !== null) {
                    return (
                      <Dropdown.Item
                        onClick={() =>
                          handleOptionChange(subitem, item.label, "parent")
                        }
                      >
                        {subitem.label}
                      </Dropdown.Item>
                    );
                  }
                })}
              </Dropdown.Submenu>
            )}
          </Dropdown.Item>
        );
      })}
    </Dropdown>
  );
};
export default NestedDropdown;
