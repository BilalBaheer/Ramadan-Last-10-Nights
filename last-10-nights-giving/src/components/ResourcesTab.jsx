import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const ResourcesTab = () => {
  const resources = [
    {
      category: 'Articles',
      items: [
        { title: 'The Virtues of the Last 10 Nights of Ramadan', link: '#' },
        { title: 'How to Maximize Your Worship in the Last 10 Nights', link: '#' },
        { title: 'The Significance of Laylatul Qadr', link: '#' },
        { title: 'Effective Dua During the Last 10 Nights', link: '#' },
        { title: 'The Importance of Charity in Ramadan', link: '#' }
      ]
    },
    {
      category: 'Videos',
      items: [
        { title: 'Preparing for the Last 10 Nights - Lecture Series', link: '#' },
        { title: 'Night Prayer Guide for Beginners', link: '#' },
        { title: 'Finding Laylatul Qadr - Signs and Practices', link: '#' },
        { title: 'Ramadan Reflections: The Power of Giving', link: '#' },
        { title: 'Stories of Generosity from Islamic History', link: '#' }
      ]
    },
    {
      category: 'Dua Collections',
      items: [
        { title: 'Essential Duas for Laylatul Qadr', link: '#' },
        { title: 'Morning and Evening Duas for Ramadan', link: '#' },
        { title: 'Duas for Those in Need Around the World', link: '#' },
        { title: 'Comprehensive Dua Collection for Ramadan', link: '#' },
        { title: 'Quranic Duas for Seeking Forgiveness', link: '#' }
      ]
    },
    {
      category: 'Worship Guides',
      items: [
        { title: 'Taraweeh Prayer Guide', link: '#' },
        { title: 'Qiyam al-Layl Step-by-Step', link: '#' },
        { title: 'Itikaf: Purpose and Practice', link: '#' },
        { title: 'Recitation Goals for the Last 10 Nights', link: '#' },
        { title: 'Creating a Personal Worship Schedule', link: '#' }
      ]
    }
  ];

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Resources for the Last 10 Nights</h2>
      <p className="text-center mb-5">
        Enhance your spiritual journey during these blessed nights with our curated resources.
      </p>
      
      <Row>
        {resources.map((resourceCategory, index) => (
          <Col key={index} md={6} lg={3} className="mb-4">
            <Card className="h-100 resource-card">
              <Card.Header className="text-center bg-primary text-white">
                <h5 className="mb-0">{resourceCategory.category}</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {resourceCategory.items.map((item, idx) => (
                    <ListGroup.Item key={idx} action href={item.link} className="border-0 px-2">
                      {item.title}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="text-center mt-5">
        <h4>Need More Resources?</h4>
        <p className="mb-0">
          Contact us at <a href="mailto:resources@last10nights.org">resources@last10nights.org</a> for specific materials.
        </p>
      </div>
    </Container>
  );
};

export default ResourcesTab;
