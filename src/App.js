import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { Routes, Route, useNavigate } from "react-router-dom";

import InkRatioCalculator from "./components/InkRatioCalculator";
import ProcessTimer from './components/ProcessTimer';
import InkCalculator from './components/InkCalculator';
import Calculator from './components/Calculator';
import PercentageCalculator from './components/PercentageCalculator';
import BACLookup from './components/BACLookup';
import Ink from './components/Ink';


function Home() {

  const navigate = useNavigate();

  return (
    <div>

      {/* Header */}
      <div className="App-header">

        <div className="header-row">

          <div className="timer-row">

            <ProcessTimer />

            <ProcessTimer />

            <InkCalculator />

            <Calculator />

            <PercentageCalculator />

            <BACLookup />

            {/* Open Ink page */}


          </div>

          <div className="header-logo">
          </div>

        </div>

      </div>
      {/* Footer */}
      <footer className="app-footer">

        <img
        style={{marginLeft:50}}
          src={logo}
          className="App-logo"
          alt="Payam"
        />

        <a
        style={{marginRight:450}}
          className="footer-link"
          href="https://www.wearandwonder.shop/payam-taherirostami.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Payam
        </a>
            <button
              onClick={() => navigate("/ink")}
              style={{
                maxWidth: "500px",
                padding: "10px 15px",
                // margin: "10px",
                // marginLeft:"200px",
                // marginRight:"400px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Ink values
            </button>
      </footer>

      {/* Bottom */}
      <div style={{ marginTop: "25px", padding: "15px" }}>
        <InkRatioCalculator />
      </div>




    </div>
  );
}


function App() {

  return (
    <Routes>

      {/* Main page */}
      <Route path="/" element={<Home />} />

      {/* Ink page */}
      <Route path="/ink" element={<Ink />} />

    </Routes>
  );
}


export default App;