import { FaRegUser } from "react-icons/fa";

import LocalStorageManager from "../util/localStorageManager";

function AppHeader() {

    return (
        <>
            <div className="p-4 bg-hvs-yellow flex w-full justify-between fixed top-0 left-0">
                <p>HiveSight</p>

                {/* Greeting only appears if user is logged in*/}
                { LocalStorageManager.isLoggedIn() ?
                    <div className="flex items-center gap-2">
                        <p>Welcome, {LocalStorageManager.getCurrentUsername()}</p>
                        <FaRegUser color="var(--color-hvs-white)" size={20}/>  
                    </div>
                :
                    <></>
                }
            </div>
        </>
    );
}

export default AppHeader;