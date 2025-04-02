import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Reports = ({ operations }) => {
  const { t, i18n } = useTranslation();

  const isDarkMode = document.body.classList.contains("dark");

  const formatDate = (date) => {
    if (!date) return t("invalidDate");
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? t("invalidDate")
      : parsedDate.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  const formatDateForChart = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? t("invalidDate") : parsedDate.toLocaleDateString("ar-EG");
  };

  if (!operations || operations.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        {t("noData")}
      </div>
    );
  }

  const incomeOperations = useMemo(
    () => operations.filter((op) => op.type === t("income")),
    [operations]
  );

  const expenseOperations = useMemo(
    () => operations.filter((op) => op.type === t("expense")),
    [operations]
  );

  const totalIncome = useMemo(
    () => incomeOperations.reduce((sum, op) => sum + op.amount, 0),
    [incomeOperations]
  );

  const totalExpense = useMemo(
    () => expenseOperations.reduce((sum, op) => sum + op.amount, 0),
    [expenseOperations]
  );

  const chartData = {
    labels: operations.map((op) => formatDateForChart(op.date)),
    datasets: [
      {
        label: t("income"),
        data: operations
          .filter((op) => op.type === t("income"))
          .map((op) => op.amount),
        backgroundColor: "#10b981",
      },
      {
        label: t("expense"),
        data: operations
          .filter((op) => op.type === t("expense"))
          .map((op) => op.amount),
        backgroundColor: "#ef4444",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#d1d5db" : "#4b5563", // لون النصوص
        },
      },
      title: {
        display: true,
        text: t("operationsStatistics"),
        color: isDarkMode ? "#d1d5db" : "#4b5563", // لون النصوص
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#d1d5db" : "#4b5563", // لون النصوص
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "#d1d5db" : "#4b5563", // لون النصوص
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-between mb-6">
          <Link
            to="/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {t("backToDashboard")}
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">{t("reports")}</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 text-green-800 text-center py-3 rounded-lg font-bold">
            {t("totalIncome")}: {totalIncome}
          </div>
          <div className="bg-red-100 text-red-800 text-center py-3 rounded-lg font-bold">
            {t("totalExpense")}: {totalExpense}
          </div>
        </div>
        <div className="mb-8">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="mb-8">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="py-2 px-4 text-left">{t("date")}</th>
                <th className="py-2 px-4 text-left">{t("type")}</th>
                <th className="py-2 px-4 text-left">{t("amount")}</th>
                <th className="py-2 px-4 text-left">{t("note")}</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => (
                <tr key={op.id} className="border-b dark:border-gray-700">
                  <td className="py-2 px-4">{formatDate(op.date)}</td>
                  <td className="py-2 px-4">{op.type}</td>
                  <td className="py-2 px-4">{op.amount}</td>
                  <td className="py-2 px-4">{op.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;