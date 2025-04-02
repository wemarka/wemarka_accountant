import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomNotificationsManagement = () => {
  const [notification, setNotification] = useState({ title: "", message: "" });

  const handleSendNotification = () => {
    if (!notification.title || !notification.message) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    toast.success("تم إرسال الإشعار بنجاح!");
    setNotification({ title: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة الإشعارات المخصصة</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="عنوان الإشعار"
            value={notification.title}
            onChange={(e) => setNotification({ ...notification, title: e.target.value })}
            className="border p-2 rounded w-full mb-4"
          />
          <textarea
            placeholder="محتوى الإشعار"
            value={notification.message}
            onChange={(e) => setNotification({ ...notification, message: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleSendNotification}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          إرسال الإشعار
        </button>
      </div>
    </div>
  );
};

export default CustomNotificationsManagement;
