import React, { useState } from 'react';
import { Container, Card, Alert, Form, Button, Accordion, Row, Col } from 'react-bootstrap';
import emailjs from 'emailjs-com';

const DonationEmailViewer = () => {
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState('confirmation');
  
  const handleTestEmail = async () => {
    if (!emailAddress) {
      setEmailStatus({
        type: 'warning',
        message: 'Please enter your email address'
      });
      return;
    }
    
    setIsLoading(true);
    setEmailStatus({
      type: 'info',
      message: `Sending test ${testType} email...`
    });
    
    try {
      // Create test template parameters
      const templateParams = testType === 'confirmation' 
        ? {
            to_email: emailAddress,
            to_name: emailAddress.split('@')[0],
            charity_name: 'Test Charity',
            daily_amount: '10.00',
            total_amount: '100.00',
            reminder_time: '8:00 PM'
          }
        : {
            to_email: emailAddress,
            to_name: emailAddress.split('@')[0],
            charity_name: 'Test Charity',
            amount: '10.00',
            night_number: '21'
          };
      
      console.log(`Sending test ${testType} email to:`, emailAddress);
      
      // Send test email directly
      const response = await emailjs.send(
        'service_x6teb4m',
        testType === 'confirmation' ? 'template_8fw5vta' : 'template_s44n7ce',
        templateParams,
        'wfhj9VyHSzh-Nm5wG'
      );
      
      console.log('Email response:', response);
      
      setEmailStatus({
        type: 'success',
        message: `Test ${testType} email sent successfully! Please check your inbox (and spam folder).`
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      setEmailStatus({
        type: 'danger',
        message: `Error sending email: ${error.message || JSON.stringify(error)}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container className="my-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Email Notifications</h4>
        </Card.Header>
        <Card.Body>
          <p>
            The Last 10 Nights Giving Platform sends email notifications for:
          </p>
          <ul>
            <li>Confirmation when you schedule donations</li>
            <li>Nightly reminders during the last 10 nights of Ramadan</li>
          </ul>
          
          <hr />
          
          <h5>Test Email Notifications</h5>
          <p>
            Send a test email to verify that notifications are working correctly:
          </p>
          
          {emailStatus && (
            <Alert variant={emailStatus.type} className="mb-3">
              {emailStatus.message}
              
              {emailStatus.type === 'danger' && emailStatus.message.includes('Gmail_API') && (
                <div className="mt-2">
                  <strong>Gmail Authentication Issue:</strong> You need to reconnect your Gmail service in EmailJS.
                </div>
              )}
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>
            
            <Row>
              <Col>
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      setTestType('confirmation');
                      handleTestEmail();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading && testType === 'confirmation' ? 'Sending...' : 'Test Confirmation Email'}
                  </Button>
                </div>
              </Col>
              <Col>
                <div className="d-grid">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => {
                      setTestType('reminder');
                      handleTestEmail();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading && testType === 'reminder' ? 'Sending...' : 'Test Reminder Email'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
          
          {emailStatus && emailStatus.type === 'danger' && emailStatus.message.includes('Gmail_API') && (
            <Accordion className="mt-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>How to fix Gmail authentication issue</Accordion.Header>
                <Accordion.Body>
                  <p>To fix the "Gmail_API: Request had insufficient authentication scopes" error:</p>
                  <ol>
                    <li>Go to the <a href="https://dashboard.emailjs.com/admin/services" target="_blank" rel="noopener noreferrer">EmailJS dashboard → Services</a></li>
                    <li>Find your Gmail service in the list</li>
                    <li>Click on the Edit button</li>
                    <li>Disconnect your current connection</li>
                    <li>Connect again</li>
                    <li>Make sure to check the box "Send email on your behalf" when the permission screen appears</li>
                    <li>Click "Allow" to grant the necessary permissions</li>
                  </ol>
                  <p>After reconnecting, try sending the test email again.</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
          
          <div className="mt-3 small text-muted">
            Note: All emails are sent using EmailJS. No emails are stored on our servers.
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationEmailViewer;
