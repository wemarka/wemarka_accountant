import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("حدث خطأ أثناء تحميل المستخدمين.");
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangeRole = async (id, newRole) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
      toast.success("تم تعديل دور المستخدم بنجاح!");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("حدث خطأ أثناء تعديل دور المستخدم.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل المستخدمين...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة الأدوار المتقدمة</h1>
        <input
          type="text"
          placeholder="بحث عن المستخدم"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full mb-6"
        />
        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{user.email}</span>
              <select
                value={user.role}
                onChange={(e) => handleChangeRole(user.id, e.target.value)}
                className="border p-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvancedRoleManagement;
