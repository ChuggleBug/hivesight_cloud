import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LocalStorageManager from "../util/localStorageManager";

export default function VideoPreview( { id, image, creationDate} ) {
    const date = new Date(creationDate);
    const navigate = useNavigate()
    const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    const handleVideoEnter = async () => {
        localStorage.setItem('video_id', id);
        navigate('/video')
    }

    const handleVideoDelete = async () => {
        
    }

    return (
            <div className="flex flex-col justify-center items-center" >
                <button 
                    className="group aspect-video w-full max-w-[600px] overflow-hidden bg-gray-300 focus:outline-none" 
                    onClick={handleVideoEnter}
                >
                    <img
                        src={image}
                        className="h-full w-full transition duration-300 ease-in-out group-hover:brightness-75 group-focus:brightness-75 shadow-2xl"
                    />
                </button>

                <div className="flex justify-between py-2 mt-2 md:px-2 rounded-lg gap-2 text-white w-full">
                    <div className="hvs-text text-start">
                        <p>Video from: {formattedDate}</p>
                        <p>Event Time: {formattedTime}</p>
                    </div>
                    <button onClick={handleVideoDelete}>
                        <FaRegTrashAlt
                            className="hvs_trash"
                            size={34}
                        />
                    </button>
                </div>
            </div>
    );
}
