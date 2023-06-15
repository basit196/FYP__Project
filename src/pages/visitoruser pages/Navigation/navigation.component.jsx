import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Outlet } from "react-router-dom";
import { ReactComponent as Logo } from "../../../assests/fyp.svg";
import { ReactComponent as KustLogo } from "../../../assests/kust.svg";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./navigation.styles.scss";
const Navigation = () => {
  function sidebar() {
    let x = document.getElementById("nav");
    let smallScreenMediaQuery = window.matchMedia("(max-width: 1200px)");
    if (smallScreenMediaQuery.matches) {
      if (x.style.display === "none") {
        x.style.display = "flex";
      } else {
        x.style.display = "none";
      }
    } else {
      if (x.style.display === "none") {
        x.style.display = "flex";
      }
    }
  }

  return (
    <div className="navigation-page">
      <div className="menu-bar">
        <NavLink className="logo-container" to="/">
          <Logo className="logo" />
        </NavLink>
        <div className="nav-container" id="nav">
          <NavLink
            className={({ isActive }) =>
              isActive ? "active_tab nav-link" : "nav-link"
            }
            to="/"
          >
            Home
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive ? "active_tab nav-link" : "nav-link"
            }
            to="/ideas"
          >
            Ideas
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "active_tab nav-link" : "nav-link"
            }
            to="/projects"
          >
            Projects
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "active_tab nav-link" : "nav-link"
            }
            to="/impact"
          >
            Top Pick
          </NavLink>
    
       
          <NavLink
            className={({ isActive }) =>
              isActive ? "active_tab nav-link" : "nav-link"
            }
            to="/authentication"
          >
            {" "}
            Login
          </NavLink>
        </div>
        <div className="kust-logo-container">
          <NavLink className="burger-menu-bar" to="#" onClick={() => sidebar()}>
            <FontAwesomeIcon icon={faBars} />
          </NavLink>
          <NavLink className="kust-logo-container" to="/">
            <KustLogo className="kust-logo" />
          </NavLink>
        </div>
      </div>
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};
export default Navigation;
