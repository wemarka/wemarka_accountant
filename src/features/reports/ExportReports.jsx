import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExportReports = ({ operations }) => {
  const [filter, setFilter] = useState("عرض الكل");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredOperations = useMemo(() => {
    let filtered = operations;
    if (filter !== "عرض الكل") {
      filtered = filtered.filter((op) => op.type === filter);
    }
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
    return filtered;
  }, [operations, filter, dateRange]);

  const exportToExcel = () => {
    if (!filteredOperations || filteredOperations.length === 0) {
      toast.error("لا توجد بيانات لتصديرها إلى Excel!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredOperations.map((op) => ({
        النوع: op.type,
        المبلغ: op.amount,
        الملاحظة: op.note || "-",
        التاريخ: op.date?.toDate
          ? new Date(op.date.toDate()).toLocaleString("ar-EG")
          : "—",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "التقارير المالية");
    XLSX.writeFile(workbook, "التقارير_المالية.xlsx");
    toast.success("تم تصدير البيانات إلى Excel!");
  };

  const exportToPDF = () => {
    if (!filteredOperations || filteredOperations.length === 0) {
      toast.error("لا توجد بيانات لتصديرها إلى PDF!");
      return;
    }

    const body = filteredOperations.map((op) => [
      { text: op.date?.toDate ? new Date(op.date.toDate()).toLocaleString("ar-EG") : "—", alignment: "right" },
      { text: op.note || "—", alignment: "right" },
      { text: op.amount.toString(), alignment: "right" },
      { text: op.type, alignment: "right" },
    ]);

    const docDefinition = {
      content: [
        {
          text: "التقارير المالية",
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

    window.pdfMake.createPdf(docDefinition).download("التقارير_المالية.pdf");
    toast.success("تم تصدير البيانات إلى PDF!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">تصدير التقارير</h1>
        <div className="flex gap-4 mb-4">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow"
          >
            <option value="عرض الكل">عرض الكل</option>
            <option value="دخل">دخل</option>
            <option value="مصروف">مصروف</option>
          </select>
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="border p-2 rounded"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
          >
            تصدير إلى Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            تصدير إلى PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReports;
