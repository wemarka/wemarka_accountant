import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";

const Dashboard = ({ operations, user, suppliers }) => {
  const { t, i18n } = useTranslation();

  const isDarkMode = document.body.classList.contains("dark");

  const formatDateForChart = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? t("invalidDate") : parsedDate.toLocaleDateString("ar-EG");
  };

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

  // التحقق من صحة البيانات
  const validOperations = useMemo(() => operations?.filter((op) => op.type && op.amount) || [], [operations]);
  const validSuppliers = useMemo(() => suppliers?.filter((sup) => sup.amount && sup.date) || [], [suppliers]);

  // حساب البيانات الإجمالية
  const totalIncome = useMemo(
    () =>
      validOperations
        .filter((op) => op.type === "دخل")
        .reduce((sum, op) => sum + op.amount, 0),
    [validOperations]
  );

  const totalExpense = useMemo(
    () =>
      validOperations
        .filter((op) => op.type === "مصروف")
        .reduce((sum, op) => sum + op.amount, 0),
    [validOperations]
  );

  const totalCapital = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const totalSuppliersDebt = useMemo(
    () => validSuppliers.reduce((sum, supplier) => sum + supplier.amount, 0),
    [validSuppliers]
  );

  const cashInHand = useMemo(() => totalCapital - totalSuppliersDebt, [totalCapital, totalSuppliersDebt]);

  const recentSupplierPayment = useMemo(() => {
    if (validSuppliers.length === 0) return null;
    return validSuppliers.reduce((closest, supplier) =>
      new Date(supplier.date) < new Date(closest.date) ? supplier : closest
    );
  }, [validSuppliers]);

  const recentOperations = useMemo(() => validOperations.slice(-5).reverse(), [validOperations]);

  // إضافة عمليات متعددة
  const demoSuppliers = useMemo(() => {
    const demo = [
      {
        id: "demo1",
        name: t("supplier") + " 1",
        goodsType: t("goodsType") + " A",
        amount: 300,
        date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      },
      {
        id: "demo2",
        name: t("supplier") + " 2",
        goodsType: t("goodsType") + " B",
        amount: 500,
        date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      },
      {
        id: "demo3",
        name: t("supplier") + " 3",
        goodsType: t("goodsType") + " C",
        amount: 200,
        date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      },
    ];
    return [...validSuppliers, ...demo];
  }, [validSuppliers, t]);

  // إضافة بيانات ديمو للرواتب
  const demoSalaries = useMemo(() => {
    return [
      { id: "salary1", name: t("employee") + " 1", amount: 2000 },
      { id: "salary2", name: t("employee") + " 2", amount: 2500 },
      { id: "salary3", name: t("employee") + " 3", amount: 1800 },
    ];
  }, [t]);

  const totalSalaries = useMemo(() => {
    return demoSalaries.reduce((sum, salary) => sum + salary.amount, 0);
  }, [demoSalaries]);

  // بيانات الرسم البياني
  const chartData = {
    series: [
      {
        name: t("income"),
        data: operations
          .filter((op) => op.type === "دخل")
          .map((op) => op.amount),
      },
      {
        name: t("expense"),
        data: operations
          .filter((op) => op.type === "مصروف")
          .map((op) => op.amount),
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false },
        background: isDarkMode ? "#1f2937" : "#ffffff", // خلفية الرسم البياني
      },
      xaxis: {
        categories: operations.map((op) => formatDateForChart(op.date)),
        labels: {
          style: {
            colors: isDarkMode ? "#d1d5db" : "#4b5563", // لون النصوص
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode ? "#d1d5db" : "#4b5563", // لون النصوص
          },
        },
      },
      grid: {
        borderColor: isDarkMode ? "#4b5563" : "#e5e7eb", // لون خطوط الشبكة
      },
      colors: ["#10b981", "#ef4444"], // ألوان الخطوط
      tooltip: {
        theme: isDarkMode ? "dark" : "light", // تفعيل الوضع الداكن للتلميحات
      },
    },
  };

  const sortedSuppliers = useMemo(() => {
    const suppliersCopy = [...demoSuppliers];
    if (recentSupplierPayment) {
      const index = suppliersCopy.findIndex((sup) => sup.id === recentSupplierPayment.id);
      if (index !== -1) {
        suppliersCopy.splice(index, 1);
        suppliersCopy.unshift(recentSupplierPayment);
      }
    }
    return suppliersCopy;
  }, [demoSuppliers, recentSupplierPayment]);

  const totalSales = useMemo(
    () =>
      validOperations
        .filter((op) => op.type === "مبيعات")
        .reduce((sum, op) => sum + op.amount, 0),
    [validOperations]
  );

  const totalDigitalExpenses = useMemo(
    () =>
      validOperations
        .filter((op) => op.type === "مصاريف رقمية")
        .reduce((sum, op) => sum + op.amount, 0),
    [validOperations]
  );

  const totalGoodsExpenses = useMemo(
    () =>
      validOperations
        .filter((op) => op.type === "شراء بضائع")
        .reduce((sum, op) => sum + op.amount, 0),
    [validOperations]
  );

  const totalExpenses = useMemo(
    () =>
      validOperations
        .filter((op) => op.type === "مصروف")
        .reduce((sum, op) => sum + op.amount, 0),
    [validOperations]
  );

  const netProfit = useMemo(() => totalSales - (totalExpenses + totalGoodsExpenses), [totalSales, totalExpenses, totalGoodsExpenses]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        {/* الكروت الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* حذف كارت إجمالي الدخل */}
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-red-500 dark:to-red-700">
            <h2 className="text-xl font-bold">{t("totalExpense")}</h2>
            <p className="text-3xl font-bold">{totalExpense}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-700">
            <h2 className="text-xl font-bold">{t("totalCapital")}</h2>
            <p className="text-3xl font-bold">{totalCapital}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-yellow-500 dark:to-yellow-700">
            <h2 className="text-xl font-bold">{t("totalSuppliersDebt")}</h2>
            <p className="text-3xl font-bold">{totalSuppliersDebt}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-purple-500 dark:to-purple-700">
            <h2 className="text-xl font-bold">{t("cashInHand")}</h2>
            <p className="text-3xl font-bold">{cashInHand}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-pink-500 dark:to-pink-700">
            <h2 className="text-xl font-bold">{t("totalSalaries")}</h2>
            <p className="text-3xl font-bold">{totalSalaries}</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-green-500 dark:to-green-700">
            <h2 className="text-xl font-bold">{t("totalSales")}</h2>
            <p className="text-3xl font-bold">{totalSales}</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-red-500 dark:to-red-700">
            <h2 className="text-xl font-bold">{t("totalExpenses")}</h2>
            <p className="text-3xl font-bold">{totalExpenses}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-700">
            <h2 className="text-xl font-bold">{t("totalDigitalExpenses")}</h2>
            <p className="text-3xl font-bold">{totalDigitalExpenses}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-yellow-500 dark:to-yellow-700">
            <h2 className="text-xl font-bold">{t("totalGoodsExpenses")}</h2>
            <p className="text-3xl font-bold">{totalGoodsExpenses}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-center py-6 rounded-lg shadow-lg dark:bg-gradient-to-r dark:from-purple-500 dark:to-purple-700">
            <h2 className="text-xl font-bold">{t("netProfit")}</h2>
            <p className="text-3xl font-bold">{netProfit}</p>
          </div>
        </div>

        {/* جدول الذمم */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t("suppliersDebts")}</h2>
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="py-2 px-4 text-right">{t("supplierName")}</th>
                <th className="py-2 px-4 text-right">{t("goodsType")}</th>
                <th className="py-2 px-4 text-right">{t("amount")}</th>
                <th className="py-2 px-4 text-right">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedSuppliers.map((supplier, index) => (
                <tr
                  key={supplier.id}
                  className={`border-b dark:border-gray-700 ${
                    index === 0 && recentSupplierPayment ? "bg-yellow-100 dark:bg-yellow-600 font-bold" : ""
                  }`}
                >
                  <td className="py-2 px-4 text-right">{supplier.name}</td>
                  <td className="py-2 px-4 text-right">{supplier.goodsType}</td>
                  <td className="py-2 px-4 text-right">{supplier.amount}</td>
                  <td className="py-2 px-4 text-right">{formatDate(supplier.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* العمليات الأخيرة */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t("recentOperations")}</h2>
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="py-2 px-4 text-right">{t("date")}</th>
                <th className="py-2 px-4 text-right">{t("type")}</th>
                <th className="py-2 px-4 text-right">{t("amount")}</th>
                <th className="py-2 px-4 text-right">{t("note")}</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => (
                <tr key={op.id} className="border-b dark:border-gray-700">
                  <td className="py-2 px-4 text-right">{formatDate(op.date)}</td>
                  <td className="py-2 px-4 text-right">{op.type}</td>
                  <td className="py-2 px-4 text-right">{op.amount}</td>
                  <td className="py-2 px-4 text-right">{op.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          to="/export-reports"
          className="block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-center"
        >
          {t("exportReports")}
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
