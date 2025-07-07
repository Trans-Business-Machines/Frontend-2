import React, { useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import "./Toast.css";

/**
 * Toast notification component.
 * 
 * @param {Object} props
 * @param {string} props.message - The toast message to display.
 * @param {'success'|'error'} [props.type='success'] - Type of toast, affects color and icon.
 * @param {function} props.onClose - Callback when toast should be closed.
 * @param {number} [props.duration=3500] - How long before auto-close (ms).
 */
export default function Toast({ message, type = "success", onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      className={
        "toast-notification" +
        (type === "error" ? " toast-notification--error" : "")
      }
      role="alert"
      aria-live="assertive"
    >
      <span className="toast-icon">
        {type === "error" ? <MdErrorOutline /> : <AiOutlineCheckCircle />}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <IoClose />
      </button>
    </div>
  );
}