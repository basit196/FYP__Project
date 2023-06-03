import React, { createContext, useEffect, useState } from "react";
import { getColllectionData, db } from "../utiles/firebase/firebase.utiles";
import { onSnapshot, collection } from "firebase/firestore";

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
  const [user, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [search, setSearch] = useState([]);
  const [searchkeyword, setSearchkeyword] = useState("");
  const [clickedit, setClickEdit] = useState(false);
  const [dataRequest, setDataRequest] = useState({});
  const [image, setimage] = useState(false);

  useEffect(() => {
    const getUserMap = async () => {
      const userMap = await getColllectionData("Users-Data");
      setUser(userMap);
    };
    getUserMap();
  }, [user.id]);

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
