import { Container, Card, Button, Navbar, Row, Col, Form, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaInfoCircle, FaClock, FaClipboardList } from "react-icons/fa";
import { useState } from "react";
import logo from "./Assets/charani logo bg.png"; 

function Instructions() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");
  
  const [isAgreed, setIsAgreed] = useState(false);

  // Function to request fullscreen
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const handleStartExam = () => {
    enterFullScreen(); // Trigger fullscreen on user click
    navigate(`/exam/${candidateId}`); // Move to exam page
  };

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
          <Col md={10} lg={9}>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Header className="bg-white py-3 border-bottom">
                <h3 className="mb-0 text-primary d-flex align-items-center">
                  <FaInfoCircle className="me-2" /> Exam Instructions
                </h3>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <div className="px-3 py-2 bg-light rounded-pill border">
                    <FaClock className="me-2 text-primary" /> <b>Total Duration:</b> 60 Mins
                  </div>
                  <div className="px-3 py-2 bg-light rounded-pill border">
                    <FaClipboardList className="me-2 text-primary" /> <b>Total Questions:</b> 60
                  </div>
                </div>

                <section className="mb-5">
                  <h5 className="fw-bold mb-3 text-dark">Section-wise Breakdown</h5>
                  <Table responsive bordered hover className="text-center align-middle shadow-sm">
                    <thead style={{ backgroundColor: "#2473c7ff" }}>
                      <tr>
                        <th className="py-3">Section Name</th>
                        <th className="py-3">Questions</th>
                        <th className="py-3">Marks</th>
                        <th className="py-3">Suggested Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-bold">Aptitude</td>
                        <td>20</td>
                        <td>20</td>
                        <td className="text-muted">20 Mins</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Reasoning</td>
                        <td>20</td>
                        <td>20</td>
                        <td className="text-muted">20 Mins</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Communication</td>
                        <td>20</td>
                        <td>20</td>
                        <td className="text-muted">20 Mins</td>
                      </tr>
                    </tbody>
                    <tfoot className="table-secondary fw-bold">
                      <tr>
                        <td>TOTAL</td>
                        <td>60</td>
                        <td>60</td>
                        <td>60 Mins</td>
                      </tr>
                    </tfoot>
                  </Table>
                </section>

                <Row>
                  <Col md={6}>
                    <section className="mb-4">
                      <h5 className="fw-bold mb-3 text-dark text-decoration-underline">General Rules</h5>
                      <ul className="lh-lg small">
                        <li>Ensure a stable internet connection.</li>
                        <li>Each question carries <b>1 mark</b>.</li>
                        <li>Once you submit a section, you may not be able to return to it.</li>
                        <li>Timer starts automatically.</li>
                      </ul>
                    </section>
                  </Col>
                  <Col md={6}>
                    <section className="mb-4">
                      <h5 className="fw-bold mb-3 text-dark text-decoration-underline">Restrictions</h5>
                      <ul className="lh-lg small">
                        <li>Do not refresh or click "Back".</li>
                        <li>Tab switching is strictly monitored.</li>
                        <li>No calculators or mobile phones allowed.</li>
                        <li>Auto-submit on time expiry.</li>
                      </ul>
                    </section>
                  </Col>
                </Row>

                <div className="bg-light p-4 rounded-3 mb-4 border border-info">
                  <Form.Check 
                    type="checkbox"
                    id="agreement-checkbox"
                    label="I have read and understood all the section-wise weightage and exam rules. I am ready to begin my assessment."
                    className="fw-bold text-dark mb-0"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                  />
                </div>

                <div className="text-center">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-5 py-3 fw-bold shadow-lg"
                    style={{ borderRadius: "12px", letterSpacing: "1px" }}
                    disabled={!isAgreed}
                    onClick={handleStartExam}
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