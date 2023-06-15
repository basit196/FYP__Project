import React, { createContext, useEffect, useState } from "react";
import { getColllectionData } from "../utiles/firebase/firebase.utiles";
export const IdeaContext = createContext({
  idea: [],
  view: false,
  setIsView: () => {},
});
export const IdeasProvider = ({ children }) => {
  const [IdeaUpdate, setIdeaUpdate] = useState(false);
  const [idea, setidea] = useState([]);
  const [view, setIsView] = useState(false);
  useEffect(() => {
    const unsubscribe = getColllectionData("Idea-data", setidea, setIdeaUpdate);
    return () => unsubscribe();
  }, [IdeaUpdate]);
  const value = { idea, view, setIsView };
  return <IdeaContext.Provider value={value}>{children}</IdeaContext.Provider>;
};
