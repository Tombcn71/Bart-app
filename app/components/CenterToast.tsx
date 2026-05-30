"use client";
import { useEffect, useState } from "react";

type ToastState = { message: string; type: "success" | "error" } | null;

let _show: ((msg: string, type?: "success" | "error") => void) | null = null;

export function showToast(message: string, type: "success" | "error" = "success") {
  _show?.(message, type);
}

export function CenterToast() {
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    _show = (message, type = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    };
    return () => { _show = null; };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
      <div
        className="bg-white rounded-2xl shadow-2xl px-10 py-7 flex flex-col items-center gap-3 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
        style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.18)" }}>
        {toast.type === "success" ? (
          <div className="w-12 h-12 rounded-full bg-[#1066a3] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        )}
        <p className="text-[#1a1a1a] font-bold text-base text-center max-w-xs">{toast.message}</p>
      </div>
    </div>
  );
}
