import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("عرض الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "notifications"));
        const notificationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("حدث خطأ أثناء تحميل الإشعارات.");
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((notification) =>
    filter === "عرض الكل" ? true : notification.type === filter
  );

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل الإشعارات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">الإشعارات المتقدمة</h1>
        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="عرض الكل">عرض الكل</option>
            <option value="تنبيه">تنبيه</option>
            <option value="رسالة">رسالة</option>
          </select>
        </div>
        <ul>
          {filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{notification.title}</span>
              <span>{notification.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvancedNotifications;
