import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { IdeasProvider } from "./context/ideascontext";
import reportWebVitals from "./reportWebVitals";
import { ProjectProvider } from "./context/projectcontext";
import { UserProvider } from "./context/user";
import { ProposalProvider } from "./context/proposalcontext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <IdeasProvider>
          <ProposalProvider>
            <ProjectProvider>
              <App />
            </ProjectProvider>
          </ProposalProvider>
        </IdeasProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
