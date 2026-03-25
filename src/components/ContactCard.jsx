import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import "./ContactCard.css";


function ContactCard() {

    const navigate = useNavigate();

    return (

        <div className="contact-wrapper">

            <div className="contact-card">

                {/* Avatar */}
                <div className="avatar-circle">
                    <PersonIcon style={{ fontSize: 70 }} />
                </div>

                {/* Name */}
                <h2 className="contact-name">
                    ANNIYAN
                </h2>

                {/* Description */}
                <p className="contact-text">

                    We're all about delivering high-quality videos in
                    small file sizes. For any issues or feedback,
                    please don’t hesitate to reach out.

                </p>

                {/* Button */}

                <button
                    className="contact-btn"
                    onClick={() => navigate("/contact")}
                >
                    Contact Me
                </button>

            </div>

        </div>

    );

}

export default ContactCard;