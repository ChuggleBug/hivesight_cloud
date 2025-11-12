import { FaRegUser } from "react-icons/fa";

import LocalStorageManager from "../util/localStorageManager";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppHeader() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        setUsername(LocalStorageManager.getCurrentUsername());
    }, [username])

    return (
        <div className="p-4 bg-hvs-yellow flex justify-between w-full">
            <button onClick={() => navigate('/')}>
                <p className="hvs-text">HiveSight</p>
            </button>

            {/* Greeting only appears if user is logged in*/}
            {LocalStorageManager.isLoggedIn() ?
                <div className="flex items-center gap-2">
                    <p className="hvs-text">Welcome, {username}</p>
                    <FaRegUser color="var(--color-hvs-white)" size={20} />
                </div>
                :
                <></>
            }
        </div>
    );
}