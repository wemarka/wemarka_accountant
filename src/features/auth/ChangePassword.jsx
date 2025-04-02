import React, { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        toast.success("تم تغيير كلمة المرور بنجاح!");
      } else {
        setError("يجب تسجيل الدخول لتغيير كلمة المرور.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("حدث خطأ أثناء تغيير كلمة المرور. حاول مرة أخرى.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">تغيير كلمة المرور</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          تغيير كلمة المرور
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
