import "./userNavigation.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ReactComponent as FYPLogo } from "../../../assests/fyp.svg";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../context/user";
import SelectPicture from "../../../component/selectpicture/selectpicture";
import { ProjectContext } from "../../../context/projectcontext";

const UserNavigation = ({ item }) => {
  const { currentUser, setCurrentUser, image, setimage } =
    useContext(UserContext);
  const { setFilterProjects } = useContext(ProjectContext);
  const location = useLocation();
  const handleChange = () => {
    setFilterProjects([]);
  };

  const handleLogout = async () => {
    setCurrentUser({});
    sessionStorage.clear();
  };
  const handleImageUpload = () => {
    setimage(true);
  };
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-logo-container">
          <NavLink className="sidebar-logo" to="/">
            <FYPLogo className="logo" />
          </NavLink>
        </div>
        <div className="sidebar-container">
          {item.links.map((item) => {
            return (
              <NavLink
                className={
                  item.to === location.pathname
                    ? "sidebar-active sidebar-link"
                    : "sidebar-link"
                }
                to={item.to}
                onClick={handleChange}
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.link}
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="main">
        <div className="profile">
          <div className="profile-info">
            <div className="profile-container">
              <div className="profile-image-container">
                {currentUser.image ? (
                  <div className="empty-profile-image">
                    <img src={currentUser.image} />
                    <label
                      htmlFor="profile-image-input"
                      className="custom-file-upload"
                    >
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="upload-icon"
                        onClick={handleImageUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="empty-profile-image">
                    <img src="/images/empty-profile.png" />
                    <label
                      htmlFor="profile-image-input"
                      className="custom-file-upload"
                    >
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="upload-icon"
                        onClick={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <h2 className="profile-text">{item.Role}</h2>

            <div className="logoutbtn">
              <Link to="/authentication" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      {image && <SelectPicture />}
    </div>
  );
};
export default UserNavigation;
