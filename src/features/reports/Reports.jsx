import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Reports = ({ operations }) => {
  const { t } = useTranslation();

  if (!operations || operations.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        {t("noData")}
      </div>
    );
  }

  const incomeOperations = useMemo(
    () => operations.filter((op) => op.type === "دخل"),
    [operations]
  );

  const expenseOperations = useMemo(
    () => operations.filter((op) => op.type === "مصروف"),
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
    labels: [t("income"), t("expense")],
    datasets: [
      {
        label: t("total"),
        data: [totalIncome, totalExpense],
        backgroundColor: ["#10b981", "#ef4444"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: t("operationsStatistics"),
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
      </div>
    </div>
  );
};

export default Reports;