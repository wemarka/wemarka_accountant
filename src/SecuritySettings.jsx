import React, { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SecuritySettings = () => {
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">الإعدادات الأمنية</h1>
        <form onSubmit={handleChangePassword}>
          <div className="mb-6">
            <label className="block mb-2">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            تغيير كلمة المرور
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
