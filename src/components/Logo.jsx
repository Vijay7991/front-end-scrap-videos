import { Link } from "react-router-dom";
import "./Logo.css";

function Logo() {
  return (
    <Link to="/" className="site-logo" aria-label="BFMILK.COM — Go to home">
      <span className="site-logo-text">BFMILK</span>
      <span className="site-logo-dot">.COM</span>
    </Link>
  );
}

export default Logo;
