import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function VideoPreview({ id, image, creationDate }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const date = new Date(creationDate);
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
    localStorage.setItem("video_id", id);
    navigate("/video");
  };

  const handleVideoDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/video/delete?user=${localStorage.getItem('user')}&video_id=${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete video");

      alert("Video deleted successfully!");
      setShowDeleteModal(false);

      // Optionally refresh page or parent list
      window.location.reload(); 
      // or use a callback from parent to update UI dynamically
    } catch (err) {
      console.error(err);
      alert("Error deleting video.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center relative">
      {/* Thumbnail Button */}
      <button
        className="group aspect-video w-full max-w-[600px] overflow-hidden bg-gray-300 focus:outline-none"
        onClick={handleVideoEnter}
      >
        <img
          src={image}
          alt="Video preview"
          className="h-full w-full transition duration-300 ease-in-out group-hover:brightness-75 group-focus:brightness-75 shadow-2xl"
        />
      </button>

      {/* Info + Delete Button */}
      <div className="flex justify-between py-2 mt-2 md:px-2 rounded-lg gap-2 text-white w-full">
        <div className="hvs-text text-start">
          <p>Video from: {formattedDate}</p>
          <p>Event Time: {formattedTime}</p>
        </div>
        <button onClick={handleVideoDelete}>
          <FaRegTrashAlt className="hvs_trash" size={34} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-hvs-yellow rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h1>
            <p className="hvs-text mb-6">
              Are you sure you want to delete this video? This action cannot be undone.
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
