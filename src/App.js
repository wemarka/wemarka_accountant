import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Operations from "./Operations";
import Settings from "./Settings";
import Reports from "./Reports";
import Login from "./Login";
import Register from "./Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, auth } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const App = () => {
  const [operations, setOperations] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const fetchOperations = async () => {
        const querySnapshot = await getDocs(collection(db, "operations"));
        const operationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched operations:", operationsData);
        setOperations(operationsData);
      };

      fetchOperations();
    }
  }, [user]);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="font-bold text-lg">
              العمليات المالية
            </Link>
            <Link to="/settings" className="font-bold text-lg">
              الإعدادات
            </Link>
            <Link to="/reports" className="font-bold text-lg">
              التقارير
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              تسجيل الخروج
            </button>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Operations operations={operations} />} />
          <Route path="/settings" element={<Settings />} />
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
      </div>
    </Router>
  );
};

export default App;