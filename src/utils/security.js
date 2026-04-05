
export const disableBasicInspect = () => {
    const preventDefault = (e) => e.preventDefault();

    // Disable right click
    document.addEventListener("contextmenu", preventDefault);

    // Disable common inspect shortcuts
    const keyHandler = (e) => {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
            (e.ctrlKey && e.key === "U")
        ) {
            e.preventDefault();
            return false;
        }
    };

    document.addEventListener("keydown", keyHandler);

    // Cleanup function (important for React)
    return () => {
        document.removeEventListener("contextmenu", preventDefault);
        document.removeEventListener("keydown", keyHandler);
    };
};

export const detectDevTools = (onDetect) => {
    const threshold = 160;

    const check = () => {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
            onDetect();
        }
    };

    const interval = setInterval(check, 1000);

    return () => clearInterval(interval);
};