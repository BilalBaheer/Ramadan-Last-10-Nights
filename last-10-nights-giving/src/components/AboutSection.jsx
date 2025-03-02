import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BsCalendar2Check, BsMoonStarsFill, BsHeartFill, BsStarFill } from 'react-icons/bs';

const AboutSection = () => {
  return (
    <section className="about-section py-5">
      <Container fluid>
        <div className="text-center mb-5">
          <h2 className="section-title">About Laylatul Qadr</h2>
          <p className="section-subtitle">
            The Night of Power and Decree - Better than a thousand months
          </p>
        </div>

        <Row className="mb-5 px-3 px-md-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="about-content">
              <h3 className="mb-4">What is Laylatul Qadr?</h3>
              <p>
                Laylatul Qadr (The Night of Power) is considered the holiest night of the year for Muslims. 
                It is traditionally celebrated on the 27th night of Ramadan, although it could fall on any 
                of the odd nights during the last ten days of Ramadan.
              </p>
              <p>
                According to Islamic belief, this was the night when the first verses of the Quran were 
                revealed to Prophet Muhammad (peace be upon him). The Quran describes this night as 
                "better than a thousand months" (97:3), meaning that worship on this night is better 
                than worship for a thousand months.
              </p>
              <p>
                Muslims worldwide strive to spend this night in prayer, recitation of the Quran, and 
                making supplications. It is also considered an especially good time for charity and 
                good deeds, as the rewards are multiplied manifold.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-image-container">
              <img 
                src="https://placehold.co/600x400/2E7D32/fff?text=Laylatul+Qadr" 
                alt="Laylatul Qadr" 
                className="img-fluid about-image" 
              />
              <div className="quran-verse">
                <p className="arabic-text">لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ</p>
                <p className="verse-translation">"The Night of Decree is better than a thousand months"</p>
                <p className="verse-reference">- Surah Al-Qadr (97:3)</p>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="px-3 px-md-5">
          <Col md={3} sm={6} className="mb-4">
            <Card className="feature-card text-center h-100">
              <Card.Body>
                <div className="feature-icon">
                  <BsMoonStarsFill />
                </div>
                <Card.Title>Night of Power</Card.Title>
                <Card.Text>
                  A blessed night when worship and good deeds are multiplied in reward
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <Card className="feature-card text-center h-100">
              <Card.Body>
                <div className="feature-icon">
                  <BsCalendar2Check />
                </div>
                <Card.Title>Last 10 Nights</Card.Title>
                <Card.Text>
                  The most blessed nights of Ramadan when Muslims increase their worship
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <Card className="feature-card text-center h-100">
              <Card.Body>
                <div className="feature-icon">
                  <BsHeartFill />
                </div>
                <Card.Title>Charity</Card.Title>
                <Card.Text>
                  Giving charity during these nights brings immense rewards and blessings
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <Card className="feature-card text-center h-100">
              <Card.Body>
                <div className="feature-icon">
                  <BsStarFill />
                </div>
                <Card.Title>Multiplied Rewards</Card.Title>
                <Card.Text>
                  Acts of worship during this night are equivalent to those performed over 83 years
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
