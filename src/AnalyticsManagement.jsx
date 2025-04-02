import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import AdvancedAnalytics from "./AdvancedAnalytics";
import InteractiveReports from "./InteractiveReports";

const AnalyticsManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ جلب البيانات الافتراضية للإحصائيات
    const fetchOperations = async () => {
      try {
        // استبدل هذا الجزء بعملية جلب البيانات الحقيقية إذا كانت متوفرة
        const mockData = [
          { id: 1, type: "دخل", amount: 500, date: new Date() },
          { id: 2, type: "مصروف", amount: 300, date: new Date() },
          { id: 3, type: "دخل", amount: 700, date: new Date() },
          { id: 4, type: "مصروف", amount: 400, date: new Date() },
        ];
        setOperations(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching operations:", error);
      }
    };

    fetchOperations();
  }, []);

  const renderTabContent = () => {
    if (loading) {
      return <div className="text-center mt-10">جاري تحميل البيانات...</div>;
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard operations={operations} />;
      case "advanced":
        return <AdvancedAnalytics operations={operations} />;
      case "interactive":
        return <InteractiveReports operations={operations} />;
      default:
        return <Dashboard operations={operations} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">إدارة الإحصائيات</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            لوحة التحكم
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "advanced" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            الإحصائيات المتقدمة
          </button>
          <button
            onClick={() => setActiveTab("interactive")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "interactive" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            التقارير التفاعلية
          </button>
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;
