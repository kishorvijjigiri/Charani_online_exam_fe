import { Container, Form, Button, Card, Navbar } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assuming you saved the logo in your 'src' or 'public/assets' folder
import logo from "./Assets/charani logo.webp"; 

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    gender: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const branchOptions = ["EEE", "ECE", "CSE", "IT", "MECH", "CIVIL"];
  const genderOptions = ["Male", "Female", "Other"];

  const validate = () => {
    let err = {};
    if (!data.name.trim()) err.name = "Name is required";
    if (!data.email) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) err.email = "Invalid email format";
    if (!data.phone) err.phone = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(data.phone)) err.phone = "Enter valid 10 digit mobile number";
    if (!data.college.trim()) err.college = "College name is required";
    if (!data.branch) err.branch = "Please select your branch";
    if (!data.gender) err.gender = "Please select your gender";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    
    axios.post("http://localhost:8080/api/candidate/register", data)
      .then(res => {
        const candidateId = res.data.id || res.data;
        localStorage.setItem("candidate", JSON.stringify({ id: candidateId, email: data.email }));
        navigate(`/instructions/${candidateId}`);
      })
      .catch(err => {
        setLoading(false);
        // Check if the server sent a specific error message for duplicates
        const errorMessage = err.response?.data;

        if (err.response?.status === 409 || (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes("exists"))) {
          alert("Already you wrote the exam with this Email or Mobile Number!");
        } else {
          alert(errorMessage || "Server error. Please try again later.");
        }
      });
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Blue Navbar with Logo */}
      <Navbar style={{ backgroundColor: "#3216e8ff" }} variant="dark" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img
              src={logo}
              alt="Charani Logo"
              width="40"
              height="40"
              className="d-inline-block align-top me-2"
              style={{ borderRadius: "50%", backgroundColor: "white" }}
            />
            <span className="fw-bold text-white">CHARANI INFOTECH</span>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="d-flex justify-content-center">
        <Card className="p-4 shadow border-0" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center mb-4 text-primary">Online Exam Registration</h3>

          <Form>
            {["name", "email", "phone", "college"].map(field => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="small fw-bold">{field.toUpperCase()}</Form.Label>
                <Form.Control
                  placeholder={`Enter your ${field}`}
                  value={data[field]}
                  isInvalid={!!errors[field]}
                  onChange={e => setData({ ...data, [field]: e.target.value })}
                  maxLength={field === "phone" ? 10 : undefined}
                />
                <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">GENDER</Form.Label>
              <Form.Select 
                isInvalid={!!errors.gender}
                value={data.gender}
                onChange={(e) => setData({ ...data, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">BRANCH</Form.Label>
              <Form.Select 
                isInvalid={!!errors.branch}
                value={data.branch}
                onChange={(e) => setData({ ...data, branch: e.target.value })}
              >
                <option value="">Select Branch</option>
                {branchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.branch}</Form.Control.Feedback>
            </Form.Group>

            <Button 
              variant="primary" 
              className="w-100 py-2 fw-bold" 
              disabled={loading} 
              onClick={submit}
            >
              {loading ? "Registering..." : "START EXAM"}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default Register;