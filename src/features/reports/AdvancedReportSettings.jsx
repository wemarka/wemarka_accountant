import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedReportSettings = () => {
  const [settings, setSettings] = useState({
    defaultExportFormat: "Excel",
    includeSummary: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success(`تم تحديث الإعداد: ${key}`);
  };

  const handleFormatChange = (e) => {
    setSettings((prev) => ({ ...prev, defaultExportFormat: e.target.value }));
    toast.success("تم تحديث تنسيق التصدير الافتراضي!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إعدادات التقارير المتقدمة</h1>
        <div className="mb-6">
          <label className="block mb-2">تنسيق التصدير الافتراضي</label>
          <select
            value={settings.defaultExportFormat}
            onChange={handleFormatChange}
            className="border p-2 rounded w-full"
          >
            <option value="Excel">Excel</option>
            <option value="PDF">PDF</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={settings.includeSummary}
              onChange={() => handleToggle("includeSummary")}
              className="w-5 h-5"
            />
            <span>تضمين ملخص في التقارير</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReportSettings;
