"use client"; // Ensure it runs only on the client

import { useEffect } from "react";


declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: any;
    }
}



export default function FacebookSDK() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: "1315134266276716", // Replace with your Facebook App ID
                    cookie: true,
                    xfbml: true,
                    version: "v22.0", // Use the latest Graph API version
                });

                window.FB.AppEvents.logPageView();
            };

            // Load Facebook SDK Script
            if (!document.getElementById("facebook-jssdk")) {
                const script: HTMLScriptElement = document.createElement("script"); // ✅ Explicitly define the type
                script.id = "facebook-jssdk";
                script.src = "https://connect.facebook.net/en_US/sdk.js";
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            }
        }
    }, []);

    return null; // This component does not render anything
}
