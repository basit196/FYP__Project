import "./updaterequest.styles.scss";
import { default as ReactSelect } from "react-select";
import { Role } from "../../Data/roledata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/user";
import { storage, updateData } from "../../utiles/firebase/firebase.utiles";
const UpdateRequestIdea = ({ item, text }) => {
  const { setClickEdit, user } = useContext(UserContext);
  const [inputdata, setInputData] = useState(item);
  const [registeruser, setRegisterUser] = useState(false);
  const [radiobtn, setRadioBtn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usernameUsed, setUsernameUsed] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(item.role);
  const [usenameInvalid, setUsenameInvalid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (item.image) {
      storage
        .ref(`images/${item.image}`)
        .getDownloadURL()
        .then((url) => {
          setSelectedFile(url);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [item.image]);

  const inputType = showPassword ? "text" : "password";
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputData({ ...inputdata, [name]: value });
  };

  const handleOptionChange = (name) => {
    const lowercaseName = name.toLowerCase();
    const selectedRole = Role.find((role) => role.label === name);
    let usernameFormat = selectedRole.usernameFormat;
    if (lowercaseName === "role") {
      setRadioBtn(false);

      setInputData({ ...inputdata, role: "", username: usernameFormat });
    } else {
      setInputData({
        ...inputdata,
        role: name,
        username: usernameFormat,
      });
    }

    if (name === "Student") {
      setRadioBtn(true);
    }
    if (
      name === "Supervisor" ||
      name === "Admin" ||
      name === "Panel" ||
      name === "Company owner"
    ) {
      setRadioBtn(false);
      const Users = user.filter((user) => user.role === name);
      let userNumber = Users.length + 1;
      const selectedRole = Role.find((role) => role.label === name);
      let usernameFormat = selectedRole.usernameFormat;
      const incrementedFormat = usernameFormat.replace(
        "N",
        userNumber.toString()
      );
      if (incrementedFormat) {
        setInputData({
          ...inputdata,
          role: name,
          username: incrementedFormat,
        });
      }
    }
  };
  const handleRadioChange = (event) => {
    const { value } = event.target;
    if (value === "CS" || value === "SE") {
      const department = value.toUpperCase();
      const studentUsers = user.filter(
        (user) => user.role === "Student" && user.department === value
      );

      let userNumber = studentUsers.length + 1;
      const currentYear = new Date().getFullYear();
      const fourYearsBackYear = currentYear - 4;

      const selectedRole = Role.find((role) => role.label === "Student");
      let usernameFormat = selectedRole.usernameFormat;
      const updateddept = usernameFormat.replace("DE", department);
      const incrementedFormat = updateddept.replace("N", userNumber.toString());
      const updatedUserNameFormat = incrementedFormat.replace(
        "Y",
        fourYearsBackYear
      );
      if (updatedUserNameFormat) {
        setInputData((prevFormData) => ({
          ...prevFormData,
          username: updatedUserNameFormat,
          department: value,
        }));
      } else {
        console.error("Invalid username format for the selected role");
      }
    }
  };
  function handleImageUpload(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    const fileName = file.name;

    reader.onload = (event) => {
      setSelectedFile(file);
      setInputData({ ...inputdata, image: fileName });
    };

    reader.readAsDataURL(file);
  }

  //check the username format is valid
  const isValidUsernameFormat = (username, value) => {
    const regex = Role.find((role) => role.label === value);
    let usernameRegex;
    if (value === "Student") {
      usernameRegex = /(CS|SE)[1]\d{4}[2]\d+/;
    } else {
      const newRegex = regex.usernameFormat.replace(/N/g, "[0-9]+");
      usernameRegex = new RegExp(`^${newRegex}$`);
    }
    return usernameRegex.test(username);
  };
  //when the data is ready to sumbit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUsernameUsed(false);
    setUsenameInvalid(false);

    if (isValidUsernameFormat(inputdata.username, inputdata.role)) {
      //find that the username is exist or not
      const usernameChanged = inputdata.username !== item.username;

      // Find existing usernames only when a new username is entered
      const findExistingUserName =
        usernameChanged &&
        user
          .filter((key) => key.role === inputdata.role)
          .some((item) => item.username === inputdata.username);

      if (!findExistingUserName) {
        try {
          let image; // Validate username format
          if (selectedFile) {
            const uploadTask = storage
              .ref(`images/${selectedFile.name}`)
              .put(selectedFile);
            await uploadTask;

            const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
            image = imageUrl;
          }

          updateData("Users-Data", {
            id: inputdata.id,
            Name: inputdata.Name || "",
            username: inputdata.username || "",
            password: inputdata.password || "",
            Email: inputdata.Email || "",
            department: inputdata.department || "",
            image: image ? image : "",
            role: inputdata.role || "",
          });
          sessionStorage.setItem(
            "User",
            JSON.stringify({
              id: inputdata.id,
              Name: inputdata.Name || "",
              username: inputdata.username || "",
              password: inputdata.password || "",
              Email: inputdata.Email || "",
              department: inputdata.department || "",
              image: image ? image : "",
              role: inputdata.role || "",
            })
          );

          // Perform any actions that depend on the image URL here
          setRegisterUser(true);
          setSelectedFile(null);
          console.log("change successfully!");
          // Reset form data
          setInputData(item);

          setDropdownValue(null);
          setClickEdit(false);

          document.getElementById("file-upload").value = "";
        } catch (error) {
          console.error("Error registering user:", error);
        }
      } else {
        setUsernameUsed(true);
      }
    } else {
      setUsenameInvalid(true);
    }
  };
  const closeEdit = () => {
    setClickEdit(false);
  };
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
      height: "7rem",
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
    <div className="updated-table-row">
      <div className="updated-table-row-close">
        <FontAwesomeIcon icon={faClose} onClick={closeEdit} />
      </div>
      <div className="updated-table-row-container">
        <div className="updated-table-row-container-head">
          <span className="updated-table-row-container-head-item">
            <span className="updated-table-row-container-bold">Id:</span>
            <span>{inputdata.id}</span>
          </span>
          <span className="updated-table-row-container-head-item">
            <span className="updated-table-row-container-bold">
              Collection:
            </span>
            <span>{text}</span>
          </span>
        </div>
        <form onSubmit={handleSubmit} className="updated-table-row-form">
          <input
            id="name"
            type="text"
            name="Name"
            value={inputdata.Name}
            defaultValue=""
            placeholder="Name"
            className="register-user-input"
            onChange={handleChange}
            required
          />
          <input
            id="username"
            type="text"
            name="username"
            value={inputdata.username}
            defaultValue=""
            placeholder="Username"
            className="register-user-input"
            onChange={handleChange}
            required
          />
          {usernameUsed && (
            <label htmlFor="username" className="invaild-username">
              user name is Taken
            </label>
          )}
          {usenameInvalid && (
            <label htmlFor="username" className="invaild-username">
              username format is Invalid
            </label>
          )}
          <div className="password-container">
            <input
              id="password"
              type={inputType}
              name="password"
              value={inputdata.password}
              defaultValue=""
              placeholder="Password"
              className="register-user-input"
              autoComplete="new-password"
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={handlePasswordToggle}
            />
          </div>
          <input
            id="email"
            type="email"
            name="Email"
            value={inputdata.Email}
            defaultValue=""
            placeholder="Email"
            className="register-user-input"
            onChange={handleChange}
          />
          <input
            type="file"
            name="image"
            id="file-upload"
            accept=".jpg"
            onChange={handleImageUpload}
          />
          <ReactSelect
            isSearchable
            options={Role}
            className="Role-drop-down"
            placeholder={dropdownValue}
            styles={colourStyles}
            onChange={(selectedOption) => {
              handleOptionChange(selectedOption.label);
              setDropdownValue(selectedOption);
            }}
          />{" "}
          <button type="submit" className="update-button">
            Update
          </button>{" "}
        </form>
        {registeruser ? (
          <p className="user-registered">Change successfully</p>
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
export default UpdateRequestIdea;
