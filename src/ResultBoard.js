import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Form, Row, Col, Card, Spinner, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./Assets/charani logo.webp"; 

const ResultBoard = () => {
    // Auth States
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Data States
    const [results, setResults] = useState([]);
    const [emailFilter, setEmailFilter] = useState('');
    const [percentFilter, setPercentFilter] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle HR Login
    const handleSignIn = (e) => {
        e.preventDefault();
        if (loginEmail === "Charani.Hr@gmail.com" && loginPassword === "hr@12345") {
            setIsAuthenticated(true);
        } else {
            alert("Invalid HR Credentials!");
        }
    };

    // Handle Logout and Clear Inputs
    const handleLogout = () => {
        setIsAuthenticated(false);
        setLoginEmail('');    // Clears email to show placeholder
        setLoginPassword(''); // Clears password to show placeholder
        setEmailFilter('');   // Optional: clear dashboard filters too
        setPercentFilter(''); // Optional: clear dashboard filters too
    };

    const fetchResults = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const minPct = percentFilter === '' ? 0 : percentFilter;
            const response = await axios.get(`http://localhost:8080/api/result/search`, {
                params: {
                    email: emailFilter,
                    minPercentage: minPct
                }
            });
            
            // Sorting descending by percentage
            const sortedResults = response.data.sort((a, b) => b.percentage - a.percentage);
            setResults(sortedResults);
        } catch (error) {
            console.error("Error fetching results", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const timeoutId = setTimeout(() => {
                fetchResults();
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [emailFilter, percentFilter, isAuthenticated]);

    // 1. SIGN IN VIEW
    if (!isAuthenticated) {
        return (
            <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
                <Navbar style={{ backgroundColor: "#3216e8" }} variant="dark" className="shadow-sm mb-5">
                    <Container>
                        <Navbar.Brand className="d-flex align-items-center">
                            <img src={logo} alt="Logo" width="40" height="40" className="me-2 bg-white rounded-circle p-1" />
                            <span className="fw-bold">CHARANI INFOTECH</span>
                        </Navbar.Brand>
                    </Container>
                </Navbar>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={5}>
                            <Card className="border-0 shadow-lg rounded-4 mt-5">
                                <Card.Body className="p-5">
                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold text-dark">HR Portal</h2>
                                        <p className="text-muted">Please sign in to access results</p>
                                    </div>
                                    <Form onSubmit={handleSignIn}>
                                        <Form.Group className="mb-3" controlId="hrEmail">
                                            <Form.Label className="fw-semibold">HR Email</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                placeholder="Enter Your Email" 
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required 
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-4" controlId="hrPassword">
                                            <Form.Label className="fw-semibold">Password</Form.Label>
                                            <Form.Control 
                                                type="password" 
                                                placeholder="••••••••" 
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                required 
                                            />
                                        </Form.Group>
                                        <Button 
                                            type="submit" 
                                            className="w-100 py-2 fw-bold" 
                                            style={{ backgroundColor: "#3216e8", border: "none" }}
                                        >
                                            Sign In
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    // 2. DASHBOARD VIEW (Shown after Auth)
    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar style={{ backgroundColor: "#3216e8" }} variant="dark" className="shadow-sm mb-4">
                <Container>
                    <Navbar.Brand className="d-flex align-items-center">
                        <img src={logo} alt="Logo" width="40" height="40" className="me-2 bg-white rounded-circle p-1" />
                        <span className="fw-bold">CHARANI INFOTECH</span>
                    </Navbar.Brand>
                    <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Card className="shadow-sm border-0 rounded-3">
                    <Card.Header className="bg-white py-3 border-bottom">
                        <h4 className="mb-0 fw-bold text-dark text-center">Candidate Result Dashboard</h4>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Form className="mb-4">
                            <Row className="g-3">
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

                        {loading ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" style={{ color: "#3216e8" }} />
                                <p className="mt-2 text-muted">Updating results...</p>
                            </div>
                        ) : (
                            <Table bordered hover responsive className="mb-0 align-middle">
                                <thead className="table-light">
                                    <tr className="text-center">
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
                                            <tr key={res.id} className="text-center">
                                                <td className="text-start px-3">{res.candidateEmail}</td>
                                                <td>{res.aptitudeCorrect}</td>
                                                <td>{res.reasoningCorrect}</td>
                                                <td>{res.communicationCorrect}</td>
                                                <td>{res.totalCorrect} / 60</td>
                                                <td>
                                                    <span style={{fontSize: "0.9rem"}}>
                                                        {res.percentage}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted italic">
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
            <footer className="text-center py-4 text-muted small">
                © 2025 Charani Infotech Pvt Ltd. All rights reserved.
            </footer>
        </div>
    );
};

export default ResultBoard;