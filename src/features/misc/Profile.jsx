import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, profile);
      toast.success("تم تحديث الملف الشخصي بنجاح!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{t("profile")}</h1>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">{t("firstName")}</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder={t("firstName")}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">{t("lastName")}</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder={t("lastName")}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">{t("email")}</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder={t("email")}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">{t("phone")}</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder={t("phone")}
          />
        </div>
        <button
          onClick={saveProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
};

export default Profile;
