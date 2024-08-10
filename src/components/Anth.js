import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { GrAttachment } from 'react-icons/gr';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import {ReactTyped} from 'react-typed';
import '../CSS/Anth.css';


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

    // useEffect(() => {
    //     // Set default response when the component mounts
    //     setResponse("This file appears to be a CSV (Comma-Separated Values) file containing sales data. Here's an analysis of the content:\n\n1. Columns:\n   - OrderDate: The date of the order\n   - Region: The region where the sale occurred (East, Central, West)\n   - Manager: The name of the manager responsible for the sale\n   - SalesMan: The name of the salesperson who made the sale\n   - Item: The product sold (Television, Home Theater, Cell Phone, Desk, Video Games)\n   - Units: The number of units sold in each order\n   - Unit_price: The price per unit of the product\n   - Sale_amt: The total sales amount for each order\n\n2. Data:\n   - The file contains sales records from January 6, 2018, to December 21, 2019.\n   - There are sales records for different regions, managed by different managers and salespeople.\n   - The products sold include televisions, home theaters, cell phones, desks, and video games.\n   - The unit prices vary depending on the product, with televisions being the most expensive at $1,198.00 per unit.\n   - The number of units sold in each order varies, ranging from 2 to 96 units.\n\n3. Inconsistencies:\n   - The last two rows of the file seem to be summary rows, but they are not labeled and don't follow the same format as the rest of the data.\n   - The \"Unit_price\" and \"Sale_amt\" columns contain values with inconsistent formatting (some have commas, some have spaces).\n\n4. Insights:\n   - The data could be used to analyze sales trends over time, compare sales performance across regions, managers, and salespeople, and identify the most popular and profitable products.\n   - The data could also be used to calculate total sales revenue, average order size, and other relevant metrics.\n\nTo properly work with this data, it would be necessary to clean and preprocess it, handling the inconsistencies in formatting and determining how to treat the summary rows at the end of the file. Additionally, the data types of each column should be properly parsed (e.g., converting OrderDate to a date type, Units to integer, Unit_price and Sale_amt to float or decimal types).");
    // }, []);

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
                <div className="mt-3">
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
                <div className="welcome-container">
                <div className="text-center">
                    <p className="welcome-text1">Hello,Welcome </p>
                    <p className="welcome-text2">How Can i Help You today?</p>
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
