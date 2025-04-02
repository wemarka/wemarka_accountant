import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("حدث خطأ أثناء تحميل المهام.");
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.title || !newTask.description) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setTasks((prev) => [...prev, { id: docRef.id, ...newTask }]);
      setNewTask({ title: "", description: "" });
      toast.success("تمت إضافة المهمة بنجاح!");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("حدث خطأ أثناء إضافة المهمة.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success("تم حذف المهمة بنجاح!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("حدث خطأ أثناء حذف المهمة.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل المهام...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة المهام</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="عنوان المهمة"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="text"
            placeholder="وصف المهمة"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة مهمة
          </button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{task.title}</span>
              <span>{task.description}</span>
              <button
                onClick={() => deleteTask(task.id)}
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

export default TaskManagement;
