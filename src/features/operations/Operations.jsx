import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom"; // ✅ إضافة استيراد Link

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Operations = React.memo(({ operations = [], setOperations, handleLogout }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("عرض الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" }); // ✅ إضافة نطاق التاريخ
  const [newOperation, setNewOperation] = useState({ type: "دخل", amount: "", note: "" });
  const [confirmDelete, setConfirmDelete] = useState(null); // ✅ حالة لتأكيد الحذف

  const filteredOperations = useMemo(() => {
    let filtered = operations;

    // تصفية حسب الفئة
    if (filter !== "عرض الكل") {
      filtered = filtered.filter((op) => op.type === filter);
    }

    // تصفية حسب نطاق التاريخ
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((op) => {
        const operationDate = op.date?.toDate ? op.date.toDate() : null;
        return (
          operationDate &&
          operationDate >= new Date(dateRange.start) &&
          operationDate <= new Date(dateRange.end)
        );
      });
    }

    // تصفية حسب البحث النصي
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (op) =>
          op.note?.includes(searchQuery) ||
          op.amount.toString().includes(searchQuery)
      );
    }

    return filtered;
  }, [operations, filter, searchQuery, dateRange]);

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

  const addOperation = useCallback(async () => {
    if (!newOperation.amount || !newOperation.note) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "operations"), {
        ...newOperation,
        amount: parseFloat(newOperation.amount),
        date: new Date(), // ✅ إضافة التاريخ
      });
      const newOp = { id: docRef.id, ...newOperation, date: new Date() };
      setOperations((prev) => [...prev, newOp]); // ✅ تحديث العمليات محليًا
      setNewOperation({ type: "دخل", amount: "", note: "" });
      toast.success("تمت إضافة العملية بنجاح!");
    } catch (error) {
      console.error("Error adding operation:", error);
      toast.error("حدث خطأ أثناء إضافة العملية.");
    }
  }, [newOperation, setOperations]);

  const deleteOperation = async (id) => {
    try {
      await deleteDoc(doc(db, "operations", id));
      setOperations(operations.filter((op) => op.id !== id));
      toast.success("تم حذف العملية بنجاح!");
    } catch (error) {
      console.error("Error deleting operation:", error);
      toast.error("حدث خطأ أثناء حذف العملية.");
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id); // ✅ فتح نافذة التأكيد
  };

  const confirmDeleteOperation = () => {
    if (confirmDelete) {
      deleteOperation(confirmDelete);
      setConfirmDelete(null); // ✅ إغلاق نافذة التأكيد
    }
  };

  const editOperation = async (id, updatedOperation) => {
    try {
      await updateDoc(doc(db, "operations", id), updatedOperation);
      setOperations(
        operations.map((op) => (op.id === id ? { ...op, ...updatedOperation } : op))
      );
      toast.success("تم تعديل العملية بنجاح!");
    } catch (error) {
      console.error("Error updating operation:", error);
      toast.error("حدث خطأ أثناء تعديل العملية.");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      operations.map((op) => ({
        النوع: op.type,
        المبلغ: op.amount,
        الملاحظة: op.note || "-",
        التاريخ: op.date?.toDate
          ? format(op.date.toDate(), "Pp", { locale: ar })
          : "—",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "العمليات المالية");
    XLSX.writeFile(workbook, "العمليات_المالية.xlsx");
    toast.success("تم تصدير البيانات إلى Excel!");
  };

  const exportToPDF = () => {
    if (!operations || operations.length === 0) {
      toast.error("لا توجد بيانات لتصديرها إلى PDF!");
      return;
    }

    const body = operations.map((op) => [
      { text: op.date?.toDate ? format(op.date.toDate(), "Pp", { locale: ar }) : "—", alignment: "right" },
      { text: op.note || "—", alignment: "right" },
      { text: op.amount.toString(), alignment: "right" },
      { text: op.type, alignment: "right" },
    ]);

    const docDefinition = {
      content: [
        {
          text: "تقرير العمليات",
          style: "header",
          alignment: "right",
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*"],
            body: [
              [
                { text: "التاريخ", style: "tableHeader", alignment: "right" },
                { text: "الملاحظة", style: "tableHeader", alignment: "right" },
                { text: "المبلغ", style: "tableHeader", alignment: "right" },
                { text: "النوع", style: "tableHeader", alignment: "right" },
              ],
              ...body,
            ],
          },
          layout: "lightHorizontalLines",
        },
      ],
      defaultStyle: {
        font: "Amiri", // استخدام الخط العربي
        fontSize: 12,
        alignment: "right",
      },
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "white",
          fillColor: "#2980b9",
        },
      },
      pageOrientation: "portrait",
    };

    window.pdfMake.createPdf(docDefinition).download("تقرير_العمليات.pdf");
    toast.success("تم تصدير البيانات إلى PDF!");
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <div className="flex justify-between mb-6">
          <Link
            to="/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            {t("backToDashboard")}
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            {t("logout")}
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{t("operations")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-lg shadow"
          >
            <option value="عرض الكل">{t("showAll")}</option>
            <option value="دخل">{t("income")}</option>
            <option value="مصروف">{t("expense")}</option>
          </select>
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-lg shadow"
          />
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={handleDateChange}
            className="border p-2 rounded-lg shadow"
          />
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={handleDateChange}
            className="border p-2 rounded-lg shadow"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={newOperation.type}
            onChange={(e) => setNewOperation({ ...newOperation, type: e.target.value })}
            className="border p-2 rounded-lg shadow"
          >
            <option value="دخل">{t("income")}</option>
            <option value="مصروف">{t("expense")}</option>
          </select>
          <input
            type="number"
            placeholder={t("amount")}
            value={newOperation.amount}
            onChange={(e) => setNewOperation({ ...newOperation, amount: e.target.value })}
            className="border p-2 rounded-lg shadow"
          />
          <input
            type="text"
            placeholder={t("note")}
            value={newOperation.note}
            onChange={(e) => setNewOperation({ ...newOperation, note: e.target.value })}
            className="border p-2 rounded-lg shadow"
          />
          <button
            onClick={addOperation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            {t("addOperation")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 text-green-800 text-center py-3 rounded-lg font-bold shadow">
            {t("totalIncome")}: {totalIncome}
          </div>
          <div className="bg-red-100 text-red-800 text-center py-3 rounded-lg font-bold shadow">
            {t("totalExpense")}: {totalExpense}
          </div>
        </div>
        <div className="mb-8">
          <Bar
            data={{
              labels: [t("income"), t("expense")],
              datasets: [
                {
                  label: t("total"),
                  data: [totalIncome, totalExpense],
                  backgroundColor: ["#10b981", "#ef4444"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: t("operationsStatistics") },
              },
            }}
          />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t("operations")}</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOperations.map((op) => (
              <li key={op.id} className="py-4 flex justify-between items-center">
                <span className="text-gray-800 dark:text-gray-300">{op.note || "—"}</span>
                <span
                  className={`font-bold ${
                    op.type === "دخل" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {op.amount}
                </span>
                <button
                  onClick={() => handleDeleteClick(op.id)}
                  className="text-red-500 hover:underline mr-2"
                >
                  حذف
                </button>
                <button
                  onClick={() =>
                    editOperation(op.id, { ...op, note: prompt("تعديل الملاحظة:", op.note) })
                  }
                  className="text-blue-500 hover:underline"
                >
                  تعديل
                </button>
              </li>
            ))}
          </ul>
        </div>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <p>هل أنت متأكد أنك تريد حذف هذه العملية؟</p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={confirmDeleteOperation}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  نعم
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Operations;
