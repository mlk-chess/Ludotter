import { useState, useEffect } from "react";

interface UserData {
    ip: string;
    language: string;
}

const useAnalytics = (): UserData | null => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                const language = navigator.language;
                setUserData({ ip: data.ip, language: language });
            } catch (error) {
                console.error(error);
            }
        };

        getUserData();

        const handleUnload = () => {
            setUserData(null);
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);

    return userData;
};

export default useAnalytics;
