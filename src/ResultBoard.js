import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import Bootstrap Components
import { Container, Table, Form, Row, Col, Card, Spinner, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo from "./Assets/charani logo.webp"; 

const ResultBoard = () => {
    const [results, setResults] = useState([]);
    const [emailFilter, setEmailFilter] = useState('');
    const [percentFilter, setPercentFilter] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const minPct = percentFilter === '' ? 0 : percentFilter;
            const response = await axios.get(`http://localhost:8080/api/result/search`, {
                params: {
                    email: emailFilter,
                    minPercentage: minPct
                }
            });
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching results", error);
        } finally {
            setLoading(false);
        }
    };

    // UseEffect with 300ms debounce to prevent excessive API calls
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [emailFilter, percentFilter]);

    return (
        <>
            <Navbar style={{ backgroundColor: "#3216e8" }} variant="dark" className="shadow-sm mb-4">
                <Container>
                    <Navbar.Brand href="#" className="d-flex align-items-center">
                        <img
                            src={logo}
                            alt="Charani Logo"
                            width="40"
                            height="40"
                            className="d-inline-block align-top me-2"
                            style={{ borderRadius: "50%", backgroundColor: "white" }}
                        />
                        <span className="fw-bold text-white">CHARANI INFOTECH</span>
                    </Navbar.Brand>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Card className="shadow-sm">
                    <Card.Header className="bg-light">
                        <h3 className="mb-0 text-dark">Candidate Result Dashboard</h3>
                    </Card.Header>
                    <Card.Body>
                        {/* Filter Section */}
                        <Form className="mb-4">
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="emailSearch">
                                        <Form.Label className="fw-semibold">Search by Email</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter email address..." 
                                            value={emailFilter}
                                            onChange={(e) => setEmailFilter(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="percentSearch">
                                        <Form.Label className="fw-semibold">Min Percentage (%)</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            placeholder="Show results above e.g. 60" 
                                            value={percentFilter}
                                            onChange={(e) => setPercentFilter(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>

                        {/* Table Section */}
                        {loading ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" variant="secondary" />
                            </div>
                        ) : (
                            <Table bordered hover responsive className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Email</th>
                                        <th>Aptitude</th>
                                        <th>Reasoning</th>
                                        <th>Communication</th>
                                        <th>Total Correct</th>
                                        <th>Score (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.length > 0 ? (
                                        results.map((res) => (
                                            <tr key={res.id}>
                                                <td>{res.candidateEmail}</td>
                                                <td>{res.aptitudeCorrect}</td>
                                                <td>{res.reasoningCorrect}</td>
                                                <td>{res.communicationCorrect}</td>
                                                <td>{res.totalCorrect} / 60</td>
                                                <td className="fw-bold">{res.percentage}%</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No results found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ResultBoard;