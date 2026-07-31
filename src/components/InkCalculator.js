import React, { useState } from "react";
import "../App.css";

export default function InkCalculator() {
  const [screen, setScreen] = useState("110");
  const [quantity, setQuantity] = useState("");
  const [cc, setCc] = useState("No");
  const [percentage, setPercentage] = useState("100");
  const [result, setResult] = useState(0);

  const calculate = () => {
    const baseValue = screen === "110" ? 225 : 165;

    const qty = Number(quantity);
    const percent = Number(percentage) / 100;

    if (!qty || !percent) {
      setResult(0);
      return;
    }

    let value = baseValue * qty * percent;

    if (value < 2200) {
      value = 2200;
    }

    if (cc === "Yes") {
      value += 1000;
    }

    setResult(Math.round(value));
  };

  const reset = () => {
    setQuantity("");
    setPercentage("100");
    setScreen("110");
    setCc("No");
    setResult(0);
  };

  return (
    <div className="calculator-card">

      {/* <h2>Ink Volume Calculator</h2> */}

      <div className="field">
        {/* <label>Screen</label> */}
        <select 
          value={screen}
          onChange={(e)=>setScreen(e.target.value)}
        >
          <option value="110">110</option>
          <option value="160">160</option>
        </select>
      </div>


      <div className="field">
        {/* <label>Quantity</label> */}
        <input
          type="number"
          value={quantity}
          onChange={(e)=>setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
      </div>


      <div className="field">
        {/* <label>C/C</label> */}
        <select
          value={cc}
          onChange={(e)=>setCc(e.target.value)}
        >
          <option value="No">No Color Check</option>
          <option value="Yes">Color Check needed</option>
        </select>
      </div>


      <div className="field">
        {/* <label>Percentage Volume (%)</label> */}
        <input
          type="number"
          value={percentage}
          onChange={(e)=>setPercentage(e.target.value)}
          placeholder="Example: 50"
        />
      </div>


      <div className="buttons">
        <button onClick={calculate}>
          Calculate
        </button>

        <button className="reset" onClick={reset}>
          Reset
        </button>
      </div>


      <div className="result-box" style={{maxWidth:200, maxHeight:60, marginTop:10}}>
        {/* <span>Required Ink:</span> */}
        <strong>{result.toLocaleString()} g</strong>
      </div>

    </div>
  );
}