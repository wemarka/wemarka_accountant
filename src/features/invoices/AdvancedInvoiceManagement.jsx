import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedInvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "invoices"));
        const invoicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInvoices(invoicesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("حدث خطأ أثناء تحميل الفواتير.");
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    if (filter.trim() !== "") {
      filtered = filtered.filter((invoice) =>
        invoice.client.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return (
          invoiceDate >= new Date(dateRange.start) &&
          invoiceDate <= new Date(dateRange.end)
        );
      });
    }

    return filtered;
  }, [invoices, filter, dateRange]);

  const exportToExcel = () => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast.error("لا توجد بيانات لتصديرها إلى Excel!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredInvoices.map((invoice) => ({
        العميل: invoice.client,
        المبلغ: invoice.amount,
        التاريخ: new Date(invoice.date).toLocaleDateString("ar-EG"),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "الفواتير");
    XLSX.writeFile(workbook, "الفواتير.xlsx");
    toast.success("تم تصدير البيانات إلى Excel!");
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل الفواتير...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة الفواتير المتقدمة</h1>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="بحث عن العميل"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded w-full"
          />
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
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          تصدير إلى Excel
        </button>
        <ul className="mt-6">
          {filteredInvoices.map((invoice) => (
            <li
              key={invoice.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{invoice.client}</span>
              <span>{invoice.amount} ريال</span>
              <span>{new Date(invoice.date).toLocaleDateString("ar-EG")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvancedInvoiceManagement;
