import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        const inventoryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventory(inventoryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        toast.error("حدث خطأ أثناء تحميل المخزون.");
      }
    };

    fetchInventory();
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    try {
      const itemRef = doc(db, "inventory", id);
      await updateDoc(itemRef, { quantity: newQuantity });
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("تم تحديث الكمية بنجاح!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("حدث خطأ أثناء تحديث الكمية.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل المخزون...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة المخزون</h1>
        <ul>
          {inventory.map((item) => (
            <li
              key={item.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <input
                type="number"
                defaultValue={item.quantity}
                onBlur={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="border p-2 rounded"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryManagement;
