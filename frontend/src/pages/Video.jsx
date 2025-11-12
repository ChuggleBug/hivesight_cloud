import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import apiFetch from "../util/apiFetch";
import { useNavigate } from "react-router-dom";

export default function Video() {
  const navigate = useNavigate();
  const [image, setImage] = useState("/src/assets/default.jpg");
  const [videoUrl, setVideoUrl] = useState(null);
  const [eventDate, setEventDate] = useState("unknown");
  const [eventTime, setEventTime] = useState("unknown");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch video preview (thumbnail + info)
  const fetchVideoInformation = async () => {
    const response = await apiFetch(
      `/api/video/preview?user=${localStorage.getItem('user')}&video_id=${localStorage.getItem(
        "video_id"
      )}`
    );

    if (!response.ok) {
      console.log("Issue fetching video preview");
      return;
    }

    const data = await response.json();
    setImage(`data:image/jpeg;base64,${data.thumbnail}`);

    const date = new Date(data.creation_date);
    setEventDate(
      date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
    setEventTime(
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // Fetch full video when play is clicked
  const fetchAndPlayVideo = async () => {
    const response = await apiFetch(
      `/api/video/play?user=${localStorage.getItem('user')}&video_id=${localStorage.getItem(
        "video_id"
      )}`
    );

    if (!response.ok) {
      console.log("Issue fetching video file");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(
        `http://localhost:3000/api/video/delete?user=${localStorage.getItem('user')}&video_id=${localStorage.getItem(
          "video_id"
        )}`,
        { method: "DELETE" }
      );
      alert("Video deleted successfully!");
      setShowDeleteModal(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Error deleting video.");
    }
  };

  useEffect(() => {
    fetchVideoInformation();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      {/* Main Content */}
      <div className="lg:flex gap-10 w-full max-w-5xl p-6 items-start z-10">
        {/* Image or Video Display */}
        <div className="flex flex-col gap-6 w-full lg:w-[600px]">
          <div className="relative w-full aspect-video overflow-hidden shadow-md">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={image}
                  alt="Captured"
                  className="object-cover w-full h-full transition duration-300 ease-in-out brightness-75"
                />
                {/* Play Button Overlay */}
                <button
                  onClick={fetchAndPlayVideo}
                  className="absolute inset-0 flex justify-center items-center group"
                >
                  <div className="bg-black/50 rounded-full p-6 transition duration-300 group-hover:bg-black/70">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between bg-hvs-yellow p-5 rounded-xl shadow-sm">
            <button className="hvs_btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        {/* Capture Info (Top-aligned) */}
        <div className="mt-8 lg:mt-0 text-left flex flex-col justify-start">
          <h1 className="text-2xl font-semibold mb-4">Capture Information</h1>
          <p className="hvs-text">Video from: {eventDate}</p>
          <p className="hvs-text">Event Time: {eventTime}</p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-hvs-yellow rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h1>
            <p className="hvs-text mb-6">
              Are you sure you want to delete this video? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="hvs_btn bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="hvs_btn bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
