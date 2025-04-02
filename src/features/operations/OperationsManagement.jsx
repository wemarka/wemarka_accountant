import React, { useState } from "react";
import Operations from "./Operations";
import InvoiceManagement from "./InvoiceManagement";
import SalesManagement from "./SalesManagement";

const OperationsManagement = () => {
  const [activeTab, setActiveTab] = useState("operations");

  const renderTabContent = () => {
    switch (activeTab) {
      case "operations":
        return <Operations />;
      case "invoices":
        return <InvoiceManagement />;
      case "sales":
        return <SalesManagement />;
      default:
        return <Operations />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">إدارة العمليات</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("operations")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "operations" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            العمليات
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "invoices" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            الفواتير
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "sales" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            المبيعات
          </button>
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default OperationsManagement;
