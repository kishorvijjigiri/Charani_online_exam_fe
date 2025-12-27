import { Container, Card, Navbar, Row, Col, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBrain, FaCalculator, FaComments, FaTrophy } from "react-icons/fa";
import logo from "./Assets/charani logo.webp"; 

function Result() {
  const [result, setResult] = useState(null);
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

  useEffect(() => {
    if (!candidate?.email) return;

    axios
      .get(`http://localhost:8080/api/result/email/${candidate.email}`)
      .then(res => setResult(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!result) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <>
      {/* Navbar matching your theme */}
      <Navbar style={{ backgroundColor: "#3c20efff" }} variant="dark" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand className="d-flex align-items-center">
            <img
              src={logo}
              alt="Charani Logo"
              width="45"
              height="45"
              className="d-inline-block align-top me-2"
              style={{ borderRadius: "50%", backgroundColor: "white", padding: "2px" }}
            />
            <span className="fw-bold">CHARANI INFOTECH</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="text-white">
              <span className="opacity-75">Candidate:</span> <b>{candidate.email}</b>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h4 className="text-muted text-uppercase mb-3">Exam Scorecard</h4>
                  <h1 className="display-3 fw-bold" style={{ color: "#3c20efff" }}>
                    {result.percentage.toFixed(1)}%
                  </h1>
                  
                  {/* Simplified Progress Bar */}
                  <div className="px-5 mt-2">
                    <ProgressBar 
                      now={result.percentage} 
                      style={{ height: '8px' }} 
                      variant="primary"
                    />
                  </div>
                </div>

                <hr className="my-4" />

                {/* Simplified Section Breakdown */}
                <Row className="text-center">
                  <Col xs={4}>
                    <FaCalculator className="text-secondary mb-2" size={20} />
                    <div className="small text-muted">Aptitude</div>
                    <div className="fw-bold">{result.aptitudeCorrect}</div>
                  </Col>
                  <Col xs={4}>
                    <FaBrain className="text-secondary mb-2" size={20} />
                    <div className="small text-muted">Reasoning</div>
                    <div className="fw-bold">{result.reasoningCorrect}</div>
                  </Col>
                  <Col xs={4}>
                    <FaComments className="text-secondary mb-2" size={20} />
                    <div className="small text-muted">Comm.</div>
                    <div className="fw-bold">{result.communicationCorrect}</div>
                  </Col>
                </Row>

                {/* Total Score Box - Blue matching Navbar */}
                <div 
                  className="mt-5 p-3 rounded-3 text-white text-center shadow-sm"
                  style={{ backgroundColor: "#3c20efff" }}
                >
                  <p className="mb-1 opacity-75 small">Total Correct Answers</p>
                  <h2 className="mb-0 fw-bold">{result.totalCorrect}</h2>
                </div>
                
                <div className="text-center mt-4">
                   <p className="text-muted small italic">Examination completed successfully.</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Result;