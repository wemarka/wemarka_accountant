import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ تأكد من أن useNavigate يتم استخدامه داخل <Router>

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // تحديث حالة المستخدم
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/operations"); // ✅ الانتقال إلى صفحة العمليات
    } catch (err) {
      console.error("Login error:", err.code);
      switch (err.code) {
        case "auth/invalid-email":
          setError("البريد الإلكتروني غير صالح.");
          break;
        case "auth/user-not-found":
          setError("المستخدم غير موجود.");
          break;
        case "auth/wrong-password":
          setError("كلمة المرور غير صحيحة.");
          break;
        default:
          setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
      toast.error("فشل تسجيل الدخول. تحقق من البيانات.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">تسجيل الدخول</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
};

export default Login;
