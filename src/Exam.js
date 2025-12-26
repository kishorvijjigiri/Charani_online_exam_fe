import { Container, Button, Card, Row, Col, Navbar } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  { key: "APTITUDE", label: "Aptitude" },
  { key: "REASONING", label: "Reasoning" },
  { key: "COMMUNICATION", label: "Communication" }
];

function Exam() {
  const navigate = useNavigate();
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

  const [sectionIndex, setSectionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(3600);
  const [submitted, setSubmitted] = useState(false); // ✅ ADDED

  // 🔹 Redirect if no candidate
  useEffect(() => {
    if (!candidate) navigate("/register");
  }, [candidate, navigate]);

  // 🔹 TIMER (FIXED - SUBMITS ONLY ONCE)
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1 && !submitted) {
          clearInterval(timer);
          setSubmitted(true);
          submitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  // 🔹 LOAD QUESTIONS
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/questions/${SECTIONS[sectionIndex].key}`)
      .then(res => {
        setQuestions(res.data);
        setQIndex(0);
      })
      .catch(err => console.error(err));
  }, [sectionIndex]);

  const q = questions[qIndex];

  // 🔹 SAVE ANSWER
  const selectOption = (qid, option) => {
    setAnswers(prev => ({
      ...prev,
      [qid]: option
    }));
  };

  const next = () => {
    if (qIndex < questions.length - 1) setQIndex(qIndex + 1);
    else if (sectionIndex < SECTIONS.length - 1)
      setSectionIndex(sectionIndex + 1);
  };

  const prev = () => {
    if (qIndex > 0) setQIndex(qIndex - 1);
  };

  // 🔹 SUBMIT EXAM (PROTECTED)
  const submitExam = () => {
    if (submitted) return;        // ✅ PREVENT MULTIPLE SUBMITS
    setSubmitted(true);

    if (!candidate || !candidate.email) {
      alert("Candidate not found. Please register again.");
      navigate("/register");
      return;
    }

    const answerList = Object.keys(answers).map(qid => ({
      questionId: Number(qid),
      selectedOption: answers[qid]
    }));

    axios.post("http://localhost:8080/api/result/submit", {
      candidateEmail: candidate.email,
      answers: answerList
    })
    .then(() => navigate(`/result/${candidate.email}`))
    .catch(err => {
      console.error(err);
      alert("Exam submission failed");
    });
  };

  return (
    <Container className="mt-4">

      {/* HEADER */}
      <Navbar bg="light" className="mb-3">
        <Container>
          <Navbar.Brand>Online Exam Portal</Navbar.Brand>
          <div>
            <strong>{candidate?.email}</strong>
          </div>
        </Container>
      </Navbar>

      <Row className="mb-3">
        <Col><h4>Online Exam</h4></Col>
        <Col className="text-end">
          <h5>
            Time Left: {Math.floor(time / 60)}:
            {String(time % 60).padStart(2, "0")}
          </h5>
        </Col>
      </Row>

      {/* SECTIONS */}
      <Row className="mb-4">
        {SECTIONS.map((s, i) => (
          <Col key={s.key}>
            <Button
              className="w-100"
              variant={i === sectionIndex ? "primary" : "outline-primary"}
              onClick={() => setSectionIndex(i)}
            >
              {s.label}
            </Button>
          </Col>
        ))}
      </Row>

      {/* QUESTION */}
      {q && (
        <Card className="p-4 shadow">
          <h6>
            {SECTIONS[sectionIndex].label} | Question {qIndex + 1} / 20
          </h6>

          <h5 className="mt-3">{q.question}</h5>

          {["A", "B", "C", "D"].map(op => (
            <Button
              key={op}
              className="d-block w-100 text-start mt-2"
              variant={answers[q.id] === op ? "success" : "outline-secondary"}
              onClick={() => selectOption(q.id, op)}
            >
              {op}. {q[`option${op}`]}
            </Button>
          ))}

          <Row className="mt-4">
            <Col>
              <Button disabled={qIndex === 0} onClick={prev}>
                Previous
              </Button>
            </Col>
            <Col className="text-end">
              {sectionIndex === SECTIONS.length - 1 &&
               qIndex === questions.length - 1 ? (
                <Button
                  variant="danger"
                  disabled={submitted}
                  onClick={submitExam}
                >
                  Submit Exam
                </Button>
              ) : (
                <Button onClick={next}>Next</Button>
              )}
            </Col>
          </Row>
        </Card>
      )}
    </Container>
  );
}

export default Exam;
