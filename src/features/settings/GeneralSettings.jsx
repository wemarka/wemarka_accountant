import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "Wemarka",
    siteEmail: "admin@wemarka.com",
    sitePhone: "+123456789",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const saveSettings = () => {
    toast.success("تم حفظ الإعدادات بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">الإعدادات العامة</h1>
        <div className="mb-6">
          <label className="block mb-2">اسم الموقع</label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            name="siteEmail"
            value={settings.siteEmail}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">رقم الهاتف</label>
          <input
            type="text"
            name="sitePhone"
            value={settings.sitePhone}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={saveSettings}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
