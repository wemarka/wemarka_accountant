import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import "./i18n.js"; // تضمين i18n

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);