import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Nav, Tab, Modal } from 'react-bootstrap';
import { BsHeart, BsStar, BsGlobe, BsSearch, BsFilter, BsExclamationTriangle } from 'react-icons/bs';
import QuickDonationForm from './QuickDonationForm';
import { useDonations } from '../context/DonationContext';
import { simulateWebhookCallback } from '../services/donationService';

const CharitiesTab = () => {
  const { trackExternalDonation } = useDonations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeRegion, setActiveRegion] = useState('all');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [showExternalDonationModal, setShowExternalDonationModal] = useState(false);
  const [externalDonationAmount, setExternalDonationAmount] = useState('');
  const [externalDonationCharity, setExternalDonationCharity] = useState(null);

  // Sample charity data
  const charities = [
    // Regular charities
    {
      id: 1,
      name: 'Islamic Relief',
      description: 'International humanitarian organization providing emergency relief and development programs.',
      categories: ['Emergency Relief', 'Water', 'Education'],
      regions: ['gaza', 'afghanistan', 'syria', 'yemen'],
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Islamic+Relief',
      website: 'https://irusa.org',
      donationUrl: 'https://irusa.org/donate/',
      urgent: true
    },
    {
      id: 2,
      name: 'Muslim Aid',
      description: 'Dedicated to helping people in crisis and tackling the root causes of poverty.',
      categories: ['Poverty', 'Healthcare', 'Orphans'],
      regions: ['gaza', 'pakistan', 'somalia'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=Muslim+Aid',
      website: 'https://muslimaid.org',
      donationUrl: 'https://muslimaid.org/donate/',
      urgent: false
    },
    {
      id: 3,
      name: 'Penny Appeal',
      description: 'Providing poverty relief across Asia, the Middle East and Africa by offering water solutions, orphan care and more.',
      categories: ['Orphans', 'Water', 'Food'],
      regions: ['gaza', 'afghanistan', 'pakistan'],
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200?text=Penny+Appeal',
      website: 'https://pennyappeal.org',
      donationUrl: 'https://pennyappeal.org/donate',
      urgent: false
    },
    {
      id: 4,
      name: 'Human Appeal',
      description: 'Working across the globe to strengthen humanity in the face of poverty, social injustice and natural disaster.',
      categories: ['Emergency Relief', 'Education', 'Healthcare'],
      regions: ['gaza', 'syria', 'yemen'],
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200?text=Human+Appeal',
      website: 'https://humanappeal.org',
      donationUrl: 'https://humanappeal.org/donate',
      urgent: false
    },
    {
      id: 5,
      name: 'Muslim Hands',
      description: 'An international aid agency and NGO working in over 50 countries worldwide.',
      categories: ['Water', 'Food', 'Education'],
      regions: ['gaza', 'afghanistan', 'yemen'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=Muslim+Hands',
      website: 'https://muslimhands.org',
      donationUrl: 'https://muslimhands.org/donate',
      urgent: false
    },
    {
      id: 6,
      name: 'Zakat Foundation',
      description: 'Fostering charitable giving to alleviate poverty through zakat and sadaqah.',
      categories: ['Zakat', 'Education', 'Orphans'],
      regions: ['gaza', 'syria', 'yemen'],
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200?text=Zakat+Foundation',
      website: 'https://www.zakat.org',
      donationUrl: 'https://www.zakat.org/donate',
      urgent: false
    },

    // Gaza-focused charities
    {
      id: 7,
      name: 'Palestine Children\'s Relief Fund',
      description: 'Providing medical and humanitarian relief to Arab children throughout the Middle East, regardless of nationality, politics, or religion.',
      categories: ['Healthcare', 'Children', 'Emergency Relief'],
      regions: ['gaza'],
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200?text=PCRF',
      website: 'https://www.pcrf.net',
      donationUrl: 'https://www.pcrf.net/donate',
      urgent: true
    },
    {
      id: 8,
      name: 'Medical Aid for Palestinians',
      description: 'Working for the health and dignity of Palestinians living under occupation and as refugees.',
      categories: ['Healthcare', 'Emergency Relief'],
      regions: ['gaza'],
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=MAP',
      website: 'https://www.map.org.uk',
      donationUrl: 'https://www.map.org.uk/donate/donate',
      urgent: true
    },
    {
      id: 9,
      name: 'UNRWA Gaza Emergency Appeal',
      description: 'Providing emergency assistance to Palestine refugees in Gaza during the ongoing crisis.',
      categories: ['Emergency Relief', 'Food', 'Healthcare'],
      regions: ['gaza'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=UNRWA',
      website: 'https://www.unrwa.org',
      donationUrl: 'https://www.unrwa.org/donate',
      urgent: true
    },

    // Afghanistan-focused charities
    {
      id: 10,
      name: 'Afghanistan Relief Fund',
      description: 'Providing humanitarian assistance to vulnerable communities in Afghanistan affected by conflict and natural disasters.',
      categories: ['Emergency Relief', 'Food', 'Healthcare'],
      regions: ['afghanistan'],
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200?text=Afghanistan+Relief',
      website: 'https://www.afghanistanrelief.org',
      donationUrl: 'https://www.afghanistanrelief.org/donate',
      urgent: true
    },
    {
      id: 11,
      name: 'Women for Afghan Women',
      description: 'Providing life-changing services, education, and vocational training for Afghan women and children.',
      categories: ['Women', 'Education', 'Human Rights'],
      regions: ['afghanistan'],
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Women+for+Afghan+Women',
      website: 'https://womenforafghanwomen.org',
      donationUrl: 'https://womenforafghanwomen.org/donate',
      urgent: true
    },
    {
      id: 12,
      name: 'Afghanaid',
      description: 'Working with millions of families in the poorest and most remote communities in Afghanistan.',
      categories: ['Poverty', 'Water', 'Education'],
      regions: ['afghanistan'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=Afghanaid',
      website: 'https://www.afghanaid.org.uk',
      donationUrl: 'https://www.afghanaid.org.uk/donate',
      urgent: true
    },

    // Yemen-focused charities
    {
      id: 13,
      name: 'Yemen Relief and Reconstruction Foundation',
      description: 'Providing emergency humanitarian relief to the people of Yemen affected by the ongoing crisis.',
      categories: ['Emergency Relief', 'Food', 'Healthcare'],
      regions: ['yemen'],
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Yemen+Relief',
      website: 'https://www.yemenfoundation.org',
      donationUrl: 'https://www.yemenfoundation.org/donate',
      urgent: true
    },
    {
      id: 14,
      name: 'Yemen Aid',
      description: 'Providing life-saving humanitarian aid to the most vulnerable communities in Yemen.',
      categories: ['Food', 'Healthcare', 'Water'],
      regions: ['yemen'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=Yemen+Aid',
      website: 'https://www.yemenaid.org',
      donationUrl: 'https://www.yemenaid.org/donate',
      urgent: true
    },

    // Syria-focused charities
    {
      id: 15,
      name: 'Syria Relief',
      description: 'The largest Syria-focused charity providing humanitarian aid inside Syria and neighboring countries.',
      categories: ['Emergency Relief', 'Healthcare', 'Education'],
      regions: ['syria'],
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Syria+Relief',
      website: 'https://www.syriarelief.org.uk',
      donationUrl: 'https://www.syriarelief.org.uk/donate',
      urgent: true
    },
    {
      id: 16,
      name: 'Syrian American Medical Society',
      description: 'Providing medical relief to Syrians affected by the crisis, both in Syria and surrounding countries.',
      categories: ['Healthcare', 'Emergency Relief'],
      regions: ['syria'],
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200?text=SAMS',
      website: 'https://www.sams-usa.net',
      donationUrl: 'https://www.sams-usa.net/donate',
      urgent: true
    },

    // Somalia-focused charities
    {
      id: 17,
      name: 'Somali Relief and Development',
      description: 'Providing humanitarian aid and development assistance to communities in Somalia affected by conflict and natural disasters.',
      categories: ['Emergency Relief', 'Food', 'Water'],
      regions: ['somalia'],
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200?text=Somali+Relief',
      website: 'https://www.somalirelief.org',
      donationUrl: 'https://www.somalirelief.org/donate',
      urgent: true
    },

    // Other international charities
    {
      id: 18,
      name: 'UNICEF',
      description: 'Working in over 190 countries to save children\'s lives, defend their rights, and help them fulfill their potential.',
      categories: ['Children', 'Education', 'Healthcare'],
      regions: ['gaza', 'afghanistan', 'syria', 'yemen', 'somalia'],
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200?text=UNICEF',
      website: 'https://www.unicef.org',
      donationUrl: 'https://www.unicef.org/donate',
      urgent: false
    },
    {
      id: 19,
      name: 'Doctors Without Borders',
      description: 'Medical humanitarian organization providing medical care where it is needed most.',
      categories: ['Healthcare', 'Emergency Relief'],
      regions: ['gaza', 'afghanistan', 'syria', 'yemen', 'somalia'],
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200?text=Doctors+Without+Borders',
      website: 'https://www.doctorswithoutborders.org',
      donationUrl: 'https://www.doctorswithoutborders.org/donate',
      urgent: false
    },
    {
      id: 20,
      name: 'World Food Programme',
      description: 'The world\'s largest humanitarian organization saving lives in emergencies and using food assistance to build a pathway to peace.',
      categories: ['Food', 'Emergency Relief'],
      regions: ['gaza', 'afghanistan', 'syria', 'yemen', 'somalia'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=World+Food+Programme',
      website: 'https://www.wfp.org',
      donationUrl: 'https://www.wfp.org/donate',
      urgent: false
    }
  ];

  // Extract all unique categories
  const allCategories = ['All', ...new Set(charities.flatMap(charity => charity.categories))].sort();

  // Filter charities based on search term, selected category, and active region
  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          charity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || charity.categories.includes(selectedCategory);
    const matchesRegion = activeRegion === 'all' || charity.regions.includes(activeRegion);
    return matchesSearch && matchesCategory && matchesRegion;
  });

  // Handle opening the donation modal
  const handleDonateClick = (charity) => {
    setSelectedCharity(charity);
    setShowDonationModal(true);
  };

  // Handle external website visit
  const handleVisitWebsite = async (charity, event) => {
    event.preventDefault(); // Prevent default link behavior

    try {
      // Track the external click
      const trackingResult = await trackExternalDonation({
        charityId: charity.id,
        charityName: charity.name,
        region: charity.regions[0] || 'Unknown Region',
        referrerUrl: window.location.href,
        destinationUrl: charity.website
      });

      // Store the charity for the external donation modal
      setExternalDonationCharity(charity);

      // Open the external donation modal
      setShowExternalDonationModal(true);

      // In a real app, we would redirect to the tracked URL:
      // window.open(trackingResult.trackedUrl, '_blank');
    } catch (error) {
      console.error('Error tracking external donation:', error);
    }
  };

  // Handle external donation confirmation
  const handleExternalDonationConfirm = () => {
    if (!externalDonationAmount || !externalDonationCharity) return;

    // Simulate a webhook callback with the user-provided amount
    simulateWebhookCallback({
      charityId: externalDonationCharity.id,
      charityName: externalDonationCharity.name,
      amount: parseFloat(externalDonationAmount),
      region: externalDonationCharity.regions[0] || 'Unknown Region',
      timestamp: Date.now(),
      donorEmail: 'external-donor@example.com'
    });

    // Reset and close the modal
    setExternalDonationAmount('');
    setExternalDonationCharity(null);
    setShowExternalDonationModal(false);

    // In a real app, now redirect to the charity website
    window.open(externalDonationCharity.website, '_blank');
  };

  return (
    <Container>
      <h2 className="text-center mb-4">Trusted Charities</h2>
      <p className="text-center mb-4">
        Choose from our curated list of verified charities to maximize your impact during the blessed last 10 nights.
      </p>

      <Tab.Container id="region-tabs" activeKey={activeRegion} onSelect={(k) => setActiveRegion(k)}>
        <Nav variant="pills" className="mb-4 justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="all">All Regions</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="gaza">Gaza</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="afghanistan">Afghanistan</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="syria">Syria</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="yemen">Yemen</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="somalia">Somalia</Nav.Link>
          </Nav.Item>
        </Nav>

        <Row className="mb-4">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search charities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <BsFilter />
              </InputGroup.Text>
              <Form.Select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {allCategories.map((category, idx) => (
                  <option key={idx} value={category}>{category}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>

        <Tab.Content>
          <Tab.Pane eventKey={activeRegion}>
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredCharities.map(charity => (
                <Col key={charity.id}>
                  <Card className="h-100 charity-card">
                    {charity.urgent && (
                      <div className="urgent-badge">
                        <BsExclamationTriangle /> Urgent Need
                      </div>
                    )}
                    <Card.Img variant="top" src={charity.image} />
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title>{charity.name}</Card.Title>
                        <Badge bg="success" className="rating-badge">
                          <BsStar className="me-1" /> {charity.rating}
                        </Badge>
                      </div>
                      <Card.Text>{charity.description}</Card.Text>
                      <div className="mb-3">
                        {charity.categories.map((category, idx) => (
                          <Badge 
                            key={idx} 
                            bg="light" 
                            text="dark" 
                            className="me-2 mb-1 category-badge"
                            onClick={() => setSelectedCategory(category)}
                            style={{ cursor: 'pointer' }}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white">
                      <div className="d-flex justify-content-between">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={(e) => handleVisitWebsite(charity, e)}
                        >
                          <BsGlobe className="me-1" /> Visit Website
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleDonateClick(charity)}
                        >
                          <BsHeart className="me-1" /> Donate
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            {filteredCharities.length === 0 && (
              <div className="text-center py-5">
                <h5>No charities match your search</h5>
                <p>Try adjusting your search terms or filters</p>
              </div>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Quick Donation Modal */}
      {selectedCharity && (
        <QuickDonationForm 
          charity={selectedCharity}
          show={showDonationModal}
          handleClose={() => setShowDonationModal(false)}
        />
      )}

      {/* External Donation Modal */}
      <Modal 
        show={showExternalDonationModal} 
        onHide={() => setShowExternalDonationModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Visiting {externalDonationCharity?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You're about to visit {externalDonationCharity?.name}'s website to make a donation.
            To help us track your contribution, please enter the amount you plan to donate:
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Planned Donation Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                value={externalDonationAmount}
                onChange={(e) => setExternalDonationAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </InputGroup>
            <Form.Text className="text-muted">
              This helps us track your contribution to our overall goal.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              // Just open the website without tracking the amount
              window.open(externalDonationCharity?.website, '_blank');
              setShowExternalDonationModal(false);
            }}
          >
            Skip & Visit Website
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExternalDonationConfirm}
            disabled={!externalDonationAmount || parseFloat(externalDonationAmount) <= 0}
          >
            Confirm & Visit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CharitiesTab;
