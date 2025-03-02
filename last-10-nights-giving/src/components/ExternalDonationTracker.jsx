import React from 'react';
import { Card, ListGroup, Badge, Row, Col, ProgressBar } from 'react-bootstrap';
import { useDonations } from '../context/DonationContext';

const ExternalDonationTracker = () => {
  const { pendingDonations = [], donationHistory = [] } = useDonations();

  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Filter pending donations to show only recent ones (last 24 hours)
  const recentPendingDonations = pendingDonations ? pendingDonations.filter(
    donation => Date.now() - donation.timestamp < 24 * 60 * 60 * 1000
  ) : [];

  // Get confirmed external donations
  const confirmedExternalDonations = donationHistory ? donationHistory.filter(
    donation => donation.isExternal
  ) : [];

  // Calculate conversion rate
  const totalExternalClicks = (pendingDonations ? pendingDonations.length : 0) + 
    (confirmedExternalDonations ? confirmedExternalDonations.length : 0);
  const conversionRate = totalExternalClicks > 0 
    ? (confirmedExternalDonations ? confirmedExternalDonations.length : 0) / totalExternalClicks * 100 
    : 0;

  // Calculate total external donations amount
  const totalExternalAmount = confirmedExternalDonations ? confirmedExternalDonations.reduce(
    (sum, donation) => sum + (donation.amount || 0), 0
  ) : 0;

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">External Donation Tracking</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={4} className="text-center mb-3 mb-md-0">
            <h6>External Donations</h6>
            <h3>{confirmedExternalDonations ? confirmedExternalDonations.length : 0}</h3>
            <div className="text-muted small">Confirmed</div>
          </Col>
          <Col md={4} className="text-center mb-3 mb-md-0">
            <h6>Total Amount</h6>
            <h3>{formatCurrency(totalExternalAmount)}</h3>
            <div className="text-muted small">From external sources</div>
          </Col>
          <Col md={4} className="text-center">
            <h6>Conversion Rate</h6>
            <h3>{conversionRate.toFixed(1)}%</h3>
            <div className="text-muted small">Click to donation</div>
          </Col>
        </Row>

        <h6 className="mb-2">Recent Activity</h6>
        {(!recentPendingDonations || recentPendingDonations.length === 0) && 
         (!confirmedExternalDonations || confirmedExternalDonations.length === 0) ? (
          <p className="text-center text-muted mb-0">No recent external donation activity</p>
        ) : (
          <>
            {recentPendingDonations && recentPendingDonations.length > 0 && (
              <div className="mb-3">
                <h6 className="text-muted small mb-2">Pending Donations</h6>
                <ListGroup variant="flush">
                  {recentPendingDonations.map((donation, index) => (
                    <ListGroup.Item key={`pending-${index}`} className="px-0 py-2">
                      <Row>
                        <Col xs={8}>
                          <div className="fw-bold">{donation.charityName || 'Unknown Charity'}</div>
                          <div className="text-muted small">
                            {formatTimestamp(donation.timestamp)}
                          </div>
                        </Col>
                        <Col xs={4} className="text-end">
                          <Badge bg="warning">Pending</Badge>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
            
            {confirmedExternalDonations && confirmedExternalDonations.length > 0 && (
              <div>
                <h6 className="text-muted small mb-2">Recent Confirmed Donations</h6>
                <ListGroup variant="flush">
                  {confirmedExternalDonations.slice(0, 5).map((donation, index) => (
                    <ListGroup.Item key={`confirmed-${index}`} className="px-0 py-2">
                      <Row>
                        <Col xs={7}>
                          <div className="fw-bold">{donation.charityName || 'Unknown Charity'}</div>
                          <div className="text-muted small">
                            {formatTimestamp(donation.timestamp)}
                          </div>
                        </Col>
                        <Col xs={5} className="text-end">
                          <div className="fw-bold">{formatCurrency(donation.amount)}</div>
                          <Badge bg="success">Confirmed</Badge>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </>
        )}
      </Card.Body>
      <Card.Footer className="bg-light">
        <small className="text-muted">
          External donations are tracked when users visit charity websites from our platform and report their donations.
        </small>
      </Card.Footer>
    </Card>
  );
};

export default ExternalDonationTracker;
