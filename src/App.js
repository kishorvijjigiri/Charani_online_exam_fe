import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Exam from "./Exam";
import Result from "./Result";
import Instructions from "./Instructions";
import ResultBoard from "./ResultBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/instructions/:email" element={<Instructions />} />
        <Route path="/exam/:email" element={<Exam />} />
        <Route path="/result/:email" element={<Result />} />
        <Route path="/admin" element={<ResultBoard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
