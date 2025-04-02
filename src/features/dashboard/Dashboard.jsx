import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = ({ operations, user }) => {
  const { t } = useTranslation();

  const totalIncome = useMemo(
    () =>
      operations
        .filter((op) => op.type === "دخل")
        .reduce((sum, op) => sum + op.amount, 0),
    [operations]
  );

  const totalExpense = useMemo(
    () =>
      operations
        .filter((op) => op.type === "مصروف")
        .reduce((sum, op) => sum + op.amount, 0),
    [operations]
  );

  const recentOperations = useMemo(() => operations.slice(-5).reverse(), [operations]);

  const barChartData = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
    datasets: [
      {
        label: t("income"),
        data: [500, 700, 800, 600, 900, 1000], // بيانات افتراضية
        backgroundColor: "#10b981",
      },
      {
        label: t("expense"),
        data: [300, 400, 500, 200, 600, 700], // بيانات افتراضية
        backgroundColor: "#ef4444",
      },
    ],
  };

  const doughnutChartData = {
    labels: [t("income"), t("expense")],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#10b981", "#ef4444"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-gray-100">
          {t("welcome")}, {user?.email || "ضيف"}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white text-center py-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">{t("totalIncome")}</h2>
            <p className="text-3xl font-bold">{totalIncome}</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white text-center py-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">{t("totalExpense")}</h2>
            <p className="text-3xl font-bold">{totalExpense}</p>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t("monthlyActivity")}</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t("incomeVsExpense")}</h2>
          <Doughnut data={doughnutChartData} options={{ responsive: true }} />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t("recentOperations")}</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentOperations.map((op) => (
              <li key={op.id} className="py-4 flex justify-between items-center">
                <span className="text-gray-800 dark:text-gray-300">{op.note || "—"}</span>
                <span
                  className={`font-bold ${
                    op.type === "دخل" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {op.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          to="/export-reports"
          className="block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 text-center"
        >
          {t("exportReports")}
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
