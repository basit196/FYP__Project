import React, { createContext, useEffect, useState } from "react";
import { getColllectionData, db } from "../utiles/firebase/firebase.utiles";

export const UserContext = createContext({
  user: [],
  search: [],
  clickedit: false,
  dataRequest: {},
  setDataRequest: () => {},
  setClickEdit: () => {},
  setSearch: () => {},
  searchkeyword: "",
  setSearchkeyword: () => {},
  currentUser: {},
  setCurrentUser: () => {},
  image: false,
  setimage: () => {},
});

export const UserProvider = ({ children }) => {
  const [userUpdate, setUserUpdate] = useState(false);
  const [user, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [search, setSearch] = useState([]);
  const [searchkeyword, setSearchkeyword] = useState("");
  const [clickedit, setClickEdit] = useState(false);
  const [dataRequest, setDataRequest] = useState({});
  const [image, setimage] = useState(false);

  useEffect(() => {
    const unsubscribe = getColllectionData(
      "Users-Data",
      setUser,
      setUserUpdate
    );
    return () => unsubscribe();
  }, [userUpdate]);
  const value = {
    user,
    search,
    setSearch,
    searchkeyword,
    setSearchkeyword,
    clickedit,
    setClickEdit,
    dataRequest,
    setDataRequest,
    currentUser,
    setCurrentUser,
    image,
    setimage,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
