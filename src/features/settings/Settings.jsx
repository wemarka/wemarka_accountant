import React, { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import AdvancedSettings from "./AdvancedSettings";
import SecuritySettings from "./SecuritySettings";
import AdvancedConfiguration from "./AdvancedConfiguration";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "advanced":
        return <AdvancedSettings />;
      case "security":
        return <SecuritySettings />;
      case "configuration":
        return <AdvancedConfiguration />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "general" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            الإعدادات العامة
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "advanced" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            الإعدادات المتقدمة
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "security" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            الإعدادات الأمنية
          </button>
          <button
            onClick={() => setActiveTab("configuration")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "configuration" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            الإعدادات المتقدمة للنظام
          </button>
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Settings;