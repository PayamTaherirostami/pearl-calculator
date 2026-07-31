import React, { useState, useEffect } from "react";
import "../App.css";
  const presets = {
    Drying: 300, // 5 min
    Mixing: 600, // 10 min
  };

export default function ProcessTimer() {

  const [mode, setMode] = useState("Drying");
  const [timeLeft, setTimeLeft] = useState(presets.Drying);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    setTimeLeft(presets[mode]);
    setRunning(false);
  }, [mode]);

  const reset = () => {
    setRunning(false);
    setTimeLeft(presets[mode]);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const progress =
    (timeLeft / presets[mode]) * 100;

  return (
    <div className="timerCard">

      {/* <h2>⚙️ Process Timer</h2> */}

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="timerSelect"
      >
        <option>Drying</option>
        <option>Mixing</option>
      </select>

      <div className="circle">
        <div className="circleInner">
          {minutes}:{seconds}
        </div>
      </div>

      <div className="progress">
        <div
          className="progressFill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="buttons">
        <button
          className="start"
          onClick={() => setRunning(true)}
          disabled={running || timeLeft === 0}
        >
          ▶ Start
        </button>

        <button
          className="stop"
          onClick={() => setRunning(false)}
        >
          ⏸ Stop
        </button>

        <button
          className="reset"
          onClick={reset}
        >
          ↺ Reset
        </button>
      </div>

    </div>
  );
}