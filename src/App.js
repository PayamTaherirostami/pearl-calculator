import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import InkRatioCalculator from "./components/InkRatioCalculator";
import ProcessTimer from './components/ProcessTimer';
import InkCalculator from './components/InkCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
       
        <img style={{maxWidth:150,marginTop:10}}src={logo} className="App-logo" alt="logo" />
        <p>
         Inkroom Calculator
        </p>
        <a
          className="App-link"
          href="https://www.wearandwonder.shop/payam-taherirostami.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Payam Taherirostami
        </a>
        <p></p>
        <InkCalculator />
         <ProcessTimer />
      </header>
      <InkRatioCalculator />
    </div>
  );
}

export default App;
