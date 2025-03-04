import React, { useState } from 'react';
import { Container, Tab, Nav, Row, Col } from 'react-bootstrap';
import CharityList from './components/CharityList';
import DonationScheduler from './components/DonationScheduler';
import DonationTracker from './components/DonationTracker';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import DonationHistory from './components/DonationHistory';
import CharitiesTab from './components/CharitiesTab';
import ResourcesTab from './components/ResourcesTab';
import DonationEmailViewer from './components/DonationEmailViewer';
import HomePage from './components/HomePage';
import { DonationProvider } from './context/DonationContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  return (
    <DonationProvider>
      <div className="app-wrapper">
        <Header onTabSelect={setActiveTab} />
        
        <Container className="my-5">
          <Tab.Container id="main-tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Row className="mb-4">
              <Col>
                <Nav variant="pills" className="flex-row justify-content-center">
                  <Nav.Item>
                    <Nav.Link eventKey="home">Home</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="schedule">Schedule Donations</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="charities">Explore Charities</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tracker">Donation Tracker</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="about">About</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            
            <Tab.Content>
              <Tab.Pane eventKey="home">
                <HomePage onTabSelect={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="schedule">
                <DonationScheduler />
              </Tab.Pane>
              <Tab.Pane eventKey="charities">
                <CharitiesTab />
              </Tab.Pane>
              <Tab.Pane eventKey="tracker">
                <h2 className="text-center mb-4">Donation Tracker</h2>
                <Row>
                  <Col lg={8}>
                    <DonationTracker />
                  </Col>
                  <Col lg={4}>
                    <DonationHistory />
                    <DonationEmailViewer />
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="about">
                <AboutSection />
              </Tab.Pane>
              <Tab.Pane eventKey="resources">
                <ResourcesTab />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
        
        <Footer />
      </div>
    </DonationProvider>
  );
}

export default App;
