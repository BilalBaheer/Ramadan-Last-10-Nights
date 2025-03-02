import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BsMoonStars, BsHeart, BsPersonCircle } from 'react-icons/bs';

const Header = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Ramadan 2025 is expected to begin around March 1, 2025
    // Last 10 nights would start around March 22, 2025 (21st night of Ramadan)
    const lastTenNightsDate = new Date('March 22, 2025 00:00:00');
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = lastTenNightsDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // If we're already in the last 10 nights
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleScheduleDonations = () => {
    // Scroll to the scheduler tab
    document.querySelector('a[href="#schedule"]').click();
  };

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
            </Nav>
            <Nav>
              <Button variant="success" className="donate-now-btn">
                <BsHeart size={18} className="me-2" />
                Donate Now
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <div className="mission-banner py-4 text-center" style={{
        background: '#1e293b',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Container>
          <div className="mission-content">
            <h2 className="text-white mb-0" style={{ fontWeight: '300' }}>
              <span style={{ color: '#f1c40f', fontWeight: '600' }}>Seek Laylatul Qadr</span> by giving charity 
              <span style={{ color: '#e74c3c', fontWeight: '600' }}> every night</span> of the last 10 nights
            </h2>
          </div>
        </Container>
      </div>
      
      <div className="hero-section text-center">
        <Container fluid className="hero-container">
          <h1 className="display-4 fw-bold mb-3">Maximize Your Blessings</h1>
          <p className="lead mb-4">
            Schedule your donations for the last 10 nights of Ramadan and multiply your rewards
          </p>
          <div className="countdown-timer mb-4">
            <div className="d-flex justify-content-center">
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="countdown-label">Minutes</span>
              </div>
            </div>
            <p className="countdown-caption">Until the Last 10 Nights begin</p>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            className="px-4 py-2"
            onClick={handleScheduleDonations}
          >
            Schedule Your Donations
          </Button>
        </Container>
      </div>
    </header>
  );
};

export default Header;
