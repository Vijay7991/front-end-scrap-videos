import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import "./Footer.css";

function Footer() {

  return (

    <footer className="footer-main">

      <div className="container">

        <div className="row footer-row">

          {/* LEFT */}

          <div className="col-lg-4 col-12 footer-disclaimer">

            <h5 className="footer-title">Disclaimer</h5>

            <p>
              All content is taken from various other websites. None of the
              files are stored on our own server. All the files we are sharing
              are already available on the internet. bfmilk.com does not own
              any of these provided files and it does not accept responsibility
              for contents hosted on third party websites.
            </p>

          </div>


          {/* CENTER */}

          <div className="col-lg-4 col-12 footer-center">

            <div className="footer-icons">

              <div className="social-circle x">
                <XIcon />
              </div>

              <div className="social-circle insta">
                <InstagramIcon />
              </div>

              <div className="social-circle telegram">
                <TelegramIcon />
              </div>

              <div className="social-circle facebook">
                <FacebookIcon />
              </div>

            </div>

            <div className="telegram-box">
              JOIN OUR TELEGRAM CHANNEL
            </div>

          </div>


          {/* RIGHT */}

          <div className="col-lg-4 col-12 footer-links">

            <a href="/about">ABOUT US</a>
            <a href="/contact">CONTACT US</a>
            <a href="/privacy">PRIVACY POLICY</a>
            <a href="/terms">TERMS OF USE</a>
            <a href="/advertise">ADVERTISE</a>
            <a href="/2257">18 USC 2257</a>

          </div>

        </div>


        <div className="footer-bottom">

          Copyright © 2025 - 2026 bfmilk.com |
          High-resolution videos in small file sizes.

        </div>

      </div>

    </footer>

  );

}

export default Footer;