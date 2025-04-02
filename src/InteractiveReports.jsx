import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const InteractiveReports = ({ operations }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const income = operations.filter((op) => op.type === "دخل").reduce((sum, op) => sum + op.amount, 0);
    const expense = operations.filter((op) => op.type === "مصروف").reduce((sum, op) => sum + op.amount, 0);

    setChartData({
      series: [income, expense],
      options: {
        chart: {
          type: "pie",
        },
        labels: ["دخل", "مصروف"],
        colors: ["#10b981", "#ef4444"],
      },
    });
  }, [operations]);

  if (!chartData) {
    return <div className="text-center mt-10">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">التقارير التفاعلية</h1>
        <Chart options={chartData.options} series={chartData.series} type="pie" width="500" />
      </div>
    </div>
  );
};

export default InteractiveReports;
