import React, { useState } from "react";
import "./defenseproject.styles.scss";
import DefenseProject from "./defenseproject/defenseproject.component";

const ViewDefenseProject = () => {
  const [activeTab, setActiveTab] = useState("Mid Defense");
  const tabs = ["Mid Defense", "Final Defense"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab-pane ${activeTab === tab ? "active" : ""}`}
          >
            {tab === "Mid Defense" && <DefenseProject status="Mid" />}
            {tab === "Final Defense" && <DefenseProject status="Final" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDefenseProject;
