import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { IdeaContext } from "../../../../context/ideascontext";
import { db } from "../../../../utiles/firebase/firebase.utiles";
import { default as ReactSelect } from "react-select";
import { UserContext } from "../../../../context/user";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Remark, Remarks, Status } from "../../../../Data/StatusData";
import { colourStyles } from "../../../../component/filter component/filterstyle";
import "./middefensepopup.styles.scss";
const MidDefensePopUp = ({ item, sTatus }) => {
  const { user } = useContext(UserContext);
  const { setIsView } = useContext(IdeaContext);
  const [updatedItem, setUpdatedItem] = useState(item);
  const [Comments, setComments] = useState("");
  const [remarks, setRemarks] = useState("");
  const [studentArray, setStudentArray] = useState([]);
  useEffect(() => {
    if (item.id) {
      const itemRef = doc(db, "Project-data", item.id);
      const unsubscribe = onSnapshot(itemRef, (snapshot) => {
        if (snapshot.exists()) {
          setUpdatedItem(snapshot.data());
        }
      });

      return () => unsubscribe();
    }
  }, [item.id]);
  const closeEdit = () => {
    setIsView(false);
  };
  const handleOptionChange = (label) => {
    setRemarks(label);
  };console.log(sTatus);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sTatus === "Mid") {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      const newComment = {
        description: Comments,
        date: `${year}-${month}-${day}`,
      };

      try {
        const docRef = doc(db, "Project-data", item.id);
        await updateDoc(docRef, {
          comments: arrayUnion(newComment),
          remarks: remarks,
          status: "In Progress",
        });
        console.log("hello g");
        setIsView(false);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    } else {
      if (remarks === "") {
        console.log("error");
      } else {
        try {
          const docRef = doc(db, "Project-data", item.id);
          await updateDoc(docRef, {
            remarks: remarks,
            status: "Completed",
            Student: studentArray,
          });

          const projectDataRef = collection(db, "Project-data");
          const midDefenseQuery = query(
            projectDataRef,
            where("IsDefense", "==", "Mid")
          );
          const midDefenseSnapshot = await getDocs(midDefenseQuery);

          midDefenseSnapshot.forEach(async (docs) => {
            const midDefenseData = docs.data();
            const midDefenseStudentArray = midDefenseData.Student;

            const finalStudentArray = item.Student.map((student) => {
              const midDefenseStudent = midDefenseStudentArray.find(
                (midDefenseStudent) => midDefenseStudent.id === student.id
              );

              if (midDefenseStudent) {
                return { ...midDefenseStudent };
              }

              return { ...student };
            });

            const docRef = doc(db, "Project-data", docs.id);
            await updateDoc(docRef, {
              Student: studentArray,
            });
          });
          setStudentArray([]);
          setIsView(false);
        } catch (error) {
          console.error("Error updating document:", error);
        }
      }
    }
  };
  useEffect(() => {
    // Initialize the student grades with the default values
    if (item.Student) {
      const initialGrades = item.Student.map((student) => ({
        id: student.id,
        grade: 0,
      }));
      setStudentArray(initialGrades);
    }
  }, [item.Student]);

  const handleStudentChange = (event, studentId) => {
    const { name, value } = event.target;

    let updatedValue = parseInt(value, 10);

    if (name === "grade") {
      updatedValue = Math.min(Math.max(updatedValue, 0), 100);
    }

    setStudentArray((prevGrades) => {
      const updatedGrades = prevGrades.map((gradeObj) => {
        if (gradeObj.id === studentId) {
          return { ...gradeObj, grade: updatedValue };
        }
        return gradeObj;
      });

      return updatedGrades;
    });
  };

  const handleCommentChange = (e) => {
    setComments(e.target.value);
  };
  return (
    <div className="view-proposal-popup">
      <div className="updated-table-row-close">
        <FontAwesomeIcon icon={faClose} onClick={closeEdit} />
      </div>
      {sTatus === "Mid" ? (
        <div className="defense-report">
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Title: </h2>
            <p className="defense-report-text">{item.title} </p>
          </div>
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Supervisor: </h2>
            {item.supervisor &&
              user
                .filter((users) => users.id === item.supervisor.id)
                .map((supervisor) => {
                  return <p>{supervisor.Name}</p>;
                })}
          </div>
          <div className="defense-report-col">
            <h2 className="defense-report-h2">Student Names: </h2>

            <p className="defense-report-text">
              <div className="defense-report-text">
                {item.Student &&
                  item.Student.map((student, index) => {
                    const studentFind =
                      user &&
                      user.find((studentItem) => student.id === studentItem.id);
                    return (
                      <span key={student.id} className="defense-report-text">
                        {index + 1}
                        {")"}
                        {studentFind && studentFind.Name} -{" "}
                        {studentFind && studentFind.username}
                      </span>
                    );
                  })}
              </div>
            </p>
          </div>
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Document File:</h2>
            <a href={item.document && item.document} target="_blank">
              View Here
            </a>
          </div>
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Presentation File:</h2>
            <a href={item.presentation && item.presentation} target="_blank">
              Download Here
            </a>
          </div>
          <div className="defense-report-checking">
            <h2 className="defense-report-h2">Performance Assessment:</h2>
            <label>Status:</label>
            <ReactSelect
              isSearchable
              onChange={(selectedOption) =>
                handleOptionChange(selectedOption.label)
              }
              options={Remark[0].options}
              className="select-drop-down"
              placeholder="Remarks"
              styles={colourStyles}
              required
            />{" "}
            <br />
            <label>Comments:</label>
            <textarea
              value={Comments}
              onChange={handleCommentChange}
            ></textarea>
            <br />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      ) : (
        <div className="defense-report">
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Title: </h2>
            <p className="defense-report-text">{item.title} </p>
          </div>
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Supervisor: </h2>
            {item.supervisor &&
              user
                .filter((users) => users.id === item.supervisor.id)
                .map((supervisor) => {
                  return <p>{supervisor.Name}</p>;
                })}
          </div>

          <div className="defense-report-row">
            <h2 className="defense-report-h2">Document File:</h2>
            <a href={item.document && item.document} target="_blank">
              View Here
            </a>
          </div>
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Document File:</h2>
            <a href={item.document && item.document} target="_blank">
              View Here
            </a>
          </div>
          <div className="defense-report-row">
            <h2 className="defense-report-h2">Presentation File:</h2>
            <a href={item.presentation && item.presentation} target="_blank">
              Download Here
            </a>
          </div>
          <div className="defense-report-checking">
            <h2 className="defense-report-h2">Performance Assessment:</h2>
            <label>Status:</label>
            <ReactSelect
              isSearchable
              onChange={(selectedOption) =>
                handleOptionChange(selectedOption.label)
              }
              options={Remarks[0].options}
              className="select-drop-down"
              placeholder="Remarks"
              styles={colourStyles}
              required
            />{" "}
            <div className="defense-report-col">
              <h2 className="defense-report-h2">Student Names: </h2>

              <p className="defense-report-text">
                <div className="defense-report-text">
                  {item.Student &&
                    item.Student.map((student, index) => {
                      const studentFind =
                        user &&
                        user.find(
                          (studentItem) => student.id === studentItem.id
                        );
                      return (
                        <span key={student.id} className="defense-report-text">
                          {index + 1}
                          {")"}
                          {studentFind && studentFind.Name} -{" "}
                          {studentFind && studentFind.username}
                          <input
                            id={student.id}
                            key={student.id}
                            type="number"
                            name="grade"
                            value={
                              studentArray.find(
                                (Students) => Students.id === student.id
                              )?.grade || ""
                            }
                            className="register-user-input"
                            onChange={(event) =>
                              handleStudentChange(event, student.id)
                            }
                            min={0}
                            max={100}
                            required
                          />{" "}
                        </span>
                      );
                    })}
                </div>
              </p>
            </div>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default MidDefensePopUp;
