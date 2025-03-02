import React, { useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const CharityList = () => {
  const [charities] = useState([
    {
      id: 1,
      name: "Islamic Relief USA",
      category: "General Aid",
      description: "Providing emergency relief and development programs worldwide. Focus on sustainable solutions and immediate crisis response.",
      donationLink: "https://irusa.org/",
      imageUrl: "https://placehold.co/600x400/81C784/fff?text=Islamic+Relief",
      impact: "Helped 13M+ people across 40+ countries",
      rating: "4.5/5"
    },
    {
      id: 2,
      name: "Helping Hand USA",
      category: "Orphans",
      description: "Supporting orphans and vulnerable children globally. Providing education, healthcare, and basic necessities.",
      donationLink: "https://hhrd.org/",
      imageUrl: "https://placehold.co/600x400/81C784/fff?text=Helping+Hand",
      impact: "Supporting 10,000+ orphans worldwide",
      rating: "4.8/5"
    },
    {
      id: 3,
      name: "Zakat Foundation",
      category: "Food Relief",
      description: "Providing food security and sustainable development programs. Emergency food distribution and long-term agriculture projects.",
      donationLink: "https://www.zakat.org/",
      imageUrl: "https://placehold.co/600x400/81C784/fff?text=Zakat+Foundation",
      impact: "Distributed 5M+ meals in 2024",
      rating: "4.7/5"
    }
  ]);

  return (
    <Container className="my-4">
      <Row>
        {charities.map(charity => (
          <Col key={charity.id} md={4} className="mb-4">
            <Card className="charity-card h-100">
              <Card.Img variant="top" src={charity.imageUrl} alt={charity.name} />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="mb-0">{charity.name}</Card.Title>
                  <span className="text-success">{charity.rating}</span>
                </div>
                <div className="category-badge mb-3">{charity.category}</div>
                <Card.Text>{charity.description}</Card.Text>
                <div className="impact-stats mb-3">
                  <small className="text-muted">
                    <strong>Impact:</strong> {charity.impact}
                  </small>
                </div>
              </Card.Body>
              <Card.Footer className="text-center bg-white">
                <Button 
                  variant="primary" 
                  href={charity.donationLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-100"
                >
                  Donate Now
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CharityList;
