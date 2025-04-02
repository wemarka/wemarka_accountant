import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faMoon,
  faSun,
  faSignOutAlt,
  faUser,
  faGlobe,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Header = ({ toggleTheme, isDarkMode, user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [openMenu, setOpenMenu] = useState(null); // حالة واحدة لإدارة القوائم المفتوحة
  const [notification, setNotification] = useState(null); // حالة لإدارة الإشعار

  useEffect(() => {
    // إضافة/إزالة فئة `with-notification-bar` بناءً على وجود إشعار
    if (notification) {
      document.body.classList.add("with-notification-bar");
    } else {
      document.body.classList.remove("with-notification-bar");
    }
  }, [notification]);

  const handleMenuToggle = (menu) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const handleLogout = () => {
    onLogout();
    setNotification(t("logout_success")); // عرض إشعار عند تسجيل الخروج
    setTimeout(() => setNotification(null), 3000); // إخفاء الإشعار بعد 3 ثوانٍ
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setNotification(t("language_changed", { lang: lang === "ar" ? t("arabic") : t("english") }));
    setTimeout(() => setNotification(null), 3000); // إخفاء الإشعار بعد 3 ثوانٍ
    setOpenMenu(null);
  };

  return (
    <>
      {/* شريط الإشعار */}
      {notification && (
        <div className="notification-bar">
          <span className="icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
          <span className="message">{notification}</span>
        </div>
      )}

      <div className="header-dashboard bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        {/* شعار */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t("app_name")}</h1>
        </div>

        {/* أيقونات */}
        <div className="flex items-center gap-4">
          {/* إشعارات */}
          <div className="relative">
            <button
              onClick={() => handleMenuToggle("notifications")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500"
            >
              <FontAwesomeIcon icon={faBell} className="text-white dark:text-gray-200" />
            </button>
            {openMenu === "notifications" && (
              <div className="notification-dropdown dark:bg-gray-800 dark:text-gray-200">
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">{t("notifications")}</h3>
                <ul>
                  <li className="py-2 border-b text-yellow-600 dark:text-yellow-400">{t("new_notification")}</li>
                </ul>
              </div>
            )}
          </div>

          {/* تبديل الوضع الداكن */}
          <button
            onClick={toggleTheme}
            className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-white dark:text-gray-200" />
          </button>

          {/* تغيير اللغة */}
          <div className="relative">
            <button
              onClick={() => handleMenuToggle("language")}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faGlobe} className="text-white dark:text-gray-200" />
            </button>
            {openMenu === "language" && (
              <div className={`absolute ${i18n.dir() === "rtl" ? "left-0" : "right-0"} mt-2 w-32 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-2`}>
                <button
                  onClick={() => changeLanguage("ar")}
                  className="block w-full text-right px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {t("arabic")}
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className="block w-full text-right px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {t("english")}
                </button>
              </div>
            )}
          </div>

          {/* ملف المستخدم */}
          <div className="relative">
            <button
              onClick={() => handleMenuToggle("profile")}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            >
              <img
                src="/images/avatar.png"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>
                {user?.firstName
                  ? `مرحباً، ${user.firstName}`
                  : "مرحباً، زائر"}
              </span>
            </button>
            {openMenu === "profile" && (
              <div className={`absolute ${i18n.dir() === "rtl" ? "left-0" : "right-0"} mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4`}>
                <Link
                  to="/profile"
                  className="block text-gray-800 dark:text-gray-100 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <FontAwesomeIcon icon={faUser} /> {t("profile")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-800 dark:text-gray-100 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
