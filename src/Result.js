import { Container, Card, Navbar } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

function Result() {
  const [result, setResult] = useState(null);
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

  useEffect(() => {
    if (!candidate?.email) return;

    axios
      .get(`http://localhost:8080/api/result/email/${candidate.email}`)
      .then(res => setResult(res.data))
      .catch(err => console.error(err));

  }, []); // ✅ EMPTY dependency → runs ONCE only

  if (!result) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <Container className="mt-5">
      <Navbar bg="light" className="mb-3">
        <Container>
          <Navbar.Brand>Online Exam Portal</Navbar.Brand>
          <strong>{candidate.email}</strong>
        </Container>
      </Navbar>

      <Card className="p-4 shadow">
        <h3>Exam Result</h3>

        <p><b>Aptitude Correct:</b> {result.aptitudeCorrect}</p>
        <p><b>Reasoning Correct:</b> {result.reasoningCorrect}</p>
        <p><b>Communication Correct:</b> {result.communicationCorrect}</p>

        <hr />
        <h4>Total Correct: {result.totalCorrect}</h4>
      </Card>
    </Container>
  );
}

export default Result;
