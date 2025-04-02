import React, { useState } from "react";
import TaskManagement from "./TaskManagement";
import ProjectManagement from "./ProjectManagement";
import CustomerManagement from "./CustomerManagement";
import BranchManagement from "./BranchManagement";

const Management = () => {
  const [activeTab, setActiveTab] = useState("tasks");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks":
        return <TaskManagement />;
      case "projects":
        return <ProjectManagement />;
      case "customers":
        return <CustomerManagement />;
      case "branches":
        return <BranchManagement />;
      default:
        return <TaskManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">الإدارة</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "tasks" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            المهام
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "projects" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            المشاريع
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "customers" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            العملاء
          </button>
          <button
            onClick={() => setActiveTab("branches")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "branches" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            الفروع
          </button>
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Management;
