import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoPreview from "../components/VideoPreview";
import apiFetch from "../util/apiFetch";

function Home() {
    // Ensure that the user is not in this page when logging in
    const [previews, setPreviews] = useState([]);
    const [noVideos, setNoVideos] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const navigate = useNavigate();

    // During development, vite loads the page twice.
    // This causes issues when displaying previews
    // on screen
    let complete = false;
    useEffect(() => {
        if (complete) {
            return;
        }
        if (!Boolean(localStorage.getItem('token'))) {
            navigate("/login");
        }
        getVideoPreveiews();
        complete = true;
    }, []);

    const getVideoPreveiews = async () => {
        try {
            const response = await apiFetch(`/api/video/previews?user=${localStorage.getItem('user')}`)
            if (!response.ok) {
                return;
            }

            const data = await response.json();

            setNoVideos(data.previews.length == 0);

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
        } catch {
            setLoadError(true);
            setNoVideos(true);
        }
    }

    return (
        <div className="h-full w-full">
            {
                (noVideos || loadError) ?
                    <div className="flex flex-col h-full w-full justify-center items-center">
                        <div className="bg-hvs-yellow rounded-2xl px-10 py-5 shadow-md">
                            {loadError ?
                                <div>
                                    <p className="hvs-text">Error loading videos!</p>
                                </div>
                                :
                                <div>
                                    <p className="hvs-text">No videos for now</p>
                                    <p className="hvs-text">Stay Safe!</p>
                                </div>
                            }
                        </div>
                    </div>
                    :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 place-items-center gap-5 p-5">
                        {previews}
                    </div>
            }
        </div>
    );
}

export default Home