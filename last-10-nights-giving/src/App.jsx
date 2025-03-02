import React, { useState } from 'react';
import { Container, Tab, Nav } from 'react-bootstrap';
import CharityList from './components/CharityList';
import DonationScheduler from './components/DonationScheduler';
import DonationTracker from './components/DonationTracker';
import AICharityRecommender from './components/AICharityRecommender';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('charities');

  return (
    <div className="app-wrapper">
      <Header />
      
      <main className="main-content">
        <Container fluid className="py-4">
          <Tab.Container id="main-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="pills" className="main-tabs mb-4 justify-content-center">
              <Nav.Item>
                <Nav.Link eventKey="charities">Charity Directory</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ai">AI Recommendations</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="schedule">Schedule Donations</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tracker">Donation Tracker</Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="charities">
                <CharityList />
              </Tab.Pane>
              <Tab.Pane eventKey="ai">
                <AICharityRecommender />
              </Tab.Pane>
              <Tab.Pane eventKey="schedule">
                <DonationScheduler />
              </Tab.Pane>
              <Tab.Pane eventKey="tracker">
                <DonationTracker />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </main>
      
      <AboutSection />
      <Footer />
    </div>
  );
}

export default App;
