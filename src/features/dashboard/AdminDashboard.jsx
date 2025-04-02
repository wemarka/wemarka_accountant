import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
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
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">لوحة تحكم المشرف</h1>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{user.email}</span>
              <span>{user.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
