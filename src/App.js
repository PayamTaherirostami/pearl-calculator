import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import InkRatioCalculator from "./components/InkRatioCalculator";
import ProcessTimer from './components/ProcessTimer';
import InkCalculator from './components/InkCalculator';
import Calculator from './components/Calculator';
import PercentageCalculator from './components/PercentageCalculator';
import BACLookup from './components/BACLookup';

function App() {
  return (
    <div>

      {/* Header */}
      <div className="App-header">

        <div className="header-row">

          {/* Calculators */}
          <div className="timer-row">

            <ProcessTimer />

            <ProcessTimer />

            <InkCalculator />

            <Calculator />

            <PercentageCalculator />

            <BACLookup />

          </div>


          {/* Right Side Logo */}
          <div className="header-logo">
          </div>

        </div>

      </div>


      {/* Bottom */}
      <div style={{ marginTop: "25px", padding: "15px" }}>
        <InkRatioCalculator />
      </div>


      {/* Footer */}
      <footer className="app-footer">

        <img
          src={logo}
          className="App-logo"
          alt="Payam"
        />

        <a
          className="footer-link"
          href="https://www.wearandwonder.shop/payam-taherirostami.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Payam
        </a>

      </footer>

    </div>
  );
}

export default App;