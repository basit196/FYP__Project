import { default as ReactSelect } from "react-select";
import "./filter.style.scss";
import { useContext } from "react";
import { ProjectContext } from "../../context/projectcontext";
import "react-nested-dropdown/dist/styles.css";
import { colourStyles } from "./filterstyle";
const Filter = ({ filterArray }) => {
  const { setSelectedOption } = useContext(ProjectContext);

  const handleOptionChange = (selectedOption, name, filter) => {
    setSelectedOption({
      ...selectedOption,
      name: name,
      filter: filter,
    });
  };
  return (
    <div className="filter-container">
      {filterArray.map((optionitem) => {
        return (
          <ReactSelect
            key={optionitem.id}
            isSearchable
            onChange={(selectedOption) =>
              handleOptionChange(selectedOption, optionitem.label, "child")
            }
            options={optionitem.children}
            className="select-drop-down"
            placeholder={optionitem.label}
            styles={colourStyles}
          />
        );
      })}
    </div>
  );
};
export default Filter;
