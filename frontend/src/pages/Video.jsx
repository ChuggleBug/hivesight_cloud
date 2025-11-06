
import VideoPreviewLarge from "../components/VideoPreviewLarge";

export default function Video() {

    return (
        <div className="w-full flex justify-center">
            <VideoPreviewLarge
                video_id={localStorage.getItem('video_id')}
            />
        </div>
    );
}