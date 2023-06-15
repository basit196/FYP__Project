import React, { useContext, useState, useEffect } from "react";
import "./RegisterUser.styles.scss";
import { default as ReactSelect } from "react-select";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import FormTitle from "../../../component/formtiltle component/formtitle.component";
import { UserContext } from "../../../context/user";

import {
  addDataInExistingColAndDoc,
  db,
  storage,
} from "../../../utiles/firebase/firebase.utiles";
import { Role } from "../../../Data/roledata";
import { collection, getDocs, query } from "firebase/firestore";
const RegisterUser = () => {
  //get user data from usercontext and usersize from context
  const { user } = useContext(UserContext);
  const [registeruser, setRegisterUser] = useState(false);
  const [radiobtn, setRadioBtn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usernameUsed, setUsernameUsed] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(Role[0].label);
  const [usenameInvalid, setUsenameInvalid] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    image: "",
    department: "",
    role: "",
  });

  useEffect(() => {
    const userdata = async () => {
      const userQuery = query(collection(db, "Users-Data"));
      const querySnapshot = await getDocs(userQuery);
      const updatedUserData = querySnapshot.docs.map((doc) => doc.data());
      const maxId = updatedUserData.reduce((max, currentUser) => {
        const userId = parseInt(currentUser.id);
        return userId > max ? userId : max;
      }, 0);
      const idnumber = maxId + 1;
      setFormData((prevFormData) => ({
        ...prevFormData,
        id: idnumber.toString(),
      }));
    };
    userdata();
  }, [registeruser, user]);
  useEffect(() => {
    setTimeout(() => {
      setRegisterUser(false);
    }, 4000);
  }, [registeruser]);
  //every input data comes here and change the formData
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setUsernameUsed(false);
  };
  //every Option of role Dropdown comes here change the formData
  const handleOptionChange = async (name) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName === "role") {
      setRadioBtn(false);
      setFormData({ ...formData, role: "" });
    } else {
      setFormData({
        ...formData,
        role: name,
      });
    }

    if (name === "Student") {
      setRadioBtn(true);
    }
    if (
      name === "Supervisor" ||
      name === "Admin" ||
      name === "Panel" ||
      name === "Company Owner"
    ) {
      setRadioBtn(false);
      setFormData({
        ...formData,
        role: name,
      });
    }
  };
  //when click on radio btns
  const handleRadioChange = async (event) => {
    const { value } = event.target;
    if (value === "CS" || value === "SE") {
      const department = value.toUpperCase();
      setFormData((prevFormData) => ({
        ...prevFormData,
        department: department,
      }));
    }
  };
  //every image upload file is come here
  function handleImageUpload(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;

    reader.onload = (event) => {
      setSelectedFile(file);
      setFormData({ ...formData, image: fileName });
    };

    reader.readAsDataURL(file);
  }
  //check the username format is valid

  //when the data is ready to sumbit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUsernameUsed(false);
    setUsenameInvalid(false);

    //find that the username is exist or not
const findExistingUserName = user.some((item) => {
  const lowercaseUsername =
    typeof item.username === "string" ? item.username.toLowerCase() : undefined;

  return lowercaseUsername === formData.username.toLowerCase();
});    if (!findExistingUserName) {
      try {
        // Validate username format
        let image = "";
        if (selectedFile) {
          const uploadTask = storage
            .ref(`images/${selectedFile.name}`)
            .put(selectedFile);
          await uploadTask;
          const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
          image = imageUrl;
        }

        await addDataInExistingColAndDoc("Users-Data", {
          id: formData.id,
          Name: formData.name,
          username: formData.username,
          password: formData.password,
          Email: formData.email,
          department: formData.department,
          image: image ? image : "",
          role: formData.role,
        });
        // Perform any actions that depend on the image URL here

        setRegisterUser(true);
        setSelectedFile(null);
        console.log("User registered successfully!");
        // Reset form data
        setFormData({
          id: "",
          name: "",
          username: "",
          email: "",
          password: "",
          image: "",
          department: "",
          role: "",
        });
        setDropdownValue(null);
      } catch (error) {
        console.error("Error registering user:", error);
      }
    } else {
      setUsernameUsed(true);
    }
  };
  console.log(formData);
  const colourStyles = {
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#868686",
        background: "#ddddddd",
      };
    },
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgba(189,197,209,.3)" : "white",
    }),
    menuList: (base) => ({
      ...base,
      height: "5rem",
      "::-webkit-scrollbar": {
        width: ".9rem",
        height: "8rem",
      },
      "::-webkit-scrollbar-track": {
        background: "#d9d9d9",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#868686",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#284b63",
      },
    }),
  };

  return (
    <div className="register-user-container">
      <div className="register-user">
        <FormTitle icon="" text={"New User Registration Form"} />

        <form onSubmit={handleSubmit} className="register-user-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="register-user-input"
            required
          />
          <div className="username-input">
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="register-user-input"
              autoFocus={formData.username}
              required
            />
            {usernameUsed && (
              <label htmlFor="username" className="invaild-username">
                user name is Taken
              </label>
            )}
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="register-user-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="register-user-input"
            required
          />
          <div>
            <input
              type="file"
              name="image"
              id="file-upload"
              accept=".jpg"
              onChange={handleImageUpload}
            />
          </div>
          <div className="register-user-dropdown">
            <ReactSelect
              isSearchable
              onChange={(selectedOption) => {
                handleOptionChange(selectedOption.label);
                setDropdownValue(selectedOption);
              }}
              options={Role}
              className="Role-drop-down"
              placeholder={Role[0].label}
              styles={colourStyles}
              value={dropdownValue}
              required
            />

            <button type="submit" className="register-user-button">
              Register User
            </button>
          </div>
        </form>
        {registeruser ? (
          <p className="user-registered">user register successfully</p>
        ) : (
          <></>
        )}

        {radiobtn && (
          <div className="radio-btn">
            <input
              type="radio"
              name="department"
              value="CS"
              onChange={handleRadioChange}
              id="cs"
            />
            <label htmlFor="cs">CS</label>

            <input
              type="radio"
              name="department"
              value="SE"
              onChange={handleRadioChange}
              id="se"
            />
            <label htmlFor="se">SE</label>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;
