import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({ open, onClose = () => {}, children }) => {
  const [visible, setVisible] = useState(open);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => setAnimate(true));
      document.body.style.overflow = "hidden";
    } else {
      setAnimate(false);
      const t = setTimeout(() => setVisible(false), 200);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0" style={{ zIndex: 1001 }} onClick={onClose}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${animate ? "opacity-40" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Scroll container (THIS scrolls) */}
      <div className="relative z-10 h-full overflow-y-auto">
        {/* Centering wrapper */}
        <div className="min-h-full flex items-center justify-center p-4 sm:p-8">
          {/* Modal panel */}
          <div
            className={`
            inline-block
            bg-white rounded-lg shadow-xl
            transform transition-all duration-200
            ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
