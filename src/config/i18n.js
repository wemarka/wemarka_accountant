import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      logout: "Logout",
      settings: "Settings",
      operations: "Operations",
      reports: "Reports",
      addOperation: "Add Operation",
      income: "Income",
      expense: "Expense",
      totalIncome: "Total Income",
      totalExpense: "Total Expense",
      exportToExcel: "Export to Excel",
      noData: "No data available.",
    },
  },
  ar: {
    translation: {
      welcome: "مرحبًا",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      settings: "الإعدادات",
      operations: "العمليات",
      reports: "التقارير",
      addOperation: "إضافة عملية",
      income: "دخل",
      expense: "مصروف",
      totalIncome: "إجمالي الدخل",
      totalExpense: "إجمالي المصروف",
      exportToExcel: "تصدير إلى Excel",
      noData: "لا توجد بيانات.",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
