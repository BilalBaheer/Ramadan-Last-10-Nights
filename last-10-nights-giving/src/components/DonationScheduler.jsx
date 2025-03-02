import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap';

const DonationScheduler = () => {
  const [donationPreferences, setDonationPreferences] = useState({
    amount: '',
    selectedCharity: '',
    email: '',
    startDate: '',
    frequency: 'nightly',
    notificationTime: '18:00',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalDonation = () => {
    const amount = parseFloat(donationPreferences.amount) || 0;
    return amount * 10; // 10 nights
  };

  return (
    <Container className="my-4">
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          Your donation schedule has been set successfully! You will receive email confirmations shortly.
        </Alert>
      )}
      
      <Card className="scheduler-card">
        <Card.Header>
          <h4 className="mb-0">Schedule Your Last 10 Nights Donations</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Daily Donation Amount ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={donationPreferences.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                    min="1"
                  />
                  {donationPreferences.amount && (
                    <Form.Text className="text-muted">
                      Total for 10 nights: ${calculateTotalDonation().toLocaleString()}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Charity</Form.Label>
                  <Form.Select
                    name="selectedCharity"
                    value={donationPreferences.selectedCharity}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a charity...</option>
                    <option value="islamic-relief">Islamic Relief USA</option>
                    <option value="helping-hand">Helping Hand USA</option>
                    <option value="zakat-foundation">Zakat Foundation</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email for Reminders</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={donationPreferences.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Reminder Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="notificationTime"
                    value={donationPreferences.notificationTime}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    We'll send you a reminder at this time each night
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4">
              <Button variant="primary" type="submit" size="lg" className="w-100">
                Schedule Donations
              </Button>
              <div className="text-center mt-3">
                <small className="text-muted">
                  You can modify or cancel your schedule at any time
                </small>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationScheduler;
