import { Container, Card, Button, Navbar, Row, Col, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaInfoCircle, FaClock, FaClipboardList } from "react-icons/fa";
import { useState } from "react"; // 1. Added useState
import logo from "./Assets/charani logo.webp"; 

function Instructions() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");
  
  // 2. State to track if the agreement checkbox is checked
  const [isAgreed, setIsAgreed] = useState(false);

  if (!candidate) return <h3 className="text-center mt-5">Unauthorized Access</h3>;

  return (
    <div style={{ backgroundColor: "#f4f7f9", minHeight: "100vh" }}>
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
              <span className="opacity-75">Candidate Email:</span> <b>{candidate.email}</b>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="pb-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Header className="bg-white py-3 border-bottom">
                <h3 className="mb-0 text-primary d-flex align-items-center">
                  <FaInfoCircle className="me-2" /> Exam Instructions
                </h3>
              </Card.Header>
              <Card.Body className="p-4">
                
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <div className="px-3 py-2 bg-light rounded-pill border">
                    <FaClock className="me-2 text-primary" /> <b>Duration:</b> 60 Mins
                  </div>
                  <div className="px-3 py-2 bg-light rounded-pill border">
                    <FaClipboardList className="me-2 text-primary" /> <b>Questions:</b> 60
                  </div>
                </div>

                <section className="mb-4">
                  {/* Removed the border-start styling */}
                  <h5 className="fw-bold mb-3 text-dark">General Rules</h5>
                  <ul className="lh-lg">
                    <li>Ensure you have a stable internet connection before starting.</li>
                    <li>The exam contains three sections: <b>Aptitude, Reasoning, and Communication.</b></li>
                    <li>Each question carries <b>1 mark</b>. There is <b>no negative marking</b>.</li>
                    <li>Once you click "Start Exam", the timer will begin and cannot be paused.</li>
                  </ul>
                </section>

                <section className="mb-4">
                  {/* Removed the border-start styling */}
                  <h5 className="fw-bold mb-3 text-dark">Restrictions</h5>
                  <ul className="lh-lg">
                    <li>Do not refresh the page or click the "Back" button during the exam.</li>
                    <li>Switching tabs or windows may lead to <b>automatic disqualification</b>.</li>
                    <li>Use of calculators, mobile phones, or reference materials is strictly prohibited.</li>
                  </ul>
                </section>

                {/* 3. Replaced Danger Symbol with Checkbox */}
                <div className="bg-light p-3 rounded mb-4">
                  <Form.Check 
                    type="checkbox"
                    id="agreement-checkbox"
                    label="I have read and understood the instructions. I agree to abide by the rules of the examination."
                    className="fw-semibold text-muted"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                  />
                  <p className="small mb-0 text-muted mt-2 ms-4">
                    Note: The exam will be automatically submitted once the time expires.
                  </p>
                </div>

                <div className="text-center">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-5 py-3 fw-bold shadow"
                    /* 4. Button is disabled unless isAgreed is true */
                    disabled={!isAgreed}
                    onClick={() => navigate(`/exam/${candidateId}`)}
                  >
                    I AM READY TO START
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Instructions;