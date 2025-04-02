import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ client: "", amount: "", date: "" });
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

  const addInvoice = async () => {
    if (!newInvoice.client || !newInvoice.amount || !newInvoice.date) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "invoices"), {
        ...newInvoice,
        amount: parseFloat(newInvoice.amount),
        date: new Date(newInvoice.date),
      });
      setInvoices((prev) => [...prev, { id: docRef.id, ...newInvoice }]);
      setNewInvoice({ client: "", amount: "", date: "" });
      toast.success("تمت إضافة الفاتورة بنجاح!");
    } catch (error) {
      console.error("Error adding invoice:", error);
      toast.error("حدث خطأ أثناء إضافة الفاتورة.");
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await deleteDoc(doc(db, "invoices", id));
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
      toast.success("تم حذف الفاتورة بنجاح!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("حدث خطأ أثناء حذف الفاتورة.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل الفواتير...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة الفواتير</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="اسم العميل"
            value={newInvoice.client}
            onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="number"
            placeholder="المبلغ"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="date"
            value={newInvoice.date}
            onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addInvoice}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة فاتورة
          </button>
        </div>
        <ul>
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{invoice.client}</span>
              <span>{invoice.amount} ريال</span>
              <span>{new Date(invoice.date).toLocaleDateString("ar-EG")}</span>
              <button
                onClick={() => deleteInvoice(invoice.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvoiceManagement;
