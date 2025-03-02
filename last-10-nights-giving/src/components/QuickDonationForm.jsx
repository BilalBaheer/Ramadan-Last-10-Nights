import React, { useState } from 'react';
import { Form, Button, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { useDonations } from '../context/DonationContext';

const QuickDonationForm = ({ charity, show, handleClose }) => {
  const { addDonation } = useDonations();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      // Add the donation to our context
      await addDonation({
        amount: parseFloat(amount),
        charityId: charity.id,
        charityName: charity.name,
        email: email,
        isScheduled: false,
        region: charity.regions[0] || 'Unknown Region'
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setAmount('');
      
      // Close modal after a delay
      setTimeout(() => {
        setShowSuccess(false);
        setIsProcessing(false);
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error processing donation:', error);
      setErrorMessage('There was an error processing your donation. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Donate to {charity.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showSuccess ? (
          <div className="text-center py-4">
            <h4 className="text-success mb-3">Thank You!</h4>
            <p>Your donation of ${parseFloat(amount).toLocaleString()} to {charity.name} has been processed.</p>
            <p className="mb-0">This donation has been added to our tracker.</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Donation Amount</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  min="1"
                  disabled={isProcessing}
                />
              </InputGroup>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email (for receipt)</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isProcessing}
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="success" 
                type="submit" 
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
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
                  'Donate Now'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QuickDonationForm;
