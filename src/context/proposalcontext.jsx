import React, { createContext, useEffect, useState } from "react";
import {
  addcollectionAndDocument,
  getColllectionData,
} from "../utiles/firebase/firebase.utiles";
export const ProposalContext = createContext({
  proposal: [],
});
export const ProposalProvider = ({ children }) => {
  const [proposal, setProposal] = useState([]);
  useEffect(() => {
    const getProposalData = async () => {
      const proposaldata = await getColllectionData("Proposals-data");
      setProposal(proposaldata);
    };
    getProposalData();
  }, []);
  const value = { proposal };
  return (
    <ProposalContext.Provider value={value}>
      {children}
    </ProposalContext.Provider>
  );
};
