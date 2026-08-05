import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import InkRatioCalculator from "./components/InkRatioCalculator";
import ProcessTimer from './components/ProcessTimer';
import InkCalculator from './components/InkCalculator';
import Calculator from './components/Calculator';
import PercentageCalculator from './components/PercentageCalculator';

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

          </div>


          {/* Right Side Logo */}
          <div className="header-logo"
          //  style={{marginLeft:-300}}
           >

            <img
              style={{maxWidth:150,marginLeft:-80, marginTop:-130}}
              src={logo}
              className="App-logo"
              alt="logo"
            />

            <a
              className="App-link"
               style={{maxWidth:150,marginLeft:-90,marginTop:-120}}
              href="https://www.wearandwonder.shop/payam-taherirostami.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Payam 
            </a>

          </div>

        </div>

      </div>


      {/* Bottom */}
      <div style={{ marginTop:"25px", padding:"15px" }}>
        <InkRatioCalculator />
      </div>

    </div>
  );
}

export default App;