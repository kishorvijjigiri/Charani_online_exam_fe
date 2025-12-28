import { Container, Button, Card, Row, Col, Navbar, Modal, Badge } from "react-bootstrap";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./Assets/charani logo.webp";

const SECTIONS = [
  { key: "APTITUDE", label: "Aptitude" },
  { key: "REASONING", label: "Reasoning" },
  { key: "COMMUNICATION", label: "Communication" }
];

function Exam() {
  const navigate = useNavigate();
  const candidate = useMemo(() => JSON.parse(localStorage.getItem("candidate") || "null"), []);

  const [sectionIndex, setSectionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set());
  const [time, setTime] = useState(3600); 
  const [submitted, setSubmitted] = useState(false);
  
  // Security States
  const [violationCount, setViolationCount] = useState(0);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [violationType, setViolationType] = useState("");

  // --- SECURITY ENFORCEMENT LOGIC ---
  useEffect(() => {
    if (submitted) return;

    if (violationCount >= 3) {
      processSubmission();
      return;
    }

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && !submitted && !showSecurityModal) {
        setViolationCount(prev => prev + 1);
        setViolationType("Full Screen Exit");
        setShowSecurityModal(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !submitted && !showSecurityModal) {
        setViolationCount(prev => prev + 1);
        setViolationType("Tab Switching");
        setShowSecurityModal(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [submitted, violationCount, showSecurityModal]);

  const handleRestoreSecurity = () => {
    const elem = document.documentElement;
    const requestFS = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
    if (requestFS) {
      requestFS.call(elem).then(() => setShowSecurityModal(false)).catch(() => setShowSecurityModal(false));
    }
  };

  useEffect(() => {
    if (questions[qIndex]) {
      setVisited(prev => new Set(prev).add(questions[qIndex].id));
    }
  }, [qIndex, questions]);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timer);
          processSubmission();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    if (!candidate?.email) return;
    axios.get(`http://localhost:8080/api/questions/${SECTIONS[sectionIndex].key}`, {
      params: { email: candidate.email }
    })
      .then(res => {
        setQuestions(res.data);
        setQIndex(0);
      })
      .catch(err => console.error(err));
  }, [sectionIndex, candidate?.email]);

  const selectOption = (qid, option) => {
    setAnswers(prev => ({ ...prev, [qid]: option }));
  };

  // ADDED CONFIRMATION ALERT
  const handleFinalSubmitRequest = () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit the exam?");
    if (confirmSubmit) {
      setSubmitted(true);
      processSubmission();
    }
  };

  const processSubmission = () => {
    const answerList = Object.keys(answers).map(qid => ({
      questionId: qid,
      selectedOption: answers[qid]
    }));

    axios.post("http://localhost:8080/api/result/submit", {
      candidateEmail: candidate.email,
      answers: answerList,
      violations: violationCount
    })
    .then(() => {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        navigate(`/result/${candidate.email}`);
    })
    .catch(() => navigate(`/result/${candidate.email}`));
  };

  const q = questions[qIndex];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <Modal show={showSecurityModal} backdrop="static" keyboard={false} centered>
        <Modal.Header className="bg-danger text-white border-0">
          <Modal.Title className="fw-bold">Security Violation: {violationType}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <h5 className="text-danger fw-bold">Warning {violationCount} / 3</h5>
          <p>Please return to full screen to continue. 3 violations result in auto-submission.</p>
          <Button variant="danger" size="lg" className="w-100 fw-bold mt-2" onClick={handleRestoreSecurity}>Return to Full Screen</Button>
        </Modal.Body>
      </Modal>

      <Navbar style={{ backgroundColor: "#3c20efff" }} variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold d-flex align-items-center">
            <img src={logo} alt="Logo" width="40" height="40" className="me-2 bg-white rounded-circle p-1" />
            CHARANI INFOTECH
          </Navbar.Brand>
          <Navbar.Text className="text-white ms-auto">
            Candidate: <b>{candidate?.email}</b>
          </Navbar.Text>
        </Container>
      </Navbar>

      <Container className="mt-4 pb-5">
        <Row>
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-dark fw-bold">Examination Panel</h4>
              <h5 className={time < 300 ? "text-danger fw-bold" : "text-primary fw-bold"}>
                ⏳ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
              </h5>
            </div>

            <Row className="mb-4 g-2">
              {SECTIONS.map((s, i) => (
                <Col key={s.key}>
                  <div className={`text-center py-2 fw-bold rounded border ${i === sectionIndex ? "bg-primary text-white" : "bg-white text-muted"}`}>
                    {s.label}
                  </div>
                </Col>
              ))}
            </Row>

            {q ? (
              <Card className="p-4 shadow border-0 rounded-3">
                <div className="d-flex justify-content-between text-muted border-bottom pb-2 mb-4">
                  <span className="fw-bold text-primary">{SECTIONS[sectionIndex].label}</span>
                  <span>Question {qIndex + 1} of {questions.length}</span>
                </div>
                <h5 className="mb-4" style={{ lineHeight: '1.6' }}>{q.question}</h5>
                <Row className="g-3">
                  {["A", "B", "C", "D"].map(op => (
                    <Col md={6} key={op}>
                      <Button
                        className="w-100 text-start p-3 shadow-sm border-2"
                        variant={answers[q.id] === op ? "success" : "outline-secondary"}
                        onClick={() => selectOption(q.id, op)}
                        disabled={submitted}
                      >
                        <b>{op}.</b> {q[`option${op}`]}
                      </Button>
                    </Col>
                  ))}
                </Row>
                <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                  <Button variant="outline-secondary" className="px-4 fw-bold" disabled={qIndex === 0 || submitted} onClick={() => setQIndex(qIndex - 1)}>← Previous</Button>
                  {qIndex < questions.length - 1 ? (
                    <Button variant="primary" className="px-5 fw-bold" onClick={() => setQIndex(qIndex + 1)} disabled={submitted}>Next Question →</Button>
                  ) : sectionIndex < SECTIONS.length - 1 ? (
                    <Button variant="warning" className="px-5 fw-bold shadow-sm" onClick={() => setSectionIndex(sectionIndex + 1)} disabled={submitted}>Next Section →</Button>
                  ) : (
                    <Button variant="danger" className="px-5 fw-bold shadow-sm" onClick={handleFinalSubmitRequest} disabled={submitted}>Submit Final Test</Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="text-center p-5 bg-white rounded shadow">Loading...</div>
            )}
          </Col>

          <Col lg={4}>
            {/* SIMPLE VIOLATION BOX */}
            <div className="p-3 mb-3 bg-white border rounded shadow-sm text-center">
              <span className="text-muted small fw-bold text-uppercase">Violations</span>
              <div className="h4 fw-bold text-danger mb-0">{violationCount} / 3</div>
            </div>

            <Card className="shadow border-0">
              <Card.Header className="bg-dark text-white fw-bold text-center">Question Palette</Card.Header>
              <Card.Body className="p-4">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                  {questions.map((item, idx) => {
                    let btnVariant = "outline-secondary";
                    if (qIndex === idx) btnVariant = "primary";
                    else if (answers[item.id]) btnVariant = "success";
                    else if (visited.has(item.id)) btnVariant = "warning";
                    return (
                      <Button key={item.id} variant={btnVariant} className="fw-bold" style={{ height: "45px", color: btnVariant === "warning" ? "white" : "" }} onClick={() => setQIndex(idx)} disabled={submitted}>
                        {idx + 1}
                      </Button>
                    );
                  })}
                </div>
                <hr className="my-4" />
                <div className="small text-muted mb-4">
                  <div className="d-flex align-items-center mb-1"><div className="bg-primary rounded-circle me-2" style={{ width: 10, height: 10 }}></div> Current</div>
                  <div className="d-flex align-items-center mb-1"><div className="bg-success rounded-circle me-2" style={{ width: 10, height: 10 }}></div> Answered</div>
                  <div className="d-flex align-items-center mb-1"><div className="bg-warning rounded-circle me-2" style={{ width: 10, height: 10 }}></div> Visited</div>
                  <div className="d-flex align-items-center"><div className="bg-secondary opacity-25 rounded-circle me-2" style={{ width: 10, height: 10 }}></div> Not Visited</div>
                </div>
                <Button variant="danger" size="lg" className="w-100 fw-bold shadow-sm" onClick={handleFinalSubmitRequest} disabled={submitted}>FINAL SUBMIT</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Exam;