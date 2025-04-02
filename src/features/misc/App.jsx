import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

// ✅ Lazy Loading للمكونات الكبيرة
const Dashboard = lazy(() => import("./Dashboard"));
const Operations = lazy(() => import("./Operations"));
const Reports = lazy(() => import("./Reports"));

const App = () => {
  const [user, setUser] = useState(null);
  const [operations, setOperations] = useState([]); // ✅ إضافة حالة العمليات
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

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

      fetchOperations();
    }
  }, [user]);

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <main className="p-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
                <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard operations={operations} user={user} /></PrivateRoute>} />
                <Route path="/operations" element={<PrivateRoute user={user}><Operations operations={operations} setOperations={setOperations} /></PrivateRoute>} />
                <Route path="/reports" element={<PrivateRoute user={user}><Reports operations={operations} /></PrivateRoute>} />
                <Route path="/settings" element={<Settings />} /> {/* ✅ صفحة الإعدادات الموحدة */}
                <Route path="/export-reports" element={<ExportReports operations={operations} />} /> {/* ✅ إضافة المسار */}
                <Route path="/advanced-settings" element={<AdvancedSettings />} /> {/* ✅ إضافة المسار */}
                <Route path="/task-and-project-management" element={<TaskAndProjectManagement />} /> {/* ✅ استخدام المسار الجديد */}
                <Route path="/advanced-analytics" element={<AdvancedAnalytics />} /> {/* ✅ إضافة المسار */}
                <Route path="/management" element={<Management />} /> {/* ✅ صفحة الإدارة الموحدة */}
                <Route path="/reports-management" element={<ReportsManagement />} />
                <Route path="/analytics-management" element={<AnalyticsManagement />} />
                <Route path="/operations-management" element={<OperationsManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
