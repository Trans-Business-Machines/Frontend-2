import React, { createContext, useContext, useState } from "react";
import "./ToastContext.css";

const ToastContext = createContext(); // Declare only once at the top

export function useToast() {
  return useContext(ToastContext);
}

function Toast({ message, type, onClose }) {
  return (
    <div className={`toast ${type}`}>
      <span className="toast-check">✔</span>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2100);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </ToastContext.Provider>
  );
}