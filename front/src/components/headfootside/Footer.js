import React from 'react';
import './Main.css'
import './Footer.css'; // 스타일을 위한 CSS 파일 (필요에 따라 파일명 변경)
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faInstagram, faSquareFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="footer-distributed">
      <div style={{display:'flex', justifyContent:'center', alignContent:'center'}}>
        <div className="footer-left">
        <Link to="/mainpage"><img src='/images/login/elogo.png' style={{width: '250px', cursor: 'pointer'}} alt="홈" /></Link>
          <p className="footer-links">
            <a href="#" className="link-1">Home</a>
            <a href="#">Notice</a>
            <a href="#">About</a>
            <a href="#">Faq</a>
            <a href="#">Contact</a>
          </p>
          <p className="footer-company-name">ZERO TOGETHER © 2024</p>
        </div>

        <div className="footer-center">
          <div>
            <FontAwesomeIcon icon={faLocationDot} size="xl" style={{color: "#ffffff", marginRight:'15'}} />
            <p><span>Samwon Tower 406</span>124 Teheran-ro, Gangnam-gu, Seoul</p>
          </div><br/>
          <div>
            <FontAwesomeIcon icon={faPhone} size="xl" style={{color: "#ffffff", marginRight:'15'}} />
            <p>+82.10.8012.1965</p>
          </div><br/>
          <div>
            <FontAwesomeIcon icon={faEnvelope} size="xl" style={{color: "#ffffff", marginRight:'15'}} />
            <p><a href="mailto:support@company.com">zerotogather@gmail.com</a></p>
          </div>
        </div>

        <div className="footer-right">
          <p className="footer-company-about">
            <span>About &nbsp;&nbsp; ZERO TOGETHER</span>
            Your guide to sustainable living, offering tips, resources, and community insights on Zero waste, Recycling and Upcycling.
          </p>
          {/* <div className="footer-icons">
            <a href="#"><FontAwesomeIcon icon={faInstagram} size="2xl" style={{color: "#ffffff"}} /></a>&nbsp;&nbsp;&nbsp;
            <a href="#"><FontAwesomeIcon icon={faTwitter} size="2xl" style={{color: "#ffffff"}} /></a>&nbsp;&nbsp;&nbsp;
            <a href="#"><FontAwesomeIcon icon={faSquareFacebook} size="2xl" style={{color: "#ffffff"}} /></a>&nbsp;&nbsp;&nbsp;
            <a href="#"><FontAwesomeIcon icon={faGithub} size="2xl" style={{color: "#ffffff",}} /></a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
