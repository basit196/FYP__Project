import React, { createContext, useEffect, useState } from "react";
import { getColllectionData } from "../utiles/firebase/firebase.utiles";
export const IdeaContext = createContext({
  idea: [],
  view: false,
  setIsView: () => {},
});
export const IdeasProvider = ({ children }) => {
  const [idea, setidea] = useState([]);
  const [view, setIsView] = useState(false);
  useEffect(() => {
    const getIdeaMap = async () => {
      const ideaMap = await getColllectionData("Idea-data");
      setidea(ideaMap);
    };
    getIdeaMap();
  }, []);
  const value = { idea, view, setIsView };
  return <IdeaContext.Provider value={value}>{children}</IdeaContext.Provider>;
};
