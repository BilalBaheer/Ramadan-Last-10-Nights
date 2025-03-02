import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ProgressBar } from 'react-bootstrap';

const DonationTracker = () => {
  const [totalDonations, setTotalDonations] = useState(0);
  const [nightlyBreakdown, setNightlyBreakdown] = useState([
    { night: 21, amount: 5000, target: 10000 },
    { night: 22, amount: 7500, target: 10000 },
    { night: 23, amount: 6800, target: 10000 },
    { night: 24, amount: 8200, target: 10000 },
    { night: 25, amount: 9500, target: 10000 },
    { night: 26, amount: 4200, target: 10000 },
    { night: 27, amount: 12000, target: 10000 },
    { night: 28, amount: 6500, target: 10000 },
    { night: 29, amount: 7800, target: 10000 },
    { night: 30, amount: 8900, target: 10000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalDonations(prev => {
        const increment = Math.floor(Math.random() * 100);
        return prev + increment;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateProgress = (amount, target) => {
    return Math.min((amount / target) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Container className="my-4">
      <Card className="tracker-card">
        <Card.Header className="text-center">
          <h4 className="mb-0">Live Donation Tracker</h4>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-5">
            <p className="text-muted mb-2">Total Donations Collected</p>
            <h1 className="donation-counter">{formatCurrency(totalDonations)}</h1>
            <p className="text-muted">
              <small>Last updated: {new Date().toLocaleTimeString()}</small>
            </p>
          </div>

          <h5 className="mb-4">Nightly Progress</h5>
          <Row>
            {nightlyBreakdown.map(night => (
              <Col key={night.night} lg={6} className="mb-4">
                <Card className="night-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Night {night.night}</h6>
                      <span className="text-muted">{formatCurrency(night.amount)}</span>
                    </div>
                    <ProgressBar 
                      now={calculateProgress(night.amount, night.target)}
                      variant={night.amount >= night.target ? "success" : "primary"}
                      className="mb-2"
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Target: {formatCurrency(night.target)}</small>
                      <small className="text-muted">
                        {Math.round(calculateProgress(night.amount, night.target))}%
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationTracker;
