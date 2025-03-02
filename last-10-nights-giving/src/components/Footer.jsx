import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsMoonStars, BsEnvelope, BsGeoAlt, BsPhone, BsFacebook, BsTwitter, BsInstagram, BsLinkedin } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container fluid>
        <Row className="py-4 px-3 px-md-5">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <div className="footer-logo d-flex align-items-center">
              <BsMoonStars size={24} className="me-2 text-light" />
              <h5 className="mb-0">Last 10 Nights Giving</h5>
            </div>
            <p className="footer-about">
              Our mission is to make it easy for Muslims to maximize their charitable giving during the blessed last 10 nights of Ramadan, potentially catching Laylatul Qadr and multiplying their rewards.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><BsFacebook /></a>
              <a href="#" className="social-icon"><BsTwitter /></a>
              <a href="#" className="social-icon"><BsInstagram /></a>
              <a href="#" className="social-icon"><BsLinkedin /></a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Charities</a></li>
              <li><a href="#">About Laylatul Qadr</a></li>
              <li><a href="#">Donation Scheduler</a></li>
              <li><a href="#">Donation Tracker</a></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Resources</h5>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Charity Verification</a></li>
              <li><a href="#">Donation Guide</a></li>
              <li><a href="#">Ramadan Calendar</a></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6}>
            <h5 className="footer-heading">Contact Us</h5>
            <ul className="footer-contact">
              <li>
                <BsGeoAlt />
                <span>123 Charity Lane, San Francisco, CA 94107</span>
              </li>
              <li>
                <BsPhone />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <BsEnvelope />
                <span>info@last10nights.org</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="py-3 px-3 px-md-5">
          <Col md={6}>
            <p className="mb-0"> 2023 Last 10 Nights Giving. All rights reserved.</p>
          </Col>
          <Col md={6}>
            <ul className="footer-bottom-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
