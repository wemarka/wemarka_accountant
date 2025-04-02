import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("حدث خطأ أثناء تحميل المشاريع.");
      }
    };

    fetchProjects();
  }, []);

  const addProject = async () => {
    if (!newProject.name || !newProject.description) {
      toast.error("يرجى إدخال جميع الحقول!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "projects"), newProject);
      setProjects((prev) => [...prev, { id: docRef.id, ...newProject }]);
      setNewProject({ name: "", description: "" });
      toast.success("تمت إضافة المشروع بنجاح!");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("حدث خطأ أثناء إضافة المشروع.");
    }
  };

  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter((project) => project.id !== id));
      toast.success("تم حذف المشروع بنجاح!");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("حدث خطأ أثناء حذف المشروع.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">جاري تحميل المشاريع...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">إدارة المشاريع</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="اسم المشروع"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <input
            type="text"
            placeholder="وصف المشروع"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={addProject}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            إضافة مشروع
          </button>
        </div>
        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{project.name}</span>
              <span>{project.description}</span>
              <button
                onClick={() => deleteProject(project.id)}
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

export default ProjectManagement;
