import React, { createContext, useEffect, useState } from "react";
import { getColllectionData } from "../utiles/firebase/firebase.utiles";

export const ProjectContext = createContext({
  project: [],
  filterprojects: [],
  setFilterProjects: () => {},
  setSelectedOption: () => {},
  projectRadiofilled: true,
  projectSubmittedForm: false,
  setProjectSubmittedFrom: () => {},
  setProjectRadiofilled: () => {},
  selectedDefenseOption: "",
  isDefenseOptionSelected: true,
  setIsDefenseOptionSelected: () => {},
  setSelectedDefenseOption: () => {},
});
export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState([]);
  const [filterprojects, setFilterProjects] = useState([]);
  const [projectUpdate, setProjectUpdate] = useState(false);
  const [projectRadiofilled, setProjectRadiofilled] = useState(true);
  const [projectSubmittedForm, setProjectSubmittedFrom] = useState(false);
  const [selectedDefenseOption, setSelectedDefenseOption] = useState("");
  const [isDefenseOptionSelected, setIsDefenseOptionSelected] = useState(true);
  const handlechildProjectfiltering = (
    item,
    filterprojects,
    setFilterProjects
  ) => {
    if (item.value !== null) {
      if (!filterprojects.length) {
        setFilterProjects([item]);
      } else {
        const index = filterprojects.findIndex(
          (filteritem) => filteritem.name === item.name
        );
        if (index === -1) {
          const updatedFilterProjects = [...filterprojects, item];
          setFilterProjects(updatedFilterProjects);
        } else {
          const updatedFilterProjects = [...filterprojects];
          updatedFilterProjects[index] = item;
          setFilterProjects(updatedFilterProjects);
        }
      }
    } else {
      const updatedFilterProjects = filterprojects.filter(
        (filteritem) => filteritem.name !== item.name
      );
      setFilterProjects(updatedFilterProjects);
    }
  };
  const handleparentProjectfiltering = (
    item,
    filterprojects,
    setFilterProjects
  ) => {
    if (!filterprojects.length) {
      setFilterProjects([item]);
    } else {
      filterprojects.forEach((el, index) => {
        const updatedFilterProjects = [...filterprojects];

        updatedFilterProjects[index] = item;

        setFilterProjects(updatedFilterProjects);
      });
    }
  };

  const setSelectedOption = (item) => {
    if (item.filter === "child") {
      handlechildProjectfiltering(item, filterprojects, setFilterProjects);
    } else {
      handleparentProjectfiltering(item, filterprojects, setFilterProjects);
    }
  };

  useEffect(() => {
    const unsubscribe = getColllectionData(
      "Project-data",
      setProject,
      setProjectUpdate
    );
    return () => unsubscribe();
  }, [projectUpdate]);
  const values = {
    project,
    filterprojects,
    setSelectedOption,
    projectSubmittedForm,
    setProjectSubmittedFrom,
    setProjectRadiofilled,
    projectRadiofilled,
    selectedDefenseOption,
    setSelectedDefenseOption,
    isDefenseOptionSelected,
    setIsDefenseOptionSelected,
    setFilterProjects,
  };

  return (
    <ProjectContext.Provider value={values}>{children}</ProjectContext.Provider>
  );
};
