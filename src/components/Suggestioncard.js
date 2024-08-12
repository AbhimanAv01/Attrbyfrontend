import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import { FaRegLightbulb, FaBook, FaRegListAlt, FaPlaneDeparture } from "react-icons/fa";
import '../CSS/SuggestionCard.css';

function SuggestionCard({ title, text, buttonText, icon, onClick }) {
  return (
    <Card
      bg="dark"
      text="white"
      className="card-hover-effect" 
      style={{ width: '16rem', margin: '10px', cursor: 'pointer' }}
      onClick={() => onClick(text)}
      
    >
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
        <Button variant="primary">
          {icon} {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
}

function CardContainer({ onApiResponse }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCardClick = async (selectedText) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('question', selectedText);

    try {
      const res = await axios.post('http://localhost:3010/api/message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const textContent = res.data.content?.[0]?.text || 'No text content available';
      onApiResponse(textContent);  
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      onApiResponse(null, err.response?.data?.error || 'An error occurred');  
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="bg-dark text-white py-5">
      <Row className="justify-content-center">
      <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-3">
          <SuggestionCard
            text="Tell me a fun fact."
            icon={<FaRegLightbulb />}
            onClick={handleCardClick}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-3">
          <SuggestionCard
            text="Test my Knowledge"
            icon={<FaBook />}
            onClick={handleCardClick}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-3">
          <SuggestionCard
            text="Create a morning routine."
            icon={<FaRegListAlt />}
            onClick={handleCardClick}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-3">
          <SuggestionCard
            text="Plan a trip"
            icon={<FaPlaneDeparture />}
            onClick={handleCardClick}
          />
        </Col>
      </Row>

      {/* Display loading or error */}
      {loading && (
        <div className="my-3 mx-auto w-100" style={{ maxWidth: '60%' }}>
          <Spinner animation="grow" size="sm" />
          <Spinner animation="grow" />
        </div>
      )}
    </Container>
  );
}

export default CardContainer;
