import React from 'react';
import { Container, Card, Row, Col, ProgressBar, Button } from 'react-bootstrap';
import { useDonations } from '../context/DonationContext';

const DonationTracker = () => {
  const { totalDonations, nightlyBreakdown, resetDonations } = useDonations();

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
          
          {/* Admin button - in a real app, this would be protected */}
          <div className="text-center mt-4">
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={resetDonations}
              className="mt-3"
            >
              Reset Donation Data (Admin Only)
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationTracker;
