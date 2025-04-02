import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, addUserToFirestore } from "./firebase"; // استيراد addUserToFirestore
import { db } from "./firebase"; // استيراد db من firebase.js
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addUserToFirestore(userCredential.user); // إضافة المستخدم إلى Firestore
      setSuccess("تم إنشاء الحساب بنجاح!");
      setError("");
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">إنشاء حساب جديد</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          إنشاء حساب
        </button>
        <p className="text-center mt-4">
          ليس لديك حساب؟ <Link to="/register" className="text-blue-500">إنشاء حساب</Link>
        </p>
      </form>
    </div>
  );
};

const App = () => {
  const [operations, setOperations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchOperations = async () => {
        const querySnapshot = await getDocs(collection(db, "operations"));
        const operationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOperations(operationsData);
      };

      fetchOperations();
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/reports"
          element={
            operations && operations.length > 0 ? (
              <Reports operations={operations} />
            ) : (
              <p className="text-center text-gray-500">لا توجد بيانات لعرضها.</p>
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;