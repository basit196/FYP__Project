import { Route, Routes } from "react-router-dom";
import "./App.scss";
import VisitorUser from "./users/visitoruser.componet";
import Admin from "./users/adminuser.component";
import Student from "./users/studentuser.component";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/user";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./utiles/firebase/firebase.utiles";
import Panel from "./users/panel.component";
import Supervisor from "./users/supervisor.component";
import CompanyOwner from "./users/companyowner.component";

const App = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "Users-Data"),
        where("id", "==", currentUser.id || "")
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const user = change.doc.data();

          if (change.type === "added" || change.type === "modified") {
            sessionStorage.setItem("User", JSON.stringify(user));
            setCurrentUser(user);
          } else if (change.type === "removed") {
            sessionStorage.clear();
            setCurrentUser({});
          }
        });
      }
    );
    return () => unsubscribe();
  }, [currentUser.id]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("User");
    if (storedUser) {
      setCurrentUser((prevUser) => {
        const newUser = JSON.parse(storedUser);
        if (prevUser.id !== newUser.id) {
          return newUser;
        }
        return prevUser;
      });
    }
  }, [setCurrentUser]);

  return (
    <Routes>
      {Object.keys(currentUser).length === 0 ? (
        <Route path="/*" element={<VisitorUser />} />
      ) : (
        <>
          {currentUser.role === "Admin" && (
            <Route path="admin/*" element={<Admin />} />
          )}
          {currentUser.role === "Student" && (
            <Route path="student/*" element={<Student />} />
          )}
          {currentUser.role === "Panel" && (
            <Route path="panel/*" element={<Panel />} />
          )}
          {currentUser.role === "Supervisor" && (
            <Route path="supervisor/*" element={<Supervisor />} />
          )}
          {currentUser.role === "Company Owner" && (
            <Route path="companyowner/*" element={<CompanyOwner />} />
          )}
        </>
      )}
    </Routes>
  );
};

export default App;
