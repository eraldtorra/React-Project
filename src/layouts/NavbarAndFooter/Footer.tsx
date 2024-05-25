import React, { useEffect } from 'react';
import '../../Css/footer.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';

export const Footer = () => {
    return (
        <div className='bot'>
        <footer className="footer">
            <div className="section">
                <h3> Library App, Inc</h3>
                <p>Exercitationem expedita id illum ipsum pariatur quia ratione sapiente soluta totam voluptate!</p>
                <div className="socialMedia">
                    <a href="#" aria-label="Facebook">
                        <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a href="#" aria-label="Twitter">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <FontAwesomeIcon icon={faLinkedinIn} />
                    </a>
                    <a href="#" aria-label="Instagram">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                </div>
            </div>
            <div className="section">
                <h3>Company</h3>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/advertising">Advertising</Link>
            </div>
            <div className="section">
                <h3>Legal Stuff</h3>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-service">Terms of Service</Link>
                <Link to="/cookie-policy">Cookie Policy</Link>
            </div>
            <div className="section">
                <h3>Help</h3>
                <Link to="/knowledge-base">Knowledge Base</Link>
                <Link to="/support">Support</Link>
            </div>
        </footer>
        </div>
    );
};