import React, { useState } from 'react';
import { Form, Button, Container, Card, Spinner } from 'react-bootstrap';

const AICharityRecommender = () => {
  const [userPreferences, setUserPreferences] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      // This would typically call your backend API which then uses OpenAI
      // For demo purposes, we'll simulate a response
      const simulatedResponse = [
        {
          name: "Islamic Relief USA",
          match: "95%",
          reason: "Strong focus on your preferred causes: education and orphan support"
        },
        {
          name: "Helping Hand USA",
          match: "90%",
          reason: "Excellent track record in food relief and emergency aid"
        },
        {
          name: "Zakat Foundation",
          match: "85%",
          reason: "Matches your interest in sustainable development projects"
        }
      ];
      
      setTimeout(() => {
        setRecommendations(simulatedResponse);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Card className="recommender-card">
        <Card.Header as="h4">AI Charity Recommendations</Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            getRecommendations();
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Tell us what causes matter to you</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={userPreferences}
                onChange={(e) => setUserPreferences(e.target.value)}
                placeholder="Example: I'm interested in supporting education for orphans and providing emergency food relief..."
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading || !userPreferences.trim()}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {' '}Getting Recommendations...
                </>
              ) : 'Get Recommendations'}
            </Button>
          </Form>

          {recommendations.length > 0 && (
            <div className="mt-4">
              <h5>Recommended Charities</h5>
              {recommendations.map((rec, index) => (
                <Card key={index} className="mb-2 recommendation-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <h6>{rec.name}</h6>
                      <span className="match-badge">{rec.match}</span>
                    </div>
                    <p className="mb-0 text-muted">{rec.reason}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AICharityRecommender;
