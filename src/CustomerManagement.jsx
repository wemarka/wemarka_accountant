import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        const customersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("حدث خطأ أثناء تحميل العملاء.");
      }
    };

    fetchCustomers();
  }, []);

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "customers"), newCustomer);
      setCustomers((prev) => [...prev, { id: docRef.id, ...newCustomer }]);
      setNewCustomer({ name: "", email: "", phone: "" });
      toast.success("تمت إضافة العميل بنجاح!");
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("حدث خطأ أثناء إضافة العميل.");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
      setCustomers(customers.filter((customer) => customer.id !== id));
      toast.success("تم حذف العميل بنجاح!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("حدث خطأ أثناء حذف العميل.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل العملاء...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة العملاء</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="اسم العميل"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addCustomer}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة عميل
          </button>
        </div>
        <ul>
          {customers.map((customer) => (
            <li
              key={customer.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{customer.name}</span>
              <span>{customer.email}</span>
              <span>{customer.phone}</span>
              <button
                onClick={() => deleteCustomer(customer.id)}
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

export default CustomerManagement;
