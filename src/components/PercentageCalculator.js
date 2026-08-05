import React, { useState, useEffect } from "react";
import "../App.css";

export default function PercentageCalculator() {
  const [number, setNumber] = useState("");
  const [percent, setPercent] = useState("");
  const [result, setResult] = useState("0");

  useEffect(() => {
    const n = parseFloat(number);
    const p = parseFloat(percent);

    if (isNaN(n) || isNaN(p)) {
      setResult("0");
    } else {
      setResult(((n * p) / 100).toFixed(2));
    }
  }, [number, percent]);

  return (
<div 
className="timerCard"
style={{
 
  // transform: "scale(0.63)",
  transformOrigin: "top left",
  marginTop: "0px",
  // marginLeft:-195
}}>
      <h4
        className="timer-title"
        style={{
          marginBottom: "10px",
          fontSize: "18px",
        }}
      >
        % Calculator
      </h4>

      <input
        type="number"
        placeholder="Number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "8px",
          borderRadius: "6px",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />

      <input
        type="number"
        placeholder="Percentage"
        value={percent}
        onChange={(e) => setPercent(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "12px",
          borderRadius: "6px",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />

      <div
        className="timer-display"
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "10px",
        }}
      >
        {result}
      </div>
    </div>
  );
}