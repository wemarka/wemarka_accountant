import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const fetchOperationsFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "operations"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error("فشل في جلب البيانات");
  }
};

export const loginUser = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error("فشل تسجيل الدخول");
  }
};

export const logoutUser = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("فشل تسجيل الخروج");
  }
};
