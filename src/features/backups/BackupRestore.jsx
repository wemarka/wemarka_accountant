import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BackupRestore = () => {
  const [file, setFile] = useState(null);
  const storage = getStorage();

  const handleBackup = async () => {
    try {
      const backupRef = ref(storage, `backups/backup-${Date.now()}.json`);
      const data = JSON.stringify({ message: "Backup data" }); // Replace with actual data
      const blob = new Blob([data], { type: "application/json" });
      await uploadBytes(backupRef, blob);
      toast.success("تم إنشاء النسخة الاحتياطية بنجاح!");
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("حدث خطأ أثناء إنشاء النسخة الاحتياطية.");
    }
  };

  const handleRestore = async () => {
    try {
      if (!file) {
        toast.error("يرجى اختيار ملف للاستعادة.");
        return;
      }
      const fileData = await file.text();
      console.log("Restored data:", JSON.parse(fileData)); // Replace with actual restore logic
      toast.success("تم استعادة البيانات بنجاح!");
    } catch (error) {
      console.error("Error restoring data:", error);
      toast.error("حدث خطأ أثناء استعادة البيانات.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">النسخ الاحتياطي والاستعادة</h1>
        <button onClick={handleBackup} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          إنشاء نسخة احتياطية
        </button>
        <div className="mt-6">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded" />
          <button onClick={handleRestore} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4">
            استعادة البيانات
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
