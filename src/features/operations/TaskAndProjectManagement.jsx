import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskAndProjectManagement = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        setTasks(tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setProjects(projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات.");
      }
    };

    fetchData();
  }, []);

  const addItem = async () => {
    if (!newItem.title || !newItem.description) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const collectionName = activeTab === "tasks" ? "tasks" : "projects";
      const docRef = await addDoc(collection(db, collectionName), newItem);
      if (activeTab === "tasks") {
        setTasks((prev) => [...prev, { id: docRef.id, ...newItem }]);
      } else {
        setProjects((prev) => [...prev, { id: docRef.id, ...newItem }]);
      }
      setNewItem({ title: "", description: "" });
      toast.success("تمت الإضافة بنجاح!");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("حدث خطأ أثناء الإضافة.");
    }
  };

  const deleteItem = async (id) => {
    try {
      const collectionName = activeTab === "tasks" ? "tasks" : "projects";
      await deleteDoc(doc(db, collectionName, id));
      if (activeTab === "tasks") {
        setTasks(tasks.filter((item) => item.id !== id));
      } else {
        setProjects(projects.filter((item) => item.id !== id));
      }
      toast.success("تم الحذف بنجاح!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("حدث خطأ أثناء الحذف.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل البيانات...</div>;
  }

  const items = activeTab === "tasks" ? tasks : projects;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">
          {activeTab === "tasks" ? "إدارة المهام" : "إدارة المشاريع"}
        </h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "tasks" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            المهام
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "projects" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            المشاريع
          </button>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="العنوان"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="text"
            placeholder="الوصف"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة
          </button>
        </div>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{item.title}</span>
              <span>{item.description}</span>
              <button
                onClick={() => deleteItem(item.id)}
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

export default TaskAndProjectManagement;
