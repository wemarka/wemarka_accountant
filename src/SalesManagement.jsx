import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({ product: "", quantity: "", price: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSales(salesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales:", error);
        toast.error("حدث خطأ أثناء تحميل المبيعات.");
      }
    };

    fetchSales();
  }, []);

  const addSale = async () => {
    if (!newSale.product || !newSale.quantity || !newSale.price) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "sales"), {
        ...newSale,
        quantity: parseInt(newSale.quantity),
        price: parseFloat(newSale.price),
      });
      setSales((prev) => [...prev, { id: docRef.id, ...newSale }]);
      setNewSale({ product: "", quantity: "", price: "" });
      toast.success("تمت إضافة البيع بنجاح!");
    } catch (error) {
      console.error("Error adding sale:", error);
      toast.error("حدث خطأ أثناء إضافة البيع.");
    }
  };

  const deleteSale = async (id) => {
    try {
      await deleteDoc(doc(db, "sales", id));
      setSales(sales.filter((sale) => sale.id !== id));
      toast.success("تم حذف البيع بنجاح!");
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("حدث خطأ أثناء حذف البيع.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل المبيعات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة المبيعات</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="اسم المنتج"
            value={newSale.product}
            onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="number"
            placeholder="الكمية"
            value={newSale.quantity}
            onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="number"
            placeholder="السعر"
            value={newSale.price}
            onChange={(e) => setNewSale({ ...newSale, price: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addSale}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة بيع
          </button>
        </div>
        <ul>
          {sales.map((sale) => (
            <li
              key={sale.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{sale.product}</span>
              <span>{sale.quantity}</span>
              <span>{sale.price} ريال</span>
              <button
                onClick={() => deleteSale(sale.id)}
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

export default SalesManagement;
