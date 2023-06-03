import "./viewideas.styles.scss";
import { useContext, useState } from "react";
import { IdeaContext } from "../../../context/ideascontext";
import { colourStyles } from "../../../component/filter component/filterstyle";
import { default as ReactSelect } from "react-select";
import { viewIdea } from "../../../Data/viewideafiltering";
import ViewIdeaPopUp from "../../../component/viewIdeapopup/viewideapopup.component";

const ViewIdeas = () => {
  const [selectedvalue, setselectedvalue] = useState(null);
  const [selectedlabel, setselectedlabel] = useState("");
  const { idea, view, setIsView } = useContext(IdeaContext);
  const [Item, setItem] = useState({});
  const handleOptionChange = (label, value) => {
    setselectedvalue(value);
    setselectedlabel(label);
  };

  let IdeaData = idea;
  if (selectedvalue !== null && selectedlabel !== "") {
    IdeaData = IdeaData.filter((item) => {
      const matchesFilters = item.status === selectedlabel.toLowerCase();
      return matchesFilters;
    });
  }
  const handleclick = (item) => {
    setItem(item);
    setIsView(true);
  };

  return (
    <div className="view-idea">
      <div className="view-idea-head">
        <div className="view-idea-heading">
          <h3 className="view-idea-heading-text">View all ideas</h3>
        </div>
        <ReactSelect
          isSearchable
          onChange={(selectedOption) =>
            handleOptionChange(selectedOption.label, selectedOption.value)
          }
          options={viewIdea}
          className="select-drop-down"
          placeholder="Status"
          styles={colourStyles}
        />{" "}
      </div>
      <div className="view-idea-container">
        <div className="view-idea-scroll">
          <div className="view-idea-content">
            {IdeaData.map((item) => {
              return (
                <div className="view-idea-card">
                  <img src={item.ImageUrl} className="view-idea-card-img" />
                  <div className="view-idea-card-container">
                    <div className="view-idea-card-row">
                      <div className="view-idea-card-title">
                        <div className="view-idea-card-text-container">
                          <h2 className="view-idea-card-title-text">Title</h2>
                          <h2 className="view-idea-card-title-text view-idea-card-paragraph">
                            {item.title}
                          </h2>
                        </div>
                        <div className="view-idea-card-field">
                          <div className="view-idea-card-field-content">
                            <h3 className="view-idea-card-field-heading">
                              Field{" "}
                            </h3>
                            <p className="view-idea-card-field-text">
                              {item.field}
                            </p>{" "}
                          </div>
                          <div className="view-idea-card-filtering">
                            <span>Category: {item.projectCategory}</span>
                            <span>Type: {item.projectType}</span>
                          </div>{" "}
                        </div>
                      </div>
                      <div className="view-idea-card-status">
                        <button
                          className="view-idea-button"
                          onClick={() => handleclick(item)}
                        >
                          View
                        </button>
                      </div>
                    </div>

                    <div className="view-idea-card-row">
                      <div className="view-idea-card-supervisor">
                        <span className="view-idea-card-heading">
                          Supervisor{" "}
                        </span>
                        <span className="view-idea-card-text">
                          {item.supervisor}
                        </span>
                      </div>
                      <div>
                        <span className="view-idea-card-heading">Status </span>
                        <span className="view-idea-card-text status-color">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {view && <ViewIdeaPopUp item={Item}  />}
    </div>
  );
};
export default ViewIdeas;
