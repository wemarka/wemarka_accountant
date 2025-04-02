// src/firebase.js
// ملاحظة: تأكد من أن بيانات Firebase سرية ولا يتم مشاركتها علنًا.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBs-mipVMAVLd4JlO7yfyzfN2iTjKIMEbg",
  authDomain: "wemarka-system.firebaseapp.com",
  projectId: "wemarka-system",
  storageBucket: "wemarka-system.appspot.com",
  messagingSenderId: "465072491204",
  appId: "1:465072491204:web:6582e62c941a2355135791"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// إضافة مستخدم جديد إلى قاعدة البيانات
export const addUserToFirestore = async (user) => {
  try {
    await setDoc(doc(collection(db, "users"), user.uid), {
      email: user.email,
      role: "user", // افتراضيًا، المستخدم هو "user"
    });
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};