import { useState } from "react";
import "./viewproject.styles.scss";
import MidDefenseviewform from "./middefenseViewform/middefenseviewform.component";
import FinalDefenseviewform from "./finaldefenseViewform/finaldefenseviewform.component";
const ViewProject = () => {
  const [activeTab, setActiveTab] = useState("mid-defense");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="view-project">
      <div className="view-project-container">
        <h2 className="view-project-heading">Project Overview</h2>
        <div className="view-project-main-content">
          <div className="view-project-project-info">
            <h3 className="view-project-project-info-heading">
              Select the defense tab
            </h3>
          </div>
          <div className="view-project-defense-details">
            <div className="view-project-defense-details-defense-tabs">
              <button
                className={`view-project-defense-details-defense-tabs-tab ${
                  activeTab === "mid-defense"
                    ? "view-project-defense-details-defense-tabs-tab-active"
                    : ""
                }`}
                onClick={() => handleTabChange("mid-defense")}
              >
                Mid Defense
              </button>
              <button
                className={`view-project-defense-details-defense-tabs-tab ${
                  activeTab === "final-defense"
                    ? "view-project-defense-details-defense-tabs-tab-active"
                    : ""
                }`}
                onClick={() => handleTabChange("final-defense")}
              >
                Final Defense
              </button>
            </div>

            <div
              className={`view-project-defense-details-defense-content ${
                activeTab === "mid-defense"
                  ? "view-project-defense-details-defense-content-active"
                  : ""
              }`}
            >
              <MidDefenseviewform />
            </div>

            <div
              className={`view-project-defense-details-defense-content ${
                activeTab === "final-defense"
                  ? "view-project-defense-details-defense-content-active"
                  : ""
              }`}
            >
              <FinalDefenseviewform />
            </div>
          </div>{" "}
        </div>
      </div>{" "}
    </div>
  );
};

export default ViewProject;
