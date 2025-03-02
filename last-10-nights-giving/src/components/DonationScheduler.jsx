import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap';
import { useDonations } from '../context/DonationContext';

const DonationScheduler = () => {
  const { addDonation } = useDonations();
  const [donationPreferences, setDonationPreferences] = useState({
    amount: '',
    selectedCharity: '',
    email: '',
    startDate: '',
    frequency: 'nightly',
    notificationTime: '18:00',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  
  // Charity options from CharitiesTab component
  const charityOptions = [
    // Regular charities
    { value: 'islamic-relief', label: 'Islamic Relief', region: 'Multiple Regions' },
    { value: 'muslim-aid', label: 'Muslim Aid', region: 'Multiple Regions' },
    { value: 'penny-appeal', label: 'Penny Appeal', region: 'Multiple Regions' },
    { value: 'human-appeal', label: 'Human Appeal', region: 'Multiple Regions' },
    { value: 'muslim-hands', label: 'Muslim Hands', region: 'Multiple Regions' },
    { value: 'zakat-foundation', label: 'Zakat Foundation', region: 'Multiple Regions' },
    
    // Gaza-focused charities
    { value: 'pcrf', label: 'Palestine Children\'s Relief Fund', region: 'Gaza' },
    { value: 'map', label: 'Medical Aid for Palestinians', region: 'Gaza' },
    { value: 'unrwa', label: 'UNRWA Gaza Emergency Appeal', region: 'Gaza' },
    
    // Afghanistan-focused charities
    { value: 'afghanistan-relief', label: 'Afghanistan Relief Fund', region: 'Afghanistan' },
    { value: 'women-for-afghan', label: 'Women for Afghan Women', region: 'Afghanistan' },
    { value: 'afghanaid', label: 'Afghanaid', region: 'Afghanistan' },
    
    // Yemen-focused charities
    { value: 'yemen-relief', label: 'Yemen Relief and Reconstruction Foundation', region: 'Yemen' },
    { value: 'yemen-aid', label: 'Yemen Aid', region: 'Yemen' },
    
    // Syria-focused charities
    { value: 'syria-relief', label: 'Syria Relief', region: 'Syria' },
    { value: 'sams', label: 'Syrian American Medical Society', region: 'Syria' },
    
    // Somalia-focused charities
    { value: 'somali-relief', label: 'Somali Relief and Development', region: 'Somalia' },
    
    // Other international charities
    { value: 'unicef', label: 'UNICEF', region: 'Multiple Regions' },
    { value: 'doctors-without-borders', label: 'Doctors Without Borders', region: 'Multiple Regions' },
    { value: 'world-food-programme', label: 'World Food Programme', region: 'Multiple Regions' }
  ];

  // Group charity options by region
  const groupedCharityOptions = charityOptions.reduce((acc, charity) => {
    if (!acc[charity.region]) {
      acc[charity.region] = [];
    }
    acc[charity.region].push(charity);
    return acc;
  }, {});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find the selected charity's full details
    const selectedCharityDetails = charityOptions.find(
      charity => charity.value === donationPreferences.selectedCharity
    );
    
    // Add the donation to our context
    addDonation({
      amount: parseFloat(donationPreferences.amount) * 10, // Total for 10 nights
      charityId: donationPreferences.selectedCharity,
      charityName: selectedCharityDetails?.label || 'Unknown Charity',
      email: donationPreferences.email,
      isScheduled: true,
      scheduledTime: donationPreferences.notificationTime,
      region: selectedCharityDetails?.region || 'Unknown Region'
    });
    
    // Show success message
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
                    
                    {/* Render charity options grouped by region */}
                    {Object.keys(groupedCharityOptions).sort().map(region => (
                      <optgroup key={region} label={region}>
                        {groupedCharityOptions[region].map(charity => (
                          <option key={charity.value} value={charity.value}>
                            {charity.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
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
