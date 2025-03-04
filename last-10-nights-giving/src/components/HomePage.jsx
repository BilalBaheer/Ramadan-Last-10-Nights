import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useDonations } from '../context/DonationContext';
import { 
  CalendarCheck, 
  CurrencyDollar, 
  EnvelopeAt, 
  Star, 
  PeopleFill, 
  ArrowRight, 
  MoonStarsFill,
  HeartFill,
  LightningChargeFill
} from 'react-bootstrap-icons';

const HomePage = ({ onTabSelect }) => {
  const { donationData } = useDonations();
  
  // Featured charities for the home page
  const featuredCharities = [
    {
      id: 1,
      name: "Islamic Relief USA",
      category: "General Aid",
      description: "Providing emergency relief and development programs worldwide. Focus on sustainable solutions and immediate crisis response.",
      donationLink: "https://irusa.org/",
      imageUrl: "https://placehold.co/600x400/81C784/fff?text=Islamic+Relief",
      impact: "Helped 13M+ people across 40+ countries",
      rating: "4.5/5"
    },
    {
      id: 2,
      name: "Helping Hand USA",
      category: "Orphans",
      description: "Supporting orphans and vulnerable children globally. Providing education, healthcare, and basic necessities.",
      donationLink: "https://hhrd.org/",
      imageUrl: "https://placehold.co/600x400/81C784/fff?text=Helping+Hand",
      impact: "Supporting 10,000+ orphans worldwide",
      rating: "4.8/5"
    },
    {
      id: 3,
      name: "Zakat Foundation",
      category: "Food Relief",
      description: "Providing food security and sustainable development programs. Emergency food distribution and long-term agriculture projects.",
      donationLink: "https://www.zakat.org/",
      imageUrl: "https://placehold.co/600x400/81C784/fff?text=Zakat+Foundation",
      impact: "Distributed 5M+ meals in 2024",
      rating: "4.7/5"
    }
  ];

  // Calculate total donations
  const totalDonations = donationData?.totalDonations || 0;
  
  // Calculate days until Ramadan's last 10 nights
  const lastTenNightsDate = new Date('March 22, 2025 00:00:00');
  const now = new Date();
  const daysUntil = Math.max(0, Math.floor((lastTenNightsDate - now) / (1000 * 60 * 60 * 24)));
  
  return (
    <div className="home-page">
      {/* Welcome Section */}
      <section className="welcome-section mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h2 className="display-5 fw-bold mb-3">Welcome to the Last 10 Nights Giving Platform</h2>
              <p className="lead mb-4">
                A simple way to maximize your charitable giving during the most blessed nights of Ramadan.
              </p>
              <p className="mb-4">
                The Last 10 Nights of Ramadan include Laylatul Qadr (The Night of Power), which is better than a thousand months of worship. 
                Our platform helps you schedule donations for each of these nights, ensuring you don't miss out on the immense rewards.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="me-2"
                  onClick={() => onTabSelect('schedule')}
                >
                  Schedule Donations
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => onTabSelect('charities')}
                >
                  Explore Charities
                </Button>
              </div>
            </Col>
            <Col lg={5}>
              <div className="stats-card p-4 bg-light rounded shadow-sm">
                <div className="d-flex align-items-center mb-4">
                  <div className="stats-icon me-3">
                    <MoonStarsFill size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-0">{daysUntil} days left</h3>
                    <p className="text-muted mb-0">Until Last 10 Nights begin</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="stats-icon me-3">
                    <HeartFill size={32} className="text-danger" />
                  </div>
                  <div>
                    <h3 className="mb-0">${totalDonations.toLocaleString()}</h3>
                    <p className="text-muted mb-0">Total donations so far</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="stats-icon me-3">
                    <LightningChargeFill size={32} className="text-warning" />
                  </div>
                  <div>
                    <h3 className="mb-0">1000× Reward</h3>
                    <p className="text-muted mb-0">On Laylatul Qadr</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <CurrencyDollar size={40} className="text-primary" />
                  </div>
                  <Card.Title>1. Set Your Daily Amount</Card.Title>
                  <Card.Text>
                    Choose how much you want to donate each night during the last 10 nights of Ramadan.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <CalendarCheck size={40} className="text-primary" />
                  </div>
                  <Card.Title>2. Select a Charity</Card.Title>
                  <Card.Text>
                    Choose from our curated list of verified charities working in various regions and causes.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <EnvelopeAt size={40} className="text-primary" />
                  </div>
                  <Card.Title>3. Get Nightly Reminders</Card.Title>
                  <Card.Text>
                    Receive email reminders each night with donation instructions at your preferred time.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => onTabSelect('schedule')}
            >
              Get Started Now
            </Button>
          </div>
        </Container>
      </section>
      
      {/* Featured Charities Section */}
      <section className="featured-charities-section py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Featured Charities</h2>
            <Button 
              variant="link" 
              className="text-decoration-none"
              onClick={() => onTabSelect('charities')}
            >
              View All <ArrowRight />
            </Button>
          </div>
          <Row>
            {featuredCharities.map(charity => (
              <Col key={charity.id} md={4} className="mb-4">
                <Card className="charity-card h-100 border-0 shadow-sm">
                  <Card.Img variant="top" src={charity.imageUrl} alt={charity.name} />
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{charity.name}</Card.Title>
                      <Badge bg="success" className="rating-badge">
                        <Star className="me-1" size={12} /> {charity.rating}
                      </Badge>
                    </div>
                    <Badge bg="info" className="mb-3">{charity.category}</Badge>
                    <Card.Text>{charity.description}</Card.Text>
                    <div className="impact-stats mb-3">
                      <small className="text-muted d-flex align-items-center">
                        <PeopleFill className="me-1" size={14} />
                        <strong>Impact:</strong> {charity.impact}
                      </small>
                    </div>
                  </Card.Body>
                  <Card.Footer className="text-center bg-white border-0">
                    <Button 
                      variant="outline-primary" 
                      href={charity.donationLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-100"
                    >
                      Donate Now
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="mb-3">Don't Miss Out on Laylatul Qadr</h2>
          <p className="lead mb-4">
            Schedule your donations now to ensure you give charity on every night of the last 10 nights of Ramadan.
          </p>
          <Button 
            variant="light" 
            size="lg"
            onClick={() => onTabSelect('schedule')}
          >
            Schedule Your Donations
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
