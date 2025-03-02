import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { BsHeart, BsStar, BsGlobe } from 'react-icons/bs';

const CharitiesTab = () => {
  // Sample charity data
  const charities = [
    {
      id: 1,
      name: 'Islamic Relief',
      description: 'International humanitarian organization providing emergency relief and development programs.',
      categories: ['Emergency Relief', 'Water', 'Education'],
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Islamic+Relief'
    },
    {
      id: 2,
      name: 'Muslim Aid',
      description: 'Dedicated to helping people in crisis and tackling the root causes of poverty.',
      categories: ['Poverty', 'Healthcare', 'Orphans'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=Muslim+Aid'
    },
    {
      id: 3,
      name: 'Penny Appeal',
      description: 'Providing poverty relief across Asia, the Middle East and Africa by offering water solutions, orphan care and more.',
      categories: ['Orphans', 'Water', 'Food'],
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200?text=Penny+Appeal'
    },
    {
      id: 4,
      name: 'Human Appeal',
      description: 'Working across the globe to strengthen humanity in the face of poverty, social injustice and natural disaster.',
      categories: ['Emergency Relief', 'Education', 'Healthcare'],
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200?text=Human+Appeal'
    },
    {
      id: 5,
      name: 'Muslim Hands',
      description: 'An international aid agency and NGO working in over 50 countries worldwide.',
      categories: ['Water', 'Food', 'Education'],
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200?text=Muslim+Hands'
    },
    {
      id: 6,
      name: 'Zakat Foundation',
      description: 'Fostering charitable giving to alleviate poverty through zakat and sadaqah.',
      categories: ['Zakat', 'Education', 'Orphans'],
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200?text=Zakat+Foundation'
    }
  ];

  return (
    <Container>
      <h2 className="text-center mb-4">Trusted Charities</h2>
      <p className="text-center mb-5">
        Choose from our curated list of verified charities to maximize your impact during the blessed last 10 nights.
      </p>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {charities.map(charity => (
          <Col key={charity.id}>
            <Card className="h-100 charity-card">
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
                    <Badge key={idx} bg="light" text="dark" className="me-2 mb-1">
                      {category}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-flex justify-content-between">
                  <Button variant="outline-primary" size="sm">
                    <BsGlobe className="me-1" /> Visit Website
                  </Button>
                  <Button variant="success" size="sm">
                    <BsHeart className="me-1" /> Donate
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CharitiesTab;
