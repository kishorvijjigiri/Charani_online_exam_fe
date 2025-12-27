import { Container, Button, Card, Row, Col, Navbar } from "react-bootstrap";
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
  const [time, setTime] = useState(3600); // 60 minutes
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!candidate) navigate("/register");
  }, [candidate, navigate]);

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
          autoSubmit();
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
      .catch(err => console.error("Error fetching questions:", err));
  }, [sectionIndex, candidate?.email]);

  const selectOption = (qid, option) => {
    setAnswers(prev => ({ ...prev, [qid]: option }));
  };

  const autoSubmit = () => {
    setSubmitted(true);
    processSubmission();
  };

  const handleFinalSubmission = () => {
    if (window.confirm("Are you sure you want to submit the entire test? You cannot change your answers after this.")) {
      setSubmitted(true);
      processSubmission();
    }
  };

  const processSubmission = () => {
    const answerList = Object.keys(answers).map(qid => ({
      questionId: Number(qid),
      selectedOption: answers[qid]
    }));

    axios.post("http://localhost:8080/api/result/submit", {
      candidateEmail: candidate.email,
      answers: answerList
    })
      .then(() => navigate(`/result/${candidate.email}`))
      .catch(() => {
        alert("Submission failed. Please check your connection.");
        setSubmitted(false);
      });
  };

  const q = questions[qIndex];

  // LOGIC FOR BUTTONS
  const isLastQuestionOfSection = qIndex === questions.length - 1;
  const isLastSection = sectionIndex === SECTIONS.length - 1;

  // REMOVED ALERT: Transitions immediately
  const goToNextSection = () => {
    setSectionIndex(sectionIndex + 1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
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
              <h4 className="text-dark fw-bold">Online Assessment</h4>
              <h5 className={time < 300 ? "text-danger fw-bold" : "text-primary fw-bold"}>
                ⏳ Time Left: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
              </h5>
            </div>

            {/* Section Tabs */}
            <Row className="mb-4 g-2">
              {SECTIONS.map((s, i) => (
                <Col key={s.key}>
                  <Button
                    className="w-100 fw-bold py-2 shadow-sm border-2"
                    variant={i === sectionIndex ? "primary" : "outline-primary"}
                    onClick={() => {
                        if(!submitted) {
                            setSectionIndex(i);
                            setQIndex(0);
                        }
                    }}
                    disabled={submitted}
                  >
                    {s.label}
                  </Button>
                </Col>
              ))}
            </Row>

            {q ? (
              <Card className="p-4 shadow border-0 rounded-3">
                <div className="d-flex justify-content-between text-muted border-bottom pb-2 mb-3">
                  <span className="fw-bold text-primary text-uppercase small tracking-wider">{SECTIONS[sectionIndex].label} Section</span>
                  <span>Question {qIndex + 1} of {questions.length}</span>
                </div>
                
                <h5 className="mb-4 fw-normal" style={{ lineHeight: '1.7' }}>{q.question}</h5>
                
                <Row className="g-3">
                  {["A", "B", "C", "D"].map(op => (
                    <Col md={6} key={op}>
                      <Button
                        className="w-100 text-start p-3 shadow-sm"
                        variant={answers[q.id] === op ? "success" : "outline-secondary"}
                        onClick={() => selectOption(q.id, op)}
                        disabled={submitted}
                      >
                        <b className="me-2">{op}.</b> {q[`option${op}`]}
                      </Button>
                    </Col>
                  ))}
                </Row>

                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                  <Button 
                    variant="outline-secondary" 
                    className="px-4 fw-bold" 
                    disabled={qIndex === 0 || submitted} 
                    onClick={() => setQIndex(qIndex - 1)}
                  >
                    ← Previous
                  </Button>
                  
                  {!isLastQuestionOfSection ? (
                    <Button 
                      variant="primary" 
                      className="px-5 fw-bold" 
                      onClick={() => setQIndex(qIndex + 1)}
                      disabled={submitted}
                    >
                      Next Question →
                    </Button>
                  ) : !isLastSection ? (
                    <Button 
                      variant="warning" 
                      className="px-5 fw-bold shadow-sm" 
                      onClick={goToNextSection}
                      disabled={submitted}
                    >
                      Next Section ({SECTIONS[sectionIndex + 1].label}) →
                    </Button>
                  ) : (
                    <Button 
                      variant="danger" 
                      className="px-5 fw-bold shadow-sm" 
                      onClick={handleFinalSubmission}
                      disabled={submitted}
                    >
                      Submit Entire Test
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="text-center p-5">Loading questions...</div>
            )}
          </Col>

          <Col lg={4}>
            <Card className="shadow border-0 position-sticky" style={{ top: "20px" }}>
              <Card.Header className="bg-primary text-white fw-bold py-3 text-center text-uppercase">
                Question Palette
              </Card.Header>
              <Card.Body className="p-4 text-center">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                  {questions.map((item, idx) => {
                    let btnVariant = "outline-dark";
                    if (qIndex === idx) btnVariant = "primary";
                    else if (answers[item.id]) btnVariant = "success";
                    else if (visited.has(item.id)) btnVariant = "warning";

                    return (
                      <Button
                        key={item.id}
                        variant={btnVariant}
                        className="fw-bold"
                        style={{ height: "45px", width: "100%" }}
                        onClick={() => setQIndex(idx)}
                        disabled={submitted}
                      >
                        {idx + 1}
                      </Button>
                    );
                  })}
                </div>

                <hr className="my-4" />

                <Button 
                  variant="danger" 
                  size="lg" 
                  className="w-100 fw-bold shadow-lg py-3 mb-3" 
                  onClick={handleFinalSubmission}
                  disabled={submitted}
                >
                  FINAL SUBMIT
                </Button>

                <div className="p-3 bg-light rounded shadow-sm text-start">
                  <h6 className="fw-bold text-muted mb-3 small">INDICATORS</h6>
                  <div className="d-flex align-items-center mb-2"><div className="bg-primary me-2 rounded" style={{ width: 12, height: 12 }}></div> <small>Current</small></div>
                  <div className="d-flex align-items-center mb-2"><div className="bg-success me-2 rounded" style={{ width: 12, height: 12 }}></div> <small>Answered</small></div>
                  <div className="d-flex align-items-center mb-2"><div className="bg-warning me-2 rounded" style={{ width: 12, height: 12 }}></div> <small>Visited</small></div>
                  <div className="d-flex align-items-center"><div className="border border-dark me-2 rounded" style={{ width: 12, height: 12 }}></div> <small>Not Visited</small></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Exam;