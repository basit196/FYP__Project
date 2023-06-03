import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/firestore";
import "firebase/compat/storage";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDk6TzioT9iqITmmanL_WzRqxW2hpTEzX4",
  authDomain: "fyp-project-be481.firebaseapp.com",
  projectId: "fyp-project-be481",
  storageBucket: "fyp-project-be481.appspot.com",
  messagingSenderId: "279512537495",
  appId: "1:279512537495:web:9435dcdea1b6019b79ccd2",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const addcollectionAndDocument = async (collectionKey, array) => {
  const Collection = collection(db, collectionKey);

  array.forEach((obj) => {
    // Use the ID as the document ID when adding the data to Firestore
    const docRef = doc(Collection, obj.id);
    setDoc(docRef, obj);
  });
  console.log("dONE");
};

//get  colllection from firebase

export const getColllectionData = async (collectionKey) => {
  const userQuery = query(collection(db, collectionKey));
  const querySnapshot = await getDocs(userQuery);
  const updatedUserData = querySnapshot.docs.map((doc) => doc.data());
  return updatedUserData;
};
//add data in existing collection and document
export const addDataInExistingColAndDoc = async (
  collectionKey,
  objectToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const docRef = doc(collectionRef, objectToAdd.id);
  const docSnapshot = await getDoc(docRef);
  const existingData = docSnapshot.exists() ? docSnapshot.data() : {};

  const dataToUpdate = {
    ...existingData,
    ...objectToAdd,
  };

  await setDoc(docRef, dataToUpdate);
  console.log("done");
};
export const handleDeletedocument = (collectionKey, id) => {
  // Delete the row from Firestore
  firebase
    .firestore()
    .collection(collectionKey)
    .doc(id)
    .delete()
    .then(() => {
      // If deletion is successful, update the state to remove the deleted row
      console.log("Row deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting row:", error);
    });
};
export const updateData = async (collectionKey, objectToAdd) => {
  const collectionRef = collection(db, collectionKey);
  const docRef = doc(collectionRef, objectToAdd.id);
  await updateDoc(docRef, objectToAdd);
  console.log("Changes saved successfully!");
};
