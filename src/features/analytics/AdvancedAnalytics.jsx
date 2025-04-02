import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // ✅ إضافة PointElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // ✅ تسجيل PointElement
  Title,
  Tooltip,
  Legend
);

const AdvancedAnalytics = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // بيانات افتراضية للإحصائيات
    const data = {
      labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
      datasets: [
        {
          label: "المبيعات",
          data: [500, 700, 800, 600, 900, 1000],
          backgroundColor: "#10b981",
        },
        {
          label: "المصروفات",
          data: [300, 400, 500, 200, 600, 700],
          backgroundColor: "#ef4444",
        },
      ],
    };
    setChartData(data);
  }, []);

  if (!chartData) {
    return <div className="text-center mt-10">جاري تحميل الإحصائيات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">الإحصائيات المتقدمة</h1>
        <div className="mb-8">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
        <div className="mb-8">
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
