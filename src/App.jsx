import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./Login";
import NotFound from "./NotFound";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import ExportReports from "./ExportReports"; // ✅ تأكد من استيراد ExportReports
import AdvancedSettings from "./AdvancedSettings"; // ✅ إضافة استيراد صفحة إدارة الإعدادات المتقدمة
import TaskAndProjectManagement from "./TaskAndProjectManagement"; // ✅ استخدام الصفحة المدمجة
import AdvancedAnalytics from "./AdvancedAnalytics"; // ✅ إضافة استيراد صفحة الإحصائيات المتقدمة
import CustomerManagement from "./CustomerManagement"; // ✅ إضافة استيراد صفحة إدارة العملاء
import GeneralSettings from "./GeneralSettings"; // ✅ إضافة استيراد صفحة الإعدادات العامة
import SalesManagement from "./SalesManagement"; // ✅ إضافة استيراد صفحة إدارة المبيعات
import InventoryManagement from "./InventoryManagement"; // ✅ إضافة استيراد صفحة إدارة المخزون
import BranchManagement from "./BranchManagement"; // ✅ إضافة استيراد صفحة إدارة الفروع
import AdvancedConfiguration from "./AdvancedConfiguration"; // ✅ إضافة استيراد صفحة الإعدادات المتقدمة
import SecuritySettings from "./SecuritySettings"; // ✅ إضافة استيراد صفحة إدارة الإعدادات الأمنية
import AdvancedNotifications from "./AdvancedNotifications"; // ✅ إضافة استيراد صفحة إدارة الإشعارات المتقدمة
import AdvancedInvoiceManagement from "./AdvancedInvoiceManagement"; // ✅ إضافة استيراد صفحة إدارة الفواتير المتقدمة
import AdvancedRoleManagement from "./AdvancedRoleManagement"; // ✅ إضافة استيراد صفحة إدارة الأدوار المتقدمة
import AdvancedReportSettings from "./AdvancedReportSettings"; // ✅ إضافة استيراد صفحة إدارة الإعدادات المتقدمة للتقارير
import CustomNotificationsManagement from "./CustomNotificationsManagement"; // ✅ إضافة استيراد صفحة إدارة الإشعارات المخصصة
import PrivateRoute from "./components/PrivateRoute"; // ✅ إضافة استيراد PrivateRoute
import Management from "./Management"; // ✅ استيراد صفحة الإدارة الموحدة
import Settings from "./Settings"; // ✅ استيراد صفحة الإعدادات الموحدة
import ReportsManagement from "./ReportsManagement";
import AnalyticsManagement from "./AnalyticsManagement";
import OperationsManagement from "./OperationsManagement";
import Profile from "./Profile"; // ✅ إضافة استيراد صفحة الملف الشخصي
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// ✅ Lazy Loading للمكونات الكبيرة
const Dashboard = lazy(() => import("./Dashboard"));
const Operations = lazy(() => import("./Operations"));
const Reports = lazy(() => import("./Reports"));

const App = () => {
  const [user, setUser] = useState(null);
  const [operations, setOperations] = useState([]); // ✅ إضافة حالة العمليات
  const [suppliers, setSuppliers] = useState([]); // ✅ حالة الموردين
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: "medium",
    themeColor: "blue",
    menuStyle: "vertical",
    menuPosition: "left",
    headerPosition: "fixed",
    loader: true,
  });

  const { t, i18n } = useTranslation();

  useEffect(() => {
    // تحديث اتجاه النص عند تغيير اللغة
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    document.body.dir = direction;
  }, [i18n.language]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    // تحديث الفئة `dark` على عنصر `<body>` بناءً على حالة `isDarkMode`
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchOperations = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "operations"));
          const operationsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOperations(operationsData); // ✅ تحديث حالة العمليات
        } catch (error) {
          console.error("Error fetching operations:", error);
        }
      };

      const fetchSuppliers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "suppliers"));
          const suppliersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSuppliers(suppliersData); // ✅ تحديث حالة الموردين
        } catch (error) {
          console.error("Error fetching suppliers:", error);
        }
      };

      fetchOperations();
      fetchSuppliers(); // ✅ جلب بيانات الموردين
    }
  }, [user]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className={`flex ${isDarkMode ? "dark" : ""}`}>
            <ToastContainer 
              position="top-center"
              autoClose={3000}
              rtl={i18n.language === "ar"}
            />
            <Sidebar />
            <div className="flex-grow">
              <Header
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
                settings={settings}
                setSettings={setSettings}
                user={user}
                onLogout={() => setUser(null)}
              />
              <main className="p-4">
                <Suspense fallback={<div>{t("loading")}</div>}>
                  <Routes>
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
                    <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard operations={operations} user={user} suppliers={suppliers} /></PrivateRoute>} />
                    <Route path="/operations" element={<PrivateRoute user={user}><Operations handleLogout={() => setUser(null)} /></PrivateRoute>} />
                    <Route path="/reports" element={<PrivateRoute user={user}><Reports operations={operations} /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute user={user}><Settings /></PrivateRoute>} /> {/* ✅ صفحة الإعدادات الموحدة */}
                    <Route path="/export-reports" element={<PrivateRoute user={user}><ExportReports operations={operations} /></PrivateRoute>} /> {/* ✅ إضافة المسار */}
                    <Route path="/advanced-settings" element={<PrivateRoute user={user}><AdvancedSettings /></PrivateRoute>} /> {/* ✅ إضافة المسار */}
                    <Route path="/task-and-project-management" element={<PrivateRoute user={user}><TaskAndProjectManagement /></PrivateRoute>} /> {/* ✅ استخدام المسار الجديد */}
                    <Route path="/advanced-analytics" element={<PrivateRoute user={user}><AdvancedAnalytics /></PrivateRoute>} /> {/* ✅ إضافة المسار */}
                    <Route path="/management" element={<PrivateRoute user={user}><Management /></PrivateRoute>} /> {/* ✅ صفحة الإدارة الموحدة */}
                    <Route path="/reports-management" element={<PrivateRoute user={user}><ReportsManagement /></PrivateRoute>} />
                    <Route path="/analytics-management" element={<PrivateRoute user={user}><AnalyticsManagement /></PrivateRoute>} />
                    <Route path="/operations-management" element={<PrivateRoute user={user}><OperationsManagement /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute user={user}><Profile user={user} /></PrivateRoute>} /> {/* ✅ إضافة المسار */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
