import React, { createContext, useEffect, useState } from "react";
import { getColllectionData } from "../utiles/firebase/firebase.utiles";
export const ProposalContext = createContext({
  proposal: [],
  proposalfilled: true,
  proposalSubmitted: false,
  setProposalSubmitted: () => {},
  setProposalfilled: () => {},
});
export const ProposalProvider = ({ children }) => {
  const [proposalUpdate, setProposalUpdate] = useState(false);
  const [proposal, setProposal] = useState([]);
  const [proposalfilled, setProposalfilled] = useState(true);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = getColllectionData(
      "Proposals-data",
      setProposal,
      setProposalUpdate
    );
    return () => unsubscribe();
  }, [proposalUpdate]);

  const value = {
    proposal,
    proposalSubmitted,
    proposalfilled,
    setProposalSubmitted,
    setProposalfilled,
  };
  return (
    <ProposalContext.Provider value={value}>
      {children}
    </ProposalContext.Provider>
  );
};
