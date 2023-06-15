import "./login.style.scss";
import React, { useContext, useState } from "react";
import "firebase/compat/auth";
import { UserContext } from "../../../context/user";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../utiles/firebase/firebase.utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
const Login = () => {
  const { user, setCurrentUser } = useContext(UserContext);
  const [Invalid, setInvalid] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [formField, setFormfield] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleShowPassword = () => {
    setViewPassword(!viewPassword);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setInvalid(false);

    try {
      const User = user.find(
        (item) =>
          item.username === formField.username &&
          item.password === formField.password
      );
      const userQuery = query(
        collection(db, "Users-Data"),
        where("id", "==", User.id)
      );
      const querySnapshot = await getDocs(userQuery);
      const updatedUserData = querySnapshot.docs.map((doc) => doc.data())[0];

      if (User) {
        sessionStorage.setItem("User", JSON.stringify(updatedUserData));

        if (User.role === "Admin") {
          navigate("/admin");
          setCurrentUser(JSON.parse(sessionStorage.getItem("User")) || {});
        } else if (User.role === "Student") {
          navigate("/student");
          setCurrentUser(JSON.parse(sessionStorage.getItem("User")) || {});
        } else if (User.role === "Panel") {
          navigate("/panel");
          setCurrentUser(JSON.parse(sessionStorage.getItem("User")) || {});
        } else if (User.role === "Supervisor") {
          navigate("/supervisor");
          setCurrentUser(JSON.parse(sessionStorage.getItem("User")) || {});
        } else if (User.role === "Company Owner") {
          navigate("/companyowner");
          setCurrentUser(JSON.parse(sessionStorage.getItem("User")) || {});
        }
      } else {
        setInvalid(true);
      }
    } catch (error) {
      setInvalid(true);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormfield({ ...formField, [name]: value });
  };
  console.log(formField);
  return (
    <div
      className="login-content"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgb(0, 0, 0, 0.7), rgb(0, 0, 0, 0.7)), url(./images/kust.jpg)`,
      }}
    >
      <div className="login-container">
        <h1 className="login-heading">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input">
            <label htmlFor="username">Username</label>
            <div className="login-field">
              <input
                type="text"
                id="username"
                name="username"
                value={formField.username}
                onChange={handleChange}
                readOnly
                onFocus={(e) => {
                  e.currentTarget.readOnly = false;
                }}
                required
              />
              <FontAwesomeIcon icon={faLock} className="login-icon" />
            </div>
          </div>
          <div className="login-input">
            <label htmlFor="password">Password</label>
            <div className="login-field">
              {viewPassword ? (
                <>
                  {" "}
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formField.password}
                    onChange={handleChange}
                    readOnly
                    onFocus={(e) => {
                      e.currentTarget.readOnly = false;
                    }}
                    required
                  />{" "}
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className="login-icon login-password"
                    onClick={handleShowPassword}
                  />
                </>
              ) : (
                <>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formField.password}
                    onChange={handleChange}
                    readOnly
                    onFocus={(e) => {
                      e.currentTarget.readOnly = false;
                    }}
                    required
                  />{" "}
                  <FontAwesomeIcon
                    icon={faEye}
                    className="login-icon login-password"
                    onClick={handleShowPassword}
                  />
                </>
              )}
            </div>
          </div>
          <input type="submit" className="login-btn" />
        </form>
        {Invalid && (
          <h2 className="invalid-detail">*Incorrect Uername and Password</h2>
        )}
      </div>
    </div>
  );
};
export default Login;
