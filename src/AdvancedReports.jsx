import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("حدث خطأ أثناء تحميل التقارير.");
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل التقارير...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة التقارير المتقدمة</h1>
        <ul>
          {reports.map((report) => (
            <li
              key={report.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{report.title}</span>
              <span>{report.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvancedReports;
