import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Alert, Spinner, ProgressBar, Badge } from 'react-bootstrap';
import { useDonations } from '../context/DonationContext';
import { CalendarCheck, CurrencyDollar, EnvelopeAt, Clock, InfoCircle, CheckCircleFill } from 'react-bootstrap-icons';

const DonationScheduler = () => {
  const { addDonation } = useDonations();
  const [donationPreferences, setDonationPreferences] = useState({
    amount: '',
    selectedCharity: '',
    email: '',
    notificationTime: '18:00',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showInfoModal, setShowInfoModal] = useState(true);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      // Find the selected charity's full details
      const selectedCharityDetails = charityOptions.find(
        charity => charity.value === donationPreferences.selectedCharity
      );
      
      // Create donation data object
      const donationData = {
        amount: parseFloat(donationPreferences.amount) * 10, // Total for 10 nights
        charityId: donationPreferences.selectedCharity,
        charityName: selectedCharityDetails?.label || 'Unknown Charity',
        email: donationPreferences.email,
        isScheduled: true,
        scheduledTime: donationPreferences.notificationTime,
        region: selectedCharityDetails?.region || 'Unknown Region'
      };
      
      // Add the donation to our context
      // This will trigger the reminderService to send confirmation email
      // and schedule nightly reminders
      await addDonation(donationData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset processing state
      setIsProcessing(false);
      
      // Hide success message after a delay
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error scheduling donation:', error);
      setErrorMessage('There was an error scheduling your donation. Please try again.');
      setIsProcessing(false);
    }
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

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return donationPreferences.amount !== '';
      case 2:
        return donationPreferences.selectedCharity !== '';
      case 3:
        return donationPreferences.email !== '' && donationPreferences.notificationTime !== '';
      default:
        return false;
    }
  };

  const canProceedToNextStep = () => {
    return isStepComplete(currentStep);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-icon mb-3">
              <CurrencyDollar size={40} className="text-primary" />
            </div>
            <h5 className="mb-3">Set Your Daily Donation Amount</h5>
            <p className="text-muted mb-4">
              This amount will be donated each night during the last 10 nights of Ramadan (March 22-31, 2025).
              We'll send you a reminder email each night with donation instructions.
            </p>
            
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
                disabled={isProcessing}
                className="form-control-lg"
              />
              {donationPreferences.amount && (
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Daily amount:</span>
                    <span className="fw-bold">${parseFloat(donationPreferences.amount).toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span>Number of nights:</span>
                    <span className="fw-bold">10</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total donation:</span>
                    <span className="fw-bold text-primary fs-5">${calculateTotalDonation().toLocaleString()}</span>
                  </div>
                </div>
              )}
            </Form.Group>
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <div className="step-icon mb-3">
              <CalendarCheck size={40} className="text-primary" />
            </div>
            <h5 className="mb-3">Select a Charity</h5>
            <p className="text-muted mb-4">
              Choose the charity you'd like to support during the last 10 nights of Ramadan.
              Your daily donation will go to this organization each night.
            </p>
            
            <Form.Group className="mb-3">
              <Form.Label>Select Charity</Form.Label>
              <Form.Select
                name="selectedCharity"
                value={donationPreferences.selectedCharity}
                onChange={handleChange}
                required
                disabled={isProcessing}
                className="form-control-lg"
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
            
            {donationPreferences.selectedCharity && (
              <div className="mt-3 p-3 bg-light rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Selected charity:</span>
                  <span className="fw-bold">
                    {charityOptions.find(c => c.value === donationPreferences.selectedCharity)?.label}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Region focus:</span>
                  <Badge bg="info">
                    {charityOptions.find(c => c.value === donationPreferences.selectedCharity)?.region}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <div className="step-icon mb-3">
              <EnvelopeAt size={40} className="text-primary" />
            </div>
            <h5 className="mb-3">Set Up Reminders</h5>
            <p className="text-muted mb-4">
              We'll send you a reminder email each night during the last 10 nights of Ramadan.
              Enter your email address and choose what time you'd like to receive these reminders.
            </p>
            
            <Form.Group className="mb-4">
              <Form.Label>Email for Reminders</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={donationPreferences.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                disabled={isProcessing}
                className="form-control-lg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reminder Time</Form.Label>
              <div className="d-flex align-items-center">
                <Clock size={20} className="text-muted me-2" />
                <Form.Control
                  type="time"
                  name="notificationTime"
                  value={donationPreferences.notificationTime}
                  onChange={handleChange}
                  required
                  disabled={isProcessing}
                  className="form-control-lg"
                />
              </div>
              <Form.Text className="text-muted">
                We'll send you a reminder at this time each night (March 22-31, 2025)
              </Form.Text>
            </Form.Group>
            
            {donationPreferences.email && donationPreferences.notificationTime && (
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-3">Summary of Your Donation Schedule</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Daily amount:</span>
                  <span className="fw-bold">${parseFloat(donationPreferences.amount).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Total (10 nights):</span>
                  <span className="fw-bold">${calculateTotalDonation().toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Charity:</span>
                  <span className="fw-bold">
                    {charityOptions.find(c => c.value === donationPreferences.selectedCharity)?.label}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Email:</span>
                  <span className="fw-bold">{donationPreferences.email}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Reminder time:</span>
                  <span className="fw-bold">
                    {new Date(`2025-03-22T${donationPreferences.notificationTime}`).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container className="my-4">
      {showInfoModal && (
        <Alert variant="info" className="mb-4" onClose={() => setShowInfoModal(false)} dismissible>
          <Alert.Heading>
            <InfoCircle className="me-2" />
            About Last 10 Nights Donations
          </Alert.Heading>
          <p>
            The last 10 nights of Ramadan (March 22-31, 2025) are especially blessed, with one of these nights being Laylatul Qadr (The Night of Power), which is better than a thousand months of worship.
          </p>
          <p>
            This scheduler allows you to set up automatic donation reminders for each of these 10 nights, so you can maximize your charitable giving during this special time.
          </p>
          <p className="mb-0">
            <strong>How it works:</strong> You'll set a daily donation amount, select a charity, and provide your email for reminders. We'll send you an email each night with instructions on how to complete your donation.
          </p>
        </Alert>
      )}
      
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>
            <CheckCircleFill className="me-2" />
            Donation Schedule Confirmed!
          </Alert.Heading>
          <p>
            Your donation schedule has been set successfully! You will receive a confirmation email shortly.
          </p>
          <p className="mb-0">
            Starting on March 22, 2025, you'll receive nightly reminders to donate ${parseFloat(donationPreferences.amount).toLocaleString()} to {charityOptions.find(c => c.value === donationPreferences.selectedCharity)?.label}.
          </p>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="danger" className="mb-4">
          {errorMessage}
        </Alert>
      )}
      
      <Card className="scheduler-card shadow-sm">
        <Card.Header className="bg-success text-white py-3">
          <h3 className="mb-0">Schedule Your Last 10 Nights Donations</h3>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="mb-4">
            <ProgressBar now={(currentStep / 3) * 100} className="mb-3" />
            <div className="d-flex justify-content-between">
              <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${isStepComplete(1) ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Amount</div>
              </div>
              <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''} ${isStepComplete(2) ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Charity</div>
              </div>
              <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''} ${isStepComplete(3) ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Reminders</div>
              </div>
            </div>
          </div>
          
          <Form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="mt-4 d-flex justify-content-between">
              {currentStep > 1 && (
                <Button 
                  variant="outline-secondary" 
                  onClick={prevStep}
                  disabled={isProcessing}
                >
                  Back
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  disabled={!canProceedToNextStep() || isProcessing}
                  className={currentStep === 1 ? 'ms-auto' : ''}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={!canProceedToNextStep() || isProcessing}
                  className="ms-auto"
                >
                  {isProcessing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    'Confirm Schedule'
                  )}
                </Button>
              )}
            </div>
          </Form>
          
          <div className="text-center mt-4">
            <small className="text-muted">
              You can modify or cancel your schedule at any time from your donation history
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationScheduler;
