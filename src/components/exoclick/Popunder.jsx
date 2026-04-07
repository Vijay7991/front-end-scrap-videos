import { useEffect } from "react";

function Popunder() {
    useEffect(() => {
        if (document.getElementById("exo-popunder")) return;

        const script = document.createElement("script");
        script.id = "exo-popunder";
        script.src = "//a.pemsrv.com/popunder1000.js";
        script.async = true;

        // ✅ your config (converted)
        script.setAttribute("data-exo-ads_host", "a.pemsrv.com");
        script.setAttribute("data-exo-syndication_host", "s.pemsrv.com");
        script.setAttribute("data-exo-idzone", "5891746");

        script.setAttribute("data-exo-popup_force", "true");
        script.setAttribute("data-exo-popup_fallback", "true");

        script.setAttribute("data-exo-new_tab", "true");
        script.setAttribute("data-exo-chrome_enabled", "true");

        script.setAttribute("data-exo-frequency_period", "180");
        script.setAttribute("data-exo-frequency_count", "1");

        script.setAttribute("data-exo-trigger_method", "1");

        document.body.appendChild(script);

    }, []);

    return null;
}

export default Popunder;