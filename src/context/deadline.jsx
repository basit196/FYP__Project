import React, { createContext, useEffect, useState } from "react";
import { getColllectionData } from "../utiles/firebase/firebase.utiles";
export const DeadlineContext = createContext({
  deadline: [],
});
export const DeadlineProvider = ({ children }) => {
  const [deadline, setDeadline] = useState([]);
  const [deadlineUpdate, setDeadlineUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = getColllectionData(
      "Deadline-data",
      setDeadline,
      setDeadlineUpdate
    );
    return () => unsubscribe();
  }, [deadlineUpdate]);
  const value = { deadline };
  return (
    <DeadlineContext.Provider value={value}>
      {children}
    </DeadlineContext.Provider>
  );
};
