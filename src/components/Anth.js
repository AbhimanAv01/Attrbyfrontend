import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { GrAttachment } from 'react-icons/gr';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import {ReactTyped} from 'react-typed';
import '../CSS/Anth.css';
import CardContainer from '../components/Suggestioncard'


const Anth = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : 'No file chosen');
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleSubmit = async () => {
      
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('question', question);

        try {
            const res = await axios.post('https://attryb2-backend.onrender.com/api/message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const textContent = res.data.content?.[0]?.text || 'No text content available';
            setResponse(textContent);
            console.log(textContent);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            setResponse(null);
        } finally {
            setLoading(false);
            setQuestion('');
        }
    };


    const handleApiResponse = (responseText, errorText) => {
        setResponse(responseText);
        setError(errorText);
        setLoading(false);
    };

    return (
        <Container fluid className="min-vh-100 d-flex flex-column justify-content-between bg-dark text-white">
            <style>
                {`
                .custom-placeholder::placeholder {
                    color: #686b6e;
                }
                `}
            </style>

            <div className="heading-container">
                <h4 className="heading-text">Attrby.ai<span className="sub-heading-text">powered by Claude</span></h4>
            </div>

             {/* Response Display */}
             {loading && (
                <div className="my-3 mx-auto w-100" style={{ maxWidth: '60%' }}>
                   <Spinner animation="grow" size="sm" />
                   <Spinner animation="grow" />
                </div>
            )}

            {response && !loading ? (
                <Card className="my-3 mx-auto w-100" style={{ maxWidth: '60%' }}>
                    <Card.Body>
                        <h4>Response:</h4>
                        <pre className="typing-animation">
                            <ReactTyped
                                strings={[response]}
                                typeSpeed={0} 
                                backSpeed={0} 
                                cursorChar="|"
                                showCursor={true}
                            />
                        </pre>
                    </Card.Body>
                </Card>
            ) : !loading && !response ? (
                <div className="welcome-container container-fluid d-flex flex-column justify-content-cent">
                <div className="text-center">
                <p className="welcome-text1 ">Hello, Welcome</p>
                <p className="welcome-text2 ">How Can I Help You Today?</p>
                    <CardContainer onApiResponse={handleApiResponse} />
                </div>
            </div>
            
            ) : null}

            {error && (
                <Alert variant="danger" className="mt-3 mx-auto w-100" style={{ maxWidth: '60%' }}>
                    <h4>Error:</h4>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </Alert>
            )}

            <Row className="justify-content-center align-items-end flex-grow-1">
                <Col md={10} lg={8}>
                    <Card className="tab">
                        <Card.Body>
                            <Form>
                                <Row className="align-items-center">
                                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                                        <Form.Group controlId="fileUpload" className="d-flex align-items-center">
                                            <input
                                                type="file"
                                                id="fileInput"
                                                onChange={handleFileChange}
                                                className="d-none"
                                            />
                                            <label htmlFor="fileInput" className="btn btn-outline-light me-2">
                                                <GrAttachment />
                                            </label>
                                            <span className="text-truncate text-secondary">{fileName}</span>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={5} className="mb-3 mb-md-0">
                                        <Form.Group controlId="question">
                                            <Form.Control
                                                as="textarea"
                                                rows={1}
                                                placeholder="Enter a Prompt here"
                                                value={question}
                                                onChange={handleQuestionChange}
                                                className="border-0 bg-transparent text-white custom-placeholder"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={3} className="text-center text-md-end">
                                        <Button onClick={handleSubmit} className="btn btn-outline-light" style={{ borderRadius: '20px' }}>
                                            <MdOutlineKeyboardDoubleArrowUp />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Anth;
