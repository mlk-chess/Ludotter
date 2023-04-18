import { useEffect, useRef } from "react";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

interface UserData {
    id: string | null;
    ip: string;
    language: string;
    userAgent: string;
    path: string;
    date: Date;
}

const useAnalytics = (): void => {
    const userData = useRef<UserData | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                const language = navigator.language;
                const userAgent = navigator.userAgent;
                const path = window.location.pathname;

                let id: string | null = localStorage.getItem('userId');
                if (!id) {
                    id = uuidv4();
                    if (typeof id === "string") {
                        localStorage.setItem('userId', id);
                    }
                }

                userData.current = { ip: data.ip, language: language, userAgent: userAgent, id: id, date: new Date(), path: path };
                navigator.sendBeacon('/analytics', JSON.stringify(userData.current));
            } catch (error) {
                console.error(error);
            }
        };

        getUserData();

        const handleUnload = () => {
            if (userData.current) {
                userData.current = null;
            }
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);

};

export default useAnalytics;
