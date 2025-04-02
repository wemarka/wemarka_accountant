import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "branches"));
        const branchesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBranches(branchesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("حدث خطأ أثناء تحميل الفروع.");
      }
    };

    fetchBranches();
  }, []);

  const addBranch = async () => {
    if (!newBranch.name || !newBranch.location) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "branches"), newBranch);
      setBranches((prev) => [...prev, { id: docRef.id, ...newBranch }]);
      setNewBranch({ name: "", location: "" });
      toast.success("تمت إضافة الفرع بنجاح!");
    } catch (error) {
      console.error("Error adding branch:", error);
      toast.error("حدث خطأ أثناء إضافة الفرع.");
    }
  };

  const deleteBranch = async (id) => {
    try {
      await deleteDoc(doc(db, "branches", id));
      setBranches(branches.filter((branch) => branch.id !== id));
      toast.success("تم حذف الفرع بنجاح!");
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast.error("حدث خطأ أثناء حذف الفرع.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل الفروع...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة الفروع</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="اسم الفرع"
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="text"
            placeholder="الموقع"
            value={newBranch.location}
            onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addBranch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة فرع
          </button>
        </div>
        <ul>
          {branches.map((branch) => (
            <li
              key={branch.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{branch.name}</span>
              <span>{branch.location}</span>
              <button
                onClick={() => deleteBranch(branch.id)}
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

export default BranchManagement;
