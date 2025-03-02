import React, { useState } from 'react';
import { Container, Card, Alert, Form, Button, Accordion, Row, Col } from 'react-bootstrap';
import { sendDonationConfirmationEmail, sendNightlyReminderEmail, clearSentEmails } from '../services/emailService';
import { resetReminderService } from '../services/reminderService';

const DonationEmailViewer = () => {
  const [emailStatus, setEmailStatus] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendConfirmationEmail = async () => {
    if (!testEmail) {
      setEmailStatus({
        type: 'danger',
        message: 'Please enter an email address'
      });
      return;
    }

    setIsSending(true);
    setEmailStatus({
      type: 'info',
      message: 'Sending confirmation email...'
    });

    try {
      const donationData = {
        id: `test_${Date.now()}`,
        email: testEmail,
        charityName: 'Islamic Relief',
        amount: 100,
        scheduledTime: '21:00'
      };

      await sendDonationConfirmationEmail(donationData);
      
      setEmailStatus({
        type: 'success',
        message: `Confirmation email sent to ${testEmail}`
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      setEmailStatus({
        type: 'danger',
        message: `Error sending confirmation email: ${error.message}`
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendReminderEmail = async () => {
    if (!testEmail) {
      setEmailStatus({
        type: 'danger',
        message: 'Please enter an email address'
      });
      return;
    }

    setIsSending(true);
    setEmailStatus({
      type: 'info',
      message: 'Sending reminder email...'
    });

    try {
      const donationData = {
        id: `test_${Date.now()}`,
        email: testEmail,
        charityName: 'Islamic Relief',
        amount: 100,
        scheduledTime: '21:00'
      };

      await sendNightlyReminderEmail(donationData, 27);
      
      setEmailStatus({
        type: 'success',
        message: `Reminder email sent to ${testEmail}`
      });
    } catch (error) {
      console.error('Error sending reminder email:', error);
      setEmailStatus({
        type: 'danger',
        message: `Error sending reminder email: ${error.message}`
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleResetReminderService = () => {
    try {
      resetReminderService();
      setEmailStatus({
        type: 'success',
        message: 'Reminder service reset successfully. All scheduled reminders have been cleared.'
      });
    } catch (error) {
      console.error('Error resetting reminder service:', error);
      setEmailStatus({
        type: 'danger',
        message: `Error resetting reminder service: ${error.message}`
      });
    }
  };
  
  const handleClearEmailTracking = () => {
    try {
      clearSentEmails();
      setEmailStatus({
        type: 'success',
        message: 'Email tracking cleared successfully. Duplicate prevention has been reset.'
      });
    } catch (error) {
      console.error('Error clearing email tracking:', error);
      setEmailStatus({
        type: 'danger',
        message: `Error clearing email tracking: ${error.message}`
      });
    }
  };
  
  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h5">Email Notification Tester</Card.Header>
        <Card.Body>
          {emailStatus && (
            <Alert 
              variant={emailStatus.type} 
              dismissible 
              onClose={() => setEmailStatus(null)}
            >
              {emailStatus.message}
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Test Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                Test emails will be sent to this address.
              </Form.Text>
            </Form.Group>
            
            <Row className="mb-4">
              <Col>
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    onClick={handleSendConfirmationEmail}
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : 'Send Confirmation Email'}
                  </Button>
                </div>
              </Col>
              <Col>
                <div className="d-grid">
                  <Button 
                    variant="success" 
                    onClick={handleSendReminderEmail}
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : 'Send Reminder Email'}
                  </Button>
                </div>
              </Col>
            </Row>
            
            <hr />
            <h5>Admin Controls</h5>
            <Row className="mt-3">
              <Col>
                <div className="d-grid">
                  <Button 
                    variant="warning" 
                    onClick={handleResetReminderService}
                  >
                    Reset Reminder Service
                  </Button>
                  <Form.Text className="text-muted mt-1">
                    Clears all scheduled reminders
                  </Form.Text>
                </div>
              </Col>
              <Col>
                <div className="d-grid">
                  <Button 
                    variant="secondary" 
                    onClick={handleClearEmailTracking}
                  >
                    Clear Email Tracking
                  </Button>
                  <Form.Text className="text-muted mt-1">
                    Resets duplicate prevention
                  </Form.Text>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationEmailViewer;
