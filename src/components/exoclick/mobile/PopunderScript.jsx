import { useEffect } from "react";

const PopunderScript = () => {
    useEffect(() => {
        // ✅ Run only once per session
        if (sessionStorage.getItem("popunder_done")) return;

        // ✅ Prevent duplicate script
        if (document.getElementById("exo-script")) return;

        // ✅ Global Ad Config
        window.adConfig = {
            ads_host: "a.pemsrv.com",
            syndication_host: "s.pemsrv.com",
            idzone: 5891746, // 🔴 change if needed
            trigger_method: 1,
            popup_force: true
        };

        // ✅ Load ExoClick Script
        const script = document.createElement("script");
        script.src = "https://a.pemsrv.com/popunder1000.js";
        script.async = true;
        script.id = "exo-script";

        document.body.appendChild(script);

        // ✅ Mark as loaded
        sessionStorage.setItem("popunder_done", "true");

        // -----------------------------------
        // 🔥 FORCE TRIGGER (backup)
        // -----------------------------------
        const forceTrigger = () => {
            try {
                document.dispatchEvent(new Event("click"));
            } catch (e) { }
        };

        window.addEventListener("scroll", forceTrigger, { once: true });
        window.addEventListener("click", forceTrigger, { once: true });

        // -----------------------------------
        // 🚫 ADBLOCK DETECTION
        // -----------------------------------
        setTimeout(() => {
            const adTest = document.createElement("div");
            adTest.className = "adsbox";
            adTest.style.height = "1px";
            document.body.appendChild(adTest);

            if (adTest.offsetHeight === 0) {
                showAdblockPopup();
            }

            adTest.remove();
        }, 2000);

        // -----------------------------------
        // 🧱 POPUP UI
        // -----------------------------------
        const showAdblockPopup = () => {
            const overlay = document.createElement("div");
            overlay.style = `
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background: rgba(0,0,0,0.9);
        z-index:9999;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        text-align:center;
        padding:20px;
      `;

            overlay.innerHTML = `
        <div>
          <h2>AdBlock Detected 🚫</h2>
          <p>Please disable AdBlock to continue using this site.</p>
          <button id="reloadBtn" style="
            padding:10px 20px;
            margin-top:10px;
            background:red;
            color:white;
            border:none;
            cursor:pointer;
          ">
            I Disabled, Reload
          </button>
        </div>
      `;

            document.body.appendChild(overlay);

            document.getElementById("reloadBtn").onclick = () => {
                window.location.reload();
            };
        };

        // -----------------------------------
        // CLEANUP
        // -----------------------------------
        return () => {
            const old = document.getElementById("exo-script");
            if (old) old.remove();
        };
    }, []);

    return null;
};

export default PopunderScript;