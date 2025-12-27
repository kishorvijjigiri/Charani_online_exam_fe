import { Container, Card, Navbar, Row, Col, ProgressBar, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBrain, FaCalculator, FaComments, FaTrophy, FaCheckCircle, FaGlobe, FaHome, FaCopyright } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "./Assets/charani logo.webp"; 

function Result() {
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

  useEffect(() => {
    if (!candidate?.email) return;

    axios
      .get(`http://localhost:8080/api/result/email/${candidate.email}`)
      .then(res => setResult(res.data))
      .catch(err => console.error(err));
  }, [candidate?.email]);

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setFeedbackSubmitted(true);
    } else {
      alert('Please enter your feedback before submitting.');
    }
  };

  if (!result) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <h3 className="text-muted">Loading your scorecard...</h3>
    </div>
  );

  return (
    <div className="d-flex flex-column" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <Navbar style={{ backgroundColor: "#3c20efff" }} variant="dark" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand className="d-flex align-items-center fw-bold">
            <img
              src={logo}
              alt="Logo"
              width="45"
              height="45"
              className="me-2 bg-white rounded-circle p-1"
            />
            CHARANI INFOTECH
          </Navbar.Brand>
          <Navbar.Text className="text-white d-none d-sm-block text-uppercase small letter-spacing-1">
            Official Assessment Portal
          </Navbar.Text>
        </Container>
      </Navbar>

      {/* MAIN CONTENT AREA */}
      <Container className="flex-grow-1 pb-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-lg border-0 rounded-5 overflow-hidden mb-5">
              <div className="text-center text-white p-5" style={{ backgroundColor: "#3c20efff" }}>
                <FaTrophy size={70} className="text-warning mb-3" />
                <h2 className="fw-bold mb-1">Congratulations</h2>
                <p className="opacity-75 mb-0">{candidate.email}</p>
                <p className="opacity-75 mb-0">You have Successfully completed the Assessment</p>
              </div>

              <Card.Body className="p-4 p-md-5 bg-white">
                <Row className="g-4 mb-5 text-center">
                  <Col md={6}>
                    <div className="p-4 rounded-4" style={{ backgroundColor: "#f0fff4", border: "1px solid #c6f6d5" }}>
                      <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Correct</span>
                      <span className="display-5 fw-bold text-success">{result.totalCorrect}</span>
                      <span className="text-muted fs-4"> / 60</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-4 rounded-4" style={{ backgroundColor: "#ebf8ff", border: "1px solid #bee3f8" }}>
                      <span className="text-muted small fw-bold text-uppercase d-block mb-1">Percentage</span>
                      <span className="display-5 fw-bold" style={{color: "#3c20efff"}}>{result.percentage.toFixed(1)}%</span>
                    </div>
                  </Col>
                </Row>

                <div className="mb-5 px-md-5">
                  <div className="d-flex justify-content-between mb-1 small fw-bold text-muted">
                    <span>Performance Scale</span>
                    <span>{result.percentage.toFixed(0)}%</span>
                  </div>
                  <ProgressBar 
                    now={result.percentage} 
                    style={{ height: '12px', borderRadius: '10px' }} 
                    variant={result.percentage > 70 ? "success" : "primary"}
                    animated
                  />
                </div>

                <h5 className="fw-bold text-dark mb-4">Sectional Analysis</h5>
                <Row className="g-3 mb-5 text-center">
                  <Col xs={4}>
                    <div className="p-3 border rounded-4 bg-light shadow-sm">
                      <FaCalculator className="mb-2" style={{color: "#3c20efff"}} size={20} />
                      <div className="small fw-bold text-muted text-uppercase" style={{fontSize: '0.65rem'}}>Aptitude</div>
                      <div className="h4 fw-bold mb-0">{result.aptitudeCorrect}</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="p-3 border rounded-4 bg-light shadow-sm">
                      <FaBrain className="mb-2 text-purple" style={{color: "#6f42c1"}} size={20} />
                      <div className="small fw-bold text-muted text-uppercase" style={{fontSize: '0.65rem'}}>Reasoning</div>
                      <div className="h4 fw-bold mb-0">{result.reasoningCorrect}</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="p-3 border rounded-4 bg-light shadow-sm">
                      <FaComments className="mb-2 text-info" size={20} />
                      <div className="small fw-bold text-muted text-uppercase" style={{fontSize: '0.65rem'}}>Comm.</div>
                      <div className="h4 fw-bold mb-0">{result.communicationCorrect}</div>
                    </div>
                  </Col>
                </Row>

                <div className="border-top pt-4">
                  <h6 className="fw-bold mb-3 text-dark">Candidate Feedback</h6>
                  {!feedbackSubmitted ? (
                    <>
                      <Form.Control 
                        as="textarea" rows={3} className="mb-3 rounded-3 shadow-sm"
                        placeholder="Tell us about your experience..."
                        value={feedback} onChange={(e) => setFeedback(e.target.value)}
                      />
                      <Button onClick={handleFeedbackSubmit} className="px-4 py-2 rounded-pill fw-bold border-0 shadow-sm" style={{backgroundColor: "#3c20efff"}}>
                        Submit Feedback
                      </Button>
                    </>
                  ) : (
                    <div className="p-3 rounded-3 border border-success bg-success bg-opacity-10 text-success fw-medium">
                      ✓ Feedback recorded. Thank you for your time!
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between mt-5 pt-3">
                  <a href="https://www.charani.in" target="_blank" rel="noreferrer" className="text-decoration-none small fw-bold d-flex align-items-center text-primary">
                    <FaGlobe size={14} className="me-1" /> Visit Website
                  </a>
                  <Link to="/" className="text-decoration-none small fw-bold text-muted d-flex align-items-center">
                    <FaHome size={14} className="me-1" /> Back to Home
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* FOOTER */}
      <footer className="mt-auto py-3 shadow-lg" style={{ backgroundColor: "#3c20efff" }}>
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-white small">
            <div className="d-flex align-items-center mb-2 mb-md-0">
              <FaCopyright className="me-2" />
              <span>2025 <b>Charani Infotech Pvt Ltd.</b> All rights reserved.</span>
            </div>
            <div className="d-flex gap-3 opacity-75">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Result;