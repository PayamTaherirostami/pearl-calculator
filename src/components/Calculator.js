import React, { useState } from "react";
import "../App.css";

export default function Calculator() {

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");

  const append = (value) => {
    setExpression((prev) => prev + value);
  };

  const clear = () => {
    setExpression("");
    setResult("0");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };


  const calculate = () => {
    if (!expression.trim()) return;

    try {

      let exp = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      exp = exp.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

      const answer = Function(
        '"use strict"; return (' + exp + ')'
      )();

      setResult(answer.toString());

    } catch {
      setResult("Error");
    }
  };


  return (

    <div
      className="timerCard"
      style={{
        width: "600px",
        height: "310px",
        padding: "15px",
      }}
    >

      {/* Display */}
      <div
        className="timer-display"
        style={{
          width: "100%",
        }}
      >

        <input
          type="text"
          value={expression}
          placeholder="Type expression..."
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") calculate();
          }}
          style={{
            width: "100%",
            padding: 5,
            border: "none",
            outline: "none",
            background: "yellow",
            color: "#745a06",
            fontSize: "22px",
            textAlign: "left",
            borderRadius: 15,
            boxSizing: "border-box",
          }}
        />


        <div
          style={{
            marginTop: "5px",
            fontSize: "22px",
            fontWeight: "bold",
            textAlign: "left",
            background: "red",
            padding: 10,
            borderRadius: 15,
          }}
        >
          {result}
        </div>


      </div>


{/* Buttons */}
<div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    justifyContent: "center",
  }}
>

  {/* Number Pad */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 70px)",
      gap: "10px",
    }}
  >

    <button className="timer-btn" onClick={() => append("7")}>
      7
    </button>

    <button className="timer-btn" onClick={() => append("8")}>
      8
    </button>

    <button className="timer-btn" onClick={() => append("9")}>
      9
    </button>


    <button className="timer-btn" onClick={() => append("4")}>
      4
    </button>

    <button className="timer-btn" onClick={() => append("5")}>
      5
    </button>

    <button className="timer-btn" onClick={() => append("6")}>
      6
    </button>


    <button className="timer-btn" onClick={() => append("1")}>
      1
    </button>

    <button className="timer-btn" onClick={() => append("2")}>
      2
    </button>

    <button className="timer-btn" onClick={() => append("3")}>
      3
    </button>


    <button
      className="timer-btn2"
      style={{gridColumn:"span 2"}}
      onClick={() => append("0")}
    >
      0
    </button>

    <button className="timer-btn" onClick={() => append(".")}>
      .
    </button>

  </div>



  {/* Operations */}
  <div
    style={{
      display:"grid",
      gridTemplateColumns:"repeat(2,150px)",
      gap:"10px",
    }}
  >

    <button className="timer-btn2" onClick={clear}>
      C
    </button>

    <button className="timer-btn2" onClick={backspace}>
      ⌫
    </button>


    <button className="timer-btn2" onClick={() => append("%")}>
      %
    </button>

    <button className="timer-btn2" onClick={() => append("÷")}>
      ÷
    </button>


    <button className="timer-btn2" onClick={() => append("×")}>
      ×
    </button>

    <button className="timer-btn2" onClick={() => append("-")}>
      -
    </button>


    <button className="timer-btn2" onClick={() => append("+")}>
      +
    </button>


    <button
      className="timer-btn2"
      onClick={calculate}
      style={{
        background:"#16a34a",
      }}
    >
      =
    </button>

  </div>

</div>

    </div>

  );
}