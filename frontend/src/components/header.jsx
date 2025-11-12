import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";

import LocalStorageManager from "../util/localStorageManager";
import Sidebar from "./Sidebar";

export default function AppHeader() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setUsername(LocalStorageManager.getCurrentUsername());
  }, []);

  return (
    <div className="p-4 bg-hvs-yellow flex justify-between w-full fixed top-0 left-0 z-50">
      <button onClick={() => navigate('/')}>
        <p className="hvs-text">HiveSight</p>
      </button>

      {LocalStorageManager.isLoggedIn() && (
        <div className="flex items-center gap-2">
          <p className="hvs-text">Welcome, {username}</p>
          <button onClick={() => setSidebarOpen(true)}>
            <FaRegUser color="var(--color-hvs-white)" size={20} />
          </button>
        </div>
      )}

      {/* Sidebar rendered at root level */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
    </div>
  );
}
