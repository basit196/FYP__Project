import React, { createContext, useEffect, useState } from "react";
import {
  addcollectionAndDocument,
  getColllectionData,
  getProjectData,
} from "../utiles/firebase/firebase.utiles";
import ProjectTableData from "../Data/tableData";

export const ProjectContext = createContext({
  project: [],
  filterprojects: [],
  setSelectedOption: () => {},
});
export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState([]);
  const [filterprojects, setFilterProjects] = useState([]);

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
    const getProjectMap = async () => {
      // await addcollectionAndDocument("Project-data", ProjectTableData);
      const ProjectMap = await getColllectionData("Project-data");
      setProject(ProjectMap);
    };
    getProjectMap();
  }, []);
  const values = {
    project,
    filterprojects,
    setSelectedOption,
  };

  return (
    <ProjectContext.Provider value={values}>{children}</ProjectContext.Provider>
  );
};
