import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Search.styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../context/user";

const Search = ({ data, type }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { setSearchkeyword, setSearch } = useContext(UserContext);
  useEffect(() => {
    setSearch(searchResults);
  }, [searchResults, setSearch]);

  const handleInputChange = (event) => {
    const keyword = event.target.value;
    setSearchkeyword(keyword);
    setSearchTerm(keyword);
    if (keyword === "") {
      setSearchResults([]);
    } else {
      const results = searchProjects(keyword);
      setSearchResults(results);
    }
  };

  const searchProjects = (keyword) => {
    let results = [];
    if (type === "Project Table") {
      for (const category of data) {
        const { title, supervisor } = category;

        if (
          title.toLowerCase().includes(keyword.toLowerCase()) ||
          supervisor.toLowerCase().includes(keyword.toLowerCase())
        ) {
          results.push(category);
        }
      }
    }
    if (type === "Idea Table") {
      for (const items of data) {
        const { title, supervisor } = items;
        if (
          title.toLowerCase().includes(keyword.toLowerCase()) ||
          supervisor.toLowerCase().includes(keyword.toLowerCase())
        ) {
          results.push(items);
        }
      }
    }
    console.log(results);
    return results;
  };
  return (
    <div className="search-input">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <FontAwesomeIcon icon={faSearch} className="search-input-icon" />
    </div>
  );
};

export default Search;
