import React, { useEffect } from 'react';

const AdBanner = ({ zoneId, className, height = '90px' }) => {
    useEffect(() => {
        const scriptId = 'magsrv-ad-script';
        let script = document.getElementById(scriptId);

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://a.magsrv.com/ad-provider.js";
            script.async = true;
            script.type = "application/javascript";
            document.body.appendChild(script);
        }

        // ExoClick requires the push for each instance
        try {
            (window.AdProvider = window.AdProvider || []).push({ "serve": {} });
        } catch (error) {
            console.error("AdProvider error:", error);
        }
    }, [zoneId]);

    return (
        <div
            className="ad-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: height,
                width: '100%',      // Ensures it takes full width of parent
                maxWidth: '100vw',  // Prevents horizontal scrolling
                overflow: 'hidden',  // Blocks ad from breaking layout
                margin: '10px auto'
            }}
        >
            <ins
                className={className}
                data-zoneid={zoneId}
                style={{ display: 'inline-block' }} // Important for proper sizing
            ></ins>
        </div>
    );
};

export default AdBanner;