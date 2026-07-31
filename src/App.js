import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import InkRatioCalculator from "./components/InkRatioCalculator";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
         Pearl Calculator
        </p>
        <a
          className="App-link"
          href="https://www.wearandwonder.shop/payam-taherirostami.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Payam Taherirostami
        </a>
      </header>
      <InkRatioCalculator />
    </div>
  );
}

export default App;
