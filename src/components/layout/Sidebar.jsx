import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="section-menu-left bg-gray-800 text-white">
      <div className="box-logo p-4">
        <Link to="/dashboard">
          <img
            src="/images/logo/logo.svg"
            alt="Logo"
            className="w-32 mx-auto"
          />
        </Link>
      </div>
      <ul className="mt-4">
        <li className="menu-item p-4 hover:bg-gray-700">
          <Link to="/dashboard" className="flex items-center gap-2">
            <i className="icon-home"></i>
            <span>لوحة التحكم</span>
          </Link>
        </li>
        <li className="menu-item p-4 hover:bg-gray-700">
          <Link to="/management" className="flex items-center gap-2">
            <i className="icon-layers"></i>
            <span>الإدارة</span>
          </Link>
        </li>
        <li className="menu-item p-4 hover:bg-gray-700">
          <Link to="/reports-management" className="flex items-center gap-2">
            <i className="icon-pie-chart"></i>
            <span>التقارير</span>
          </Link>
        </li>
        <li className="menu-item p-4 hover:bg-gray-700">
          <Link to="/analytics-management" className="flex items-center gap-2">
            <i className="icon-bar-chart"></i>
            <span>الإحصائيات</span>
          </Link>
        </li>
        <li className="menu-item p-4 hover:bg-gray-700">
          <Link to="/operations-management" className="flex items-center gap-2">
            <i className="icon-layers"></i>
            <span>العمليات</span>
          </Link>
        </li>
        <li className="menu-item p-4 hover:bg-gray-700">
          <Link to="/settings" className="flex items-center gap-2">
            <i className="icon-settings"></i>
            <span>الإعدادات</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
