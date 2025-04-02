import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedSettings = () => {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    enableDarkMode: false,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success(`تم تحديث الإعداد: ${key}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إعدادات متقدمة</h1>
        <div className="mb-6">
          <label className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={() => handleToggle("enableNotifications")}
              className="w-5 h-5"
            />
            <span>تفعيل الإشعارات</span>
          </label>
        </div>
        <div className="mb-6">
          <label className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={settings.enableDarkMode}
              onChange={() => handleToggle("enableDarkMode")}
              className="w-5 h-5"
            />
            <span>تفعيل الوضع الداكن</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
