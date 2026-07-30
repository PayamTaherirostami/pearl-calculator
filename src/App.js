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
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </a>
      </header>
      <InkRatioCalculator />
    </div>
  );
}

export default App;
