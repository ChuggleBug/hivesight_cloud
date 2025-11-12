import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiFetch from "../util/apiFetch";

function Login() {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await apiFetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            }),
        });
        
        // Clear out password
        setPassword('')

        const data = await response.json();
        if (!response.ok) {
            setError(data.error)
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', username);
        // Can go home now
        navigate('/');
        window.location.reload();
    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="bg-hvs-yellow p-6 rounded shadow-md w-80">
                <h1>Log in</h1>
                <form className="flex flex-col items-start gap-2" onSubmit={handleLogin}>
                    <div className="flex">
                        <p className="hvs-text">Username</p>
                        <p className="text-red-500 font-bold"> *</p>
                    </div>
                    <input
                        type="text"
                        className="w-full p-2 mb-4 border bg-white border-gray-300 rounded"
                        onChange={(e) => {
                            if (error) setError('');
                            setUsername(e.target.value)
                        }}
                        value={username}
                        required
                    />
                    <div className="flex">
                        <p className="hvs-text">Password</p>
                        <span className="text-red-500 font-bold"> *</span>
                    </div>
                    <input
                        type="password"
                        className="w-full p-2 mb-4 border bg-white border-gray-300 rounded"
                        onChange={(e) => {
                            if (error) setError('');
                            setPassword(e.target.value)
                        }}
                        value={password}
                        required
                    />
                    <div className="flex justify-between w-full">
                        <button className="hvs_btn" type="button" onClick={() => navigate('/signup')}>
                            <p className="hvs-text">Sign up</p>
                        </button>
                        <button className="hvs_btn" type="submit">
                            <p className="hvs-text">Login</p>
                        </button>
                    </div>
                    <span className="w-full text-red-500 text-2xl font-bold">{error}</span>
                </form>
            </div>

        </div>

    );
}


export default Login;