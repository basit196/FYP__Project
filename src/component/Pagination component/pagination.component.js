import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./pagination.style.scss";
import React from "react";
import {  NavLink } from "react-router-dom";
const Paginate = ({
  postsPerPage,
  totalPosts,
  paginate,
  previousPage,
  nextPage,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <ul className="pagination">
        <li onClick={previousPage} className="pre page-number">
          <FontAwesomeIcon icon={faArrowLeft} />
        </li>
        {pageNumbers.map((number) => (
          <NavLink
            key={number}
            onClick={() => {
              setCurrentPage(number); // Update the currentPage state variable
              paginate(number);
            }}
            className={`page-number ${
              currentPage === number ? "selected" : ""
            }`}
          >
            {number}
          </NavLink>
        ))}
        <li onClick={nextPage} className="next page-number">
          <FontAwesomeIcon icon={faArrowRight} />
        </li>
      </ul>
    </div>
  );
};

export default Paginate;
