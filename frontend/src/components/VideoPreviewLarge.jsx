import LocalStorageManager from "../util/localStorageManager";

export default function VideoPreviewLarge( {video_id} ) {


    const fetchVideoInformation = async () => {
        const data = await fetch(`http://localhost:3000/api/video/preview?user=${LocalStorageManager.getCurrentUsername()}&video_id=${video_id}`);
        
    }
    
    return (
        <div className="lg:flex">
            <div className="flex flex-col">
                <div>image</div>
                <div className="flex justify-between">
                    <button className="hvs_btn" >Delete</button>
                    <button className="hvs_btn">Download</button>
                </div>
            </div>
            <div>
                <h1>Capture Information</h1>
            </div>
        </div>
    );
}