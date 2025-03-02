import React from 'react';
import { Container, Card, ListGroup, Badge } from 'react-bootstrap';
import { useDonations } from '../context/DonationContext';
import ExternalDonationTracker from './ExternalDonationTracker';

const DonationHistory = () => {
  const { donationHistory } = useDonations();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container className="my-4">
      <ExternalDonationTracker />
      
      <Card className="tracker-card">
        <Card.Header className="text-center">
          <h4 className="mb-0">Recent Donations</h4>
        </Card.Header>
        <Card.Body>
          {donationHistory.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No donations have been made yet.</p>
              <p>Be the first to contribute!</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {donationHistory.slice().reverse().map((donation, index) => (
                <ListGroup.Item key={index} className="donation-history-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="donation-amount">{formatCurrency(donation.amount)}</div>
                      <div className="text-muted">to {donation.charityName}</div>
                    </div>
                    <div className="text-end">
                      <div>{formatDate(donation.timestamp)}</div>
                      <Badge bg="light" text="dark">
                        {donation.region}
                      </Badge>
                      {donation.isExternal && (
                        <Badge bg="info" className="ms-1">
                          External
                        </Badge>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationHistory;
