import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import "./AgeGate.css";

function AgeGate() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const isAccepted = localStorage.getItem("ageAccepted");

        if (!isAccepted) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("ageAccepted", "true");
        setShow(false);
    };

    const handleDecline = () => {
        window.location.href = "https://www.google.com";
    };

    if (!show) return null;

    return (
        <div className="agegate-overlay">
            <motion.div
                className="agegate-box"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="icon">
                    <WarningAmberIcon sx={{ fontSize: 50, color: "#ff4444" }} />
                </div>

                <h2>18+ Age Confirmation</h2>

                <p>
                    This website contains adult content. You must be 18 years or older to enter.
                </p>

                <div className="buttons">
                    <button className="btn yes" onClick={handleAccept}>
                        I am 18+
                    </button>

                    <button className="btn no" onClick={handleDecline}>
                        Exit
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default AgeGate;