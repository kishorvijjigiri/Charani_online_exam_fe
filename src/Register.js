import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};

    if (!data.name.trim()) err.name = "Name is required";
    if (!data.email) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      err.email = "Invalid email format";

    if (!data.phone) err.phone = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(data.phone))
      err.phone = "Enter valid 10 digit mobile number";

    if (!data.college.trim()) err.college = "College name is required";
    if (!data.branch.trim()) err.branch = "Branch is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const submit = () => {
    if (!validate()) return;

    setLoading(true);

    axios.post("http://localhost:8080/api/candidate/register", data)
      .then(res => {
        const candidateId = res.data; // backend returns saved candidate ID
        const candidateEmail = data.email;

        // Save candidate info in localStorage
        localStorage.setItem(
          "candidate",
          JSON.stringify({ id: candidateId, email: candidateEmail })
        );

        // Navigate to exam page
        navigate(`/instructions/${candidateId}`);
      })
      .catch(err => {
        alert(err.response?.data || "Server error");
        setLoading(false);
      });
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h1 className="text-center mb-3">CHARANI INFOTECH</h1>
        <h3 className="text-center mb-3">Online Exam Registration</h3>

        {["name", "email", "phone", "college", "branch"].map(field => (
          <Form.Group className="mb-3" key={field}>
            <Form.Control
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={data[field]}
              isInvalid={!!errors[field]}
              onChange={e => setData({ ...data, [field]: e.target.value })}
              maxLength={field === "phone" ? 10 : undefined}
            />
            <Form.Control.Feedback type="invalid">
              {errors[field]}
            </Form.Control.Feedback>
          </Form.Group>
        ))}

        <Button className="w-100" disabled={loading} onClick={submit}>
          {loading ? "Please wait..." : "Start Exam"}
        </Button>
      </Card>
    </Container>
  );
}

export default Register;
