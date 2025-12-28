import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./Assets/charani logo bg.png";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    gender: "",
    backlogs: "0",
    resume: null
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
    if (data.backlogs < 0) err.backlogs = "Cannot be negative";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'resume' && data[key]) {
        formData.append(key, data[key]);
      } else if (key !== 'resume') {
        formData.append(key, data[key]);
      }
    });

    axios.post("http://localhost:8080/api/candidate/register", formData)
      .then(res => {
        const candidateId = res.data.id || res.data;
        localStorage.setItem("candidate", JSON.stringify({ id: candidateId, email: data.email }));
        navigate(`/instructions/${candidateId}`);
      })
      .catch(err => {
        setLoading(false);
        alert(err.response?.data || "Server error. Please try again later.");
      });
  };

  // --- Icon Components (SVG) ---
  const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-info me-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  );
  const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning me-3"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  );
  const GradIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light me-3"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
  );

  return (
    <div className="d-flex align-items-center justify-content-center p-3 p-md-5" style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <div className="bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column flex-md-row" style={{ maxWidth: "1100px", width: "100%" }}>
        
        {/* --- LEFT SIDEBAR (Marketing Section) --- */}
        <div className="col-md-5 p-5 text-white d-flex flex-column justify-content-between" style={{ backgroundColor: "#3216e8" }}>
          <div>
            <div className="d-flex align-items-center mb-5">
              <img src={logo} alt="Logo" width={60} height={60} className="rounded-3 bg-white p-1 me-3" />
              <h2 className="h4 fw-bold m-0 text-white">Charani Infotech</h2>
            </div>
            
            <h1 className="display-6 fw-bold mb-4">Future-Ready Assessments</h1>
            <p className="opacity-75 mb-5 fs-5">
              Join thousands of students in our state-of-the-art online examination platform. Secure, fast, and reliable.
            </p>

            <div className="vstack gap-4">
              <div className="d-flex align-items-center"><CheckIcon /><span>Secure & Proctored Environment</span></div>
              <div className="d-flex align-items-center"><ClockIcon /><span>Real-time Timer & Analytics</span></div>
              <div className="d-flex align-items-center"><GradIcon /><span>Instant Result & Evaluation</span></div>
            </div>
          </div>
          <p className="small opacity-50 mt-5 mb-0">© 2025 Charani Infotech Pvt Ltd. All rights reserved.</p>
        </div>

        {/* --- RIGHT SIDE (Registration Form) --- */}
        <div className="col-md-7 p-4 p-md-5">
          <div className="mb-4 text-center text-md-start">
            <h3 className="fw-bold text-dark">Online Exam Registration</h3>
            <p className="text-muted">Fill in your details below to start the examination</p>
          </div>

          <Form>
            <div className="row">
              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="small fw-bold">FULL NAME</Form.Label>
                <Form.Control placeholder="Enter your name" value={data.name} isInvalid={!!errors.name} onChange={e => setData({ ...data, name: e.target.value })} />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="small fw-bold">EMAIL ADDRESS</Form.Label>
                <Form.Control type="email" placeholder="example@mail.com" value={data.email} isInvalid={!!errors.email} onChange={e => setData({ ...data, email: e.target.value })} />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="row">
              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="small fw-bold">MOBILE NUMBER</Form.Label>
                <Form.Control placeholder="10 digit number" value={data.phone} isInvalid={!!errors.phone} onChange={e => setData({ ...data, phone: e.target.value })} maxLength={10} />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="small fw-bold">ACTIVE BACKLOGS</Form.Label>
                <Form.Control type="number" min="0" placeholder="0" value={data.backlogs} isInvalid={!!errors.backlogs} onChange={e => setData({ ...data, backlogs: e.target.value })} />
                <Form.Control.Feedback type="invalid">{errors.backlogs}</Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="row">
              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="small fw-bold">GENDER</Form.Label>
                <Form.Select isInvalid={!!errors.gender} value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value })}>
                  <option value="">Select Gender</option>
                  {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="small fw-bold">BRANCH</Form.Label>
                <Form.Select isInvalid={!!errors.branch} value={data.branch} onChange={(e) => setData({ ...data, branch: e.target.value })}>
                  <option value="">Select Branch</option>
                  {branchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.branch}</Form.Control.Feedback>
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">COLLEGE NAME</Form.Label>
              <Form.Control placeholder="Enter your college name" value={data.college} isInvalid={!!errors.college} onChange={e => setData({ ...data, college: e.target.value })} />
              <Form.Control.Feedback type="invalid">{errors.college}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">UPLOAD RESUME <span className="text-muted fw-normal">(Optional)</span></Form.Label>
              <Form.Control type="file" accept=".pdf,.docx,.doc" onChange={e => setData({ ...data, resume: e.target.files[0] })} />
            </Form.Group>

            <Button 
              variant="primary" 
              className="w-100 py-3 fw-bold shadow-sm" 
              style={{ backgroundColor: "#3216e8", border: "none", borderRadius: "8px" }}
              disabled={loading} 
              onClick={submit}
            >
              {loading ? "PROCESSING..." : "START YOUR EXAM NOW"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;