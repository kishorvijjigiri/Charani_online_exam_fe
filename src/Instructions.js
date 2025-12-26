import { Container, Card, Button, Navbar } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
// import Header from "../components/Header";

function Instructions() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const candidate = JSON.parse(localStorage.getItem("candidate") || "null");

  if (!candidate) return null;

  return (
    <>
      <Navbar bg="light" className="mb-3">
      <Container>
        <Navbar.Brand>Online Exam Portal</Navbar.Brand>
        <div>
          <strong>{candidate.name}</strong> | {candidate.email}
        </div>
      </Container>
    </Navbar>
      <Container className="mt-3">
        <Card className="p-4 shadow">
          <h4>Charani Infotech Private Limited</h4>
          <p><b>Duration:</b> 60 Minutes | <b>Total Questions:</b> 60</p>
          <ul>
            <li>All questions are compulsory</li>
            <li>Each question carries 1 mark</li>
            <li>No negative marking</li>
            <li>Calculator not allowed</li>
          </ul>

          <Button onClick={() => navigate(`/exam/${candidateId}`)}>
            Click to Continue
          </Button>
        </Card>
      </Container>
    </>
  );
}

export default Instructions;
