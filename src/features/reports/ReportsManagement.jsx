import React, { useState } from "react";
import Reports from "./Reports";
import ExportReports from "./ExportReports";
import AdvancedReports from "./AdvancedReports";

const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState("reports");

  const renderTabContent = () => {
    switch (activeTab) {
      case "reports":
        return <Reports />;
      case "export":
        return <ExportReports />;
      case "advanced":
        return <AdvancedReports />;
      default:
        return <Reports />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">إدارة التقارير</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "reports" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            التقارير
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "export" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            تصدير التقارير
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "advanced" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            التقارير المتقدمة
          </button>
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ReportsManagement;
