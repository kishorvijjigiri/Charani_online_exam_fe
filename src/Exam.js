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
  const [time, setTime] = useState(3600);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!candidate) navigate("/register");
  }, [candidate, navigate]);

  // Track visited questions
  useEffect(() => {
    if (questions[qIndex]) {
      setVisited(prev => new Set(prev).add(questions[qIndex].id));
    }
  }, [qIndex, questions]);

  // TIMER
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1 && !submitted) {
          clearInterval(timer);
          setSubmitted(true);
          handleFinalSubmission();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  // FETCH QUESTIONS
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

  const q = questions[qIndex];

  const selectOption = (qid, option) => {
    setAnswers(prev => ({ ...prev, [qid]: option }));
  };

  // UPDATED LOGIC FOR ALERT ON COMPLETION
  const handleNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      if (sectionIndex < SECTIONS.length - 1) {
        setSectionIndex(sectionIndex + 1);
      } else {
        // Updated Alert message as requested
        alert("You have reached the end of the exam. Please click on the Final Submit button to end your test.");
      }
    }
  };

  const handleFinalSubmission = () => {
    if (submitted) return;
    if (!window.confirm("Are you sure you want to submit the entire test?")) return;
    setSubmitted(true);
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
        alert("Submission failed");
        setSubmitted(false);
    });
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
               <h4 className="text-dark">Online Examination</h4>
               <h5 className={time < 300 ? "text-danger fw-bold" : "text-primary"}>
                Time Left: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
               </h5>
            </div>

            <Row className="mb-4 g-2">
              {SECTIONS.map((s, i) => (
                <Col key={s.key}>
                  <Button 
                    className="w-100 fw-bold py-2 shadow-sm" 
                    variant={i === sectionIndex ? "primary" : "outline-primary"} 
                    onClick={() => setSectionIndex(i)}
                  >
                    {s.label}
                  </Button>
                </Col>
              ))}
            </Row>

            {q && (
              <Card className="p-4 shadow border-0">
                <div className="d-flex justify-content-between text-muted border-bottom pb-2 mb-3">
                   <span className="fw-bold text-uppercase">{SECTIONS[sectionIndex].label} Section</span>
                   <span>Question {qIndex + 1} / {questions.length}</span>
                </div>
                <h5 className="mb-4" style={{lineHeight: '1.6'}}>{q.question}</h5>
                <Row className="g-3">
                  {["A", "B", "C", "D"].map(op => (
                    <Col md={6} key={op}>
                      <Button 
                        className="w-100 text-start p-3 shadow-sm" 
                        variant={answers[q.id] === op ? "success" : "outline-secondary"} 
                        onClick={() => selectOption(q.id, op)}
                      >
                        <b className="me-2">{op}.</b> {q[`option${op}`]}
                      </Button>
                    </Col>
                  ))}
                </Row>
                <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                  <Button variant="secondary" className="px-4" disabled={qIndex === 0} onClick={() => setQIndex(qIndex - 1)}>Previous</Button>
                  <Button variant="primary" className="px-4" onClick={handleNext}>
                    {qIndex === questions.length - 1 && sectionIndex === SECTIONS.length -1 ? "Finish Exam" : "Next"}
                  </Button>
                </div>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            <Card className="shadow border-0 position-sticky" style={{ top: "20px" }}>
              <Card.Header className="bg-primary text-white fw-bold py-3 text-center text-uppercase">
                {SECTIONS[sectionIndex].label}
              </Card.Header>
              <Card.Body className="p-4">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                  {questions.map((item, idx) => {
                    let btnVariant = "outline-dark"; // BLACK OUTLINE FOR NOT VISITED
                    let textClass = "text-dark";

                    if (qIndex === idx) {
                        btnVariant = "primary"; // Blue
                        textClass = "text-white";
                    } else if (answers[item.id]) {
                        btnVariant = "success"; // Green
                        textClass = "text-white";
                    } else if (visited.has(item.id)) {
                        btnVariant = "warning"; // Orenge
                        textClass = "text-white";
                    }

                    return (
                      <Button
                        key={item.id}
                        variant={btnVariant}
                        className={`fw-bold ${textClass}`}
                        style={{ height: "45px" }}
                        onClick={() => setQIndex(idx)}
                      >
                        {idx + 1}
                      </Button>
                    );
                  })}
                </div>
                <hr className="my-4" />
                <Button variant="danger" size="lg" className="w-100 fw-bold shadow-sm py-2" onClick={handleFinalSubmission}>
                    FINAL SUBMIT
                </Button>

                <div className="mt-4 p-3 bg-light rounded small">
                    <h6 className="fw-bold text-muted mb-2 small">LEGEND:</h6>
                    <div className="d-flex align-items-center mb-1"><div className="bg-primary me-2 rounded" style={{width:12,height:12}}></div> Active</div>
                    <div className="d-flex align-items-center mb-1"><div className="bg-success me-2 rounded" style={{width:12,height:12}}></div> Answered</div>
                    <div className="d-flex align-items-center mb-1"><div className="bg-warning me-2 rounded" style={{width:12,height:12}}></div> Not Answered</div>
                    <div className="d-flex align-items-center"><div className="border border-dark me-2 rounded" style={{width:12,height:12}}></div> Not Visited</div>
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