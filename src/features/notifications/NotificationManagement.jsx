import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({ title: "", message: "" });
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

  const addNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "notifications"), newNotification);
      setNotifications((prev) => [...prev, { id: docRef.id, ...newNotification }]);
      setNewNotification({ title: "", message: "" });
      toast.success("تمت إضافة الإشعار بنجاح!");
    } catch (error) {
      console.error("Error adding notification:", error);
      toast.error("حدث خطأ أثناء إضافة الإشعار.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications(notifications.filter((notification) => notification.id !== id));
      toast.success("تم حذف الإشعار بنجاح!");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("حدث خطأ أثناء حذف الإشعار.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل الإشعارات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة الإشعارات</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="عنوان الإشعار"
            value={newNotification.title}
            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="text"
            placeholder="محتوى الإشعار"
            value={newNotification.message}
            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addNotification}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة إشعار
          </button>
        </div>
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{notification.title}</span>
              <span>{notification.message}</span>
              <button
                onClick={() => deleteNotification(notification.id)}
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

export default NotificationManagement;
