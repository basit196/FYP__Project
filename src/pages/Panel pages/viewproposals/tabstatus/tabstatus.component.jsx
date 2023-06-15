import React, { useState } from "react";
import "./tabstatus.styles.scss";
import ViewProposal from "../viewproposal.component";

const Tab = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const tabs = ["Pending", "Approved", "Rejected"];

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
            {tab === "Pending" && <ViewProposal status={tab} />}
            {tab === "Approved" && <ViewProposal status={tab} />}
            {tab === "Rejected" && <ViewProposal status={tab} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tab;
