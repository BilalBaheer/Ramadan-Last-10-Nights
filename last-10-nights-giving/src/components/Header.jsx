import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BsMoonStars, BsHeart, BsPersonCircle } from 'react-icons/bs';

const Header = () => {
  return (
    <header className="header-wrapper">
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
        <Container fluid>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <BsMoonStars size={24} className="me-2" />
            <span className="brand-text">Last 10 Nights Giving</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" className="nav-item">Home</Nav.Link>
              <Nav.Link href="#charities" className="nav-item">Charities</Nav.Link>
              <Nav.Link href="#about" className="nav-item">About Laylatul Qadr</Nav.Link>
              <Nav.Link href="#faq" className="nav-item">FAQ</Nav.Link>
            </Nav>
            <Nav>
              <Button variant="outline-light" className="me-2 auth-button">
                <BsPersonCircle size={18} className="me-2" />
                Sign In
              </Button>
              <Button variant="success" className="donate-now-btn">
                <BsHeart size={18} className="me-2" />
                Donate Now
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <div className="hero-section text-center">
        <Container fluid className="hero-container">
          <h1 className="display-4 fw-bold mb-3">Maximize Your Blessings</h1>
          <p className="lead mb-4">
            Schedule your donations for the last 10 nights of Ramadan and multiply your rewards
          </p>
          <div className="countdown-timer mb-4">
            <div className="d-flex justify-content-center">
              <div className="countdown-item">
                <span className="countdown-number">12</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">08</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">45</span>
                <span className="countdown-label">Minutes</span>
              </div>
            </div>
            <p className="countdown-caption">Until the Last 10 Nights begin</p>
          </div>
          <Button variant="primary" size="lg" className="px-4 py-2">
            Schedule Your Donations
          </Button>
        </Container>
      </div>
    </header>
  );
};

export default Header;
