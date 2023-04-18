import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

interface UserData {
    id: string | null;
    ip: string;
    language: string;
    userAgent: string;
}

const useAnalytics = (): UserData | null => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                const language = navigator.language;
                const userAgent = navigator.userAgent;

                let id: string | null = localStorage.getItem('userId'); // récupération du cookie "userId" s'il existe
                if (!id) {
                    id = uuidv4();
                    if (typeof id === "string") {
                        localStorage.setItem('userId', id);
                    }
                }

                setUserData({ ip: data.ip, language: language, userAgent: userAgent, id: id });
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
