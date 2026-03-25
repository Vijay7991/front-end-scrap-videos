import { useEffect, useRef } from "react";

function AdBanner() {

    const adRef = useRef(null);

    useEffect(() => {

        if (!adRef.current) return;

        // clear previous ads
        adRef.current.innerHTML = "";

        // create script
        const script1 = document.createElement("script");
        script1.src = "https://a.magsrv.com/ad-provider.js";
        script1.async = true;

        const ins = document.createElement("ins");
        ins.className = "eas6a97888e2";
        ins.setAttribute("data-zoneid", "5875030");

        const script2 = document.createElement("script");
        script2.innerHTML = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;

        adRef.current.appendChild(script1);
        adRef.current.appendChild(ins);
        adRef.current.appendChild(script2);

    }, []);

    return (
        <div
            ref={adRef}
            style={{ textAlign: "center", margin: "10px 0" }}
        />
    );
}

export default AdBanner;