import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-hvs-black-dark text-white w-64 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold">Account Menu</h1>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col py-2 space-y-3 p-4">
          <button
            className="w-full bg-hvs-black py-2 rounded"
            onClick={handleLogout}
          >
            <p className="text-white">Logout</p>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
