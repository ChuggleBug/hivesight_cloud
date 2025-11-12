import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalStorageManager from "../util/localStorageManager";
import VideoPreview from "../components/VideoPreview";

import apiFetch from "../util/apiFetch";

function Home() {
    // Ensure that the user is not in this page when logging in
    const [previews, setPreviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!LocalStorageManager.isLoggedIn()) {
            navigate("/login");
        }
        getVideoPreveiews();
        complete = true;
    }, []);

    const getVideoPreveiews = async () => {
        const response = await apiFetch(`/api/video/previews?user=${LocalStorageManager.getCurrentUsername()}`)
        if (!response.ok) {
            return;
        }

        const data = await response.json();

        data.previews.forEach(preview => {
            setPreviews((prev) => [
                ...prev,
                <VideoPreview
                key={preview.video_id}
                id={preview.video_id}
                image={`data:image/jpeg;base64,${preview.thumbnail}`}
                creationDate={preview.creation_date}
                />
            ]);
        });
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 place-items-center gap-5 p-5">
            {previews}
        </div>

    );
}

export default Home