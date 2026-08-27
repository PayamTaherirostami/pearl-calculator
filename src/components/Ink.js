import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo.svg";
import { db } from "../firebase";
import "../App2.css";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

// =====================================================
// TONERS
// =====================================================

const TONERS = [
  {
    number: 4,
    name: "Blue Shade Red",
    image: "/images/4.PNG"
  },
  {
    number: 5,
    name: "Magenta",
    image: "/images/5.PNG"
  },
  {
    number: 6,
    name: "Maroon",
    image: "/images/6.PNG"
  },

  {
    number: 7,
    name: "Violet",
    image: "/images/7.PNG"
  },
    {
    number: 8,
    name: "Red Shade Blue",
    image: "/images/8.PNG"
  },
    {
    number: 9,
    name: "Green Shade Blue",
    image: "/images/9.PNG"
  },
  {
    number: 10,
    name: "Blue Shade Green",
    image: "/images/10.PNG"
  },
  {
    number: 12,
    name: "White",
    image: "/images/12.png"
  },
  {
    number: 13,
    name: "Iron Oxid Yellow",
    image: "/images/13.PNG"
  },

    {
    number: 18,
    name: "Black",
    image: "/images/18.PNG"
  },
  {
    number: 22,
    name: "Yellow Shade Green",
    image: "/images/22.PNG"
  },

  {
    number: 23,
    name: "Red Orange",
    image: "/images/23.PNG"
  },
  {
    number: 500,
    name: "PEARL WHITE",
    image: ""
  },
  {
    number: 501,
    name: "SUPER GOLD",
    image: ""
  },
  {
    number: 502,
    name: "MICRO BRONZ",
    image: ""
  },
  {
    number: 503,
    name: "CLEAR",
    image: ""
  }
];

// =====================================================
// CREATE TRIALS
// =====================================================

const createTrials = () =>
  Array.from(
    { length: 10 },
    () => ({
      amount: ""
    })
  );

// =====================================================
// CREATE TONER
// =====================================================

const createToner = () => ({
  tonerNumber: "",
  image: "",
  trials: createTrials()
});

// =====================================================
// TONER TOTAL
// =====================================================

const getTonerTotal = (toner) => {

  if (!toner || !toner.trials) {
    return 0;
  }

  return toner.trials.reduce(
    (total, trial) => {

      const value = parseFloat(trial.amount);

      if (isNaN(value)) {
        return total;
      }

      return total + value;

    },
    0
  );
};

// =====================================================
// ALL TONERS TOTAL
// =====================================================

const getAllTonerTotal = (toners) => {

  if (!Array.isArray(toners)) {
    return 0;
  }

  return toners.reduce(
    (total, toner) =>
      total + getTonerTotal(toner),
    0
  );
};

// =====================================================
// PERCENTAGE
// =====================================================

const getPercentage = (value, total) => {

  if (!total) {
    return "0.00";
  }

  return (
    (value / total) * 100
  ).toFixed(2);
};

// =====================================================
// COMPONENT
// =====================================================

function Ink() {

  const navigate = useNavigate();

  // ===================================================
  // BASIC INFORMATION
  // ===================================================

  const [inkNumber, setInkNumber] =
    useState("");

  const [bacNumber, setBacNumber] =
    useState("");

  const [airline, setAirline] =
    useState("");

  const [ts, setTs] =
    useState("");

  const [texture, setTexture] =
    useState("");

  const [cap, setCap] =
    useState("");

  const [material, setMaterial] =
    useState("");

  const [backing, setBacking] =
    useState("");

  // ===================================================
  // ORIGINAL MIX - ORIGINAL MIX
  // ===================================================

  const [beforeToners, setBeforeToners] =
    useState([]);

  const [beforeDeltaE, setBeforeDeltaE] =
    useState("");

  // ===================================================
  // DAY 2 - COLOR CHECK BEFORE FLIP
  // ===================================================

  const [day2DeltaE, setDay2DeltaE] =
    useState("");

  const [day2DeltaL, setDay2DeltaL] =
    useState("");

  const [day2DeltaA, setDay2DeltaA] =
    useState("");

  const [day2DeltaB, setDay2DeltaB] =
    useState("");

  // ===================================================
  // FLIP
  // ===================================================

  const [flipped, setFlipped] =
    useState(false);

  const [flipDeltaL, setFlipDeltaL] =
    useState("");

  const [flipDeltaA, setFlipDeltaA] =
    useState("");

  const [flipDeltaB, setFlipDeltaB] =
    useState("");

  // ===================================================
  // FLIP TONERS
  // ===================================================

  const [flipToners, setFlipToners] =
    useState([]);

  // ===================================================
  // AFTER FLIP
  // NO DE HERE
  // ===================================================

  const [afterDeltaL, setAfterDeltaL] =
    useState("");

  const [afterDeltaA, setAfterDeltaA] =
    useState("");

  const [afterDeltaB, setAfterDeltaB] =
    useState("");

  // ===================================================
  // STORAGE COUNT
  // ===================================================

  const [totalInks, setTotalInks] =
    useState(0);

  // ===================================================
  // FIRESTORE DOCUMENT
  // ===================================================

  const [currentDocumentId, setCurrentDocumentId] =
    useState(null);

  // ===================================================
  // SEARCH
  // ===================================================

  const [searchInk, setSearchInk] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [searching, setSearching] =
    useState(false);

  // ===================================================
  // STATUS
  // ===================================================

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // ===================================================
  // REMAKE
  // ===================================================

  const [remakeWeights, setRemakeWeights] =
    useState({});

  // ===================================================
  // COUNT STORAGE
  // ===================================================

  useEffect(() => {

    countStorageInks();

  }, []);

  // ===================================================
  // COUNT INKS
  // ===================================================

  const countStorageInks = async () => {

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "inkRecords"
          )
        );

      setTotalInks(
        snapshot.size
      );

      console.log(
        "📦 TOTAL INKS IN STORAGE:",
        snapshot.size
      );

    } catch (error) {

      console.error(
        "🔴 COUNT ERROR:",
        error
      );

    }
  };

  // ===================================================
  // ADD BEFORE TONER
  // ===================================================

  const addBeforeToner = () => {

    if (currentDocumentId) {
      return;
    }

    if (beforeToners.length >= 6) {

      alert(
        "Maximum 6 toners allowed."
      );

      return;
    }

    setBeforeToners([
      ...beforeToners,
      createToner()
    ]);
  };

  // ===================================================
  // REMOVE BEFORE TONER
  // ===================================================

  const removeBeforeToner = (index) => {

    if (currentDocumentId) {
      return;
    }

    const newToners =
      [...beforeToners];

    newToners.splice(
      index,
      1
    );

    setBeforeToners(
      newToners
    );
  };

  // ===================================================
  // SELECT BEFORE TONER
  // ===================================================

  const selectBeforeToner = (
    index,
    value
  ) => {

    if (currentDocumentId) {
      return;
    }

    const selected =
      TONERS.find(
        toner =>
          String(toner.number) ===
          String(value)
      );

    const newToners =
      [...beforeToners];

    newToners[index] = {

      ...newToners[index],

      tonerNumber:
        value,

      image:
        selected
          ? selected.image
          : ""

    };

    setBeforeToners(
      newToners
    );
  };

  // ===================================================
  // CHANGE BEFORE TRIAL
  // ===================================================

  const changeBeforeTrial = (
    tonerIndex,
    trialIndex,
    value
  ) => {

    if (currentDocumentId) {
      return;
    }

    const newToners =
      [...beforeToners];

    newToners[
      tonerIndex
    ].trials[
      trialIndex
    ].amount = value;

    setBeforeToners(
      newToners
    );
  };

  // ===================================================
  // CREATE FLIP TONERS FROM ORIGINAL MIX
  // ===================================================

  const createFlipTonersFromBefore =
    () => {

      return beforeToners.map(
        toner => ({

          tonerNumber:
            toner.tonerNumber,

          image:
            toner.image,

          trials:
            createTrials()

        })
      );
    };

  // ===================================================
  // FLIP
  // USE DAY 2 DL / DA / DB
  // ===================================================

  const handleFlip = () => {

    if (!currentDocumentId) {

      alert(
        "Please search and load an existing ink first."
      );

      return;
    }

    console.log(
      "================================="
    );

    console.log(
      "🔄 FLIP BUTTON CLICKED"
    );

    const L =
      parseFloat(
        day2DeltaL
      ) || 0;

    const A =
      parseFloat(
        day2DeltaA
      ) || 0;

    const B =
      parseFloat(
        day2DeltaB
      ) || 0;

    // Reverse Day 2 values

    const targetL =
      -L;

    const targetA =
      -A;

    const targetB =
      -B;

    setFlipDeltaL(
      String(targetL)
    );

    setFlipDeltaA(
      String(targetA)
    );

    setFlipDeltaB(
      String(targetB)
    );

    // Keep ORIGINAL MIX unchanged

    if (!flipped) {

      setFlipToners(
        createFlipTonersFromBefore()
      );

      setFlipped(true);
    }
  };

  // ===================================================
  // ADD FLIP TONER
  // ===================================================

  const addFlipToner = () => {

    if (flipToners.length >= 6) {

      alert(
        "Maximum 6 toners allowed."
      );

      return;
    }

    setFlipToners([
      ...flipToners,
      createToner()
    ]);
  };

  // ===================================================
  // REMOVE FLIP TONER
  // ===================================================

  const removeFlipToner = (index) => {

    const newToners =
      [...flipToners];

    newToners.splice(
      index,
      1
    );

    setFlipToners(
      newToners
    );
  };

  // ===================================================
  // SELECT FLIP TONER
  // ===================================================

  const selectFlipToner = (
    index,
    value
  ) => {

    const selected =
      TONERS.find(
        toner =>
          String(toner.number) ===
          String(value)
      );

    const newToners =
      [...flipToners];

    newToners[index] = {

      ...newToners[index],

      tonerNumber:
        value,

      image:
        selected
          ? selected.image
          : ""

    };

    setFlipToners(
      newToners
    );
  };

  // ===================================================
  // CHANGE FLIP TRIAL
  // ===================================================

  const changeFlipTrial = (
    tonerIndex,
    trialIndex,
    value
  ) => {

    const newToners =
      [...flipToners];

    newToners[
      tonerIndex
    ].trials[
      trialIndex
    ].amount = value;

    setFlipToners(
      newToners
    );
  };

  // ===================================================
  // FINAL TOTAL
  // ===================================================

  const getAfterTotal = () => {

    return (
      getAllTonerTotal(
        beforeToners
      ) +
      getAllTonerTotal(
        flipToners
      )
    );
  };

  // ===================================================
  // SAVE ORIGINAL MIX
  // ===================================================

  const saveBeforeFlip = async () => {

    console.log(
      "================================="
    );

    console.log(
      "💾 SAVE ORIGINAL MIX"
    );

    if (!inkNumber.trim()) {

      alert(
        "Please enter Ink #."
      );

      return;
    }

    setSaving(true);

    setMessage(
      "Saving ORIGINAL MIX information..."
    );

    const beforeTotal =
      getAllTonerTotal(
        beforeToners
      );

    const data = {

      // =========================================
      // BASIC INFORMATION
      // =========================================

      inkNumber:
        inkNumber.trim(),

      bacNumber:
        bacNumber.trim(),

      airline:
        airline.trim(),

      ts:
        ts.trim(),

      texture:
        texture.trim(),

      cap:
        cap.trim(),

      material:
        material.trim(),

      backing:
        backing.trim(),

      status:
        "before_flip",

      // =========================================
      // ORIGINAL MIX
      // ONLY ORIGINAL DE
      // =========================================

      beforeFlip: {

        toners:
          beforeToners,

        deltaE:
          beforeDeltaE,

        totalInk:
          beforeTotal

      },

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp()

    };



    try {

      const docRef =
        await addDoc(
          collection(
            db,
            "inkRecords"
          ),
          data
        );

      console.log(
        "🟢 ORIGINAL MIX SAVED"
      );

      console.log(
        "Document ID:",
        docRef.id
      );

      setMessage(
        `Ink #${inkNumber} saved successfully.`
      );

      // Count again

      await countStorageInks();

      // Clear form

      clearInkForm();

    } catch (error) {

      console.error(
        "🔴 ORIGINAL MIX SAVE ERROR:",
        error
      );

      setMessage(
        "Error: " +
        error.message
      );

    } finally {

      setSaving(false);
    }
  };

  // ===================================================
  // LOAD RECORD
  // ===================================================

  const loadRecord = (record) => {

    console.log(
      "📂 LOADING RECORD:",
      record
    );

    setRemakeWeights({
      [record.id]:
        ""
    });

    setCurrentDocumentId(
      record.id
    );

    // =========================================
    // BASIC INFORMATION
    // LOCKED AFTER LOADING
    // =========================================

    setInkNumber(
      record.inkNumber || ""
    );

    setBacNumber(
      record.bacNumber || ""
    );

    setAirline(
      record.airline || ""
    );

    setTs(
      record.ts || ""
    );

    setTexture(
      record.texture || ""
    );

    setCap(
      record.cap || ""
    );

    setMaterial(
      record.material || ""
    );

    setBacking(
      record.backing || ""
    );

    // =========================================
    // ORIGINAL MIX TONERS
    // =========================================

    setBeforeToners(
      record.beforeFlip?.toners || []
    );

    // =========================================
    // ORIGINAL MIX ORIGINAL DE
    // =========================================

    setBeforeDeltaE(
      record.beforeFlip?.deltaE || ""
    );

    // =========================================
    // DAY 2 VALUES
    // =========================================

    setDay2DeltaE(
      record.beforeFlip?.day2DeltaE || ""
    );

    setDay2DeltaL(
      record.beforeFlip?.day2DeltaL || ""
    );

    setDay2DeltaA(
      record.beforeFlip?.day2DeltaA || ""
    );

    setDay2DeltaB(
      record.beforeFlip?.day2DeltaB || ""
    );

    // =========================================
    // EXISTING FLIP
    // =========================================

    if (record.flip) {

      setFlipped(true);

      setFlipDeltaL(
        record.flip.targetDeltaL || ""
      );

      setFlipDeltaA(
        record.flip.targetDeltaA || ""
      );

      setFlipDeltaB(
        record.flip.targetDeltaB || ""
      );

      setFlipToners(
        record.flip.toners || []
      );

    } else {

      setFlipped(false);

      setFlipToners([]);

      setFlipDeltaL("");

      setFlipDeltaA("");

      setFlipDeltaB("");
    }

    // =========================================
    // AFTER FLIP
    // NO DE
    // =========================================

    if (record.afterFlip) {

      setAfterDeltaL(
        record.afterFlip.deltaL || ""
      );

      setAfterDeltaA(
        record.afterFlip.deltaA || ""
      );

      setAfterDeltaB(
        record.afterFlip.deltaB || ""
      );

    } else {

      setAfterDeltaL("");

      setAfterDeltaA("");

      setAfterDeltaB("");
    }

    setMessage(
      `Ink #${record.inkNumber} loaded. ORIGINAL MIX information is locked.`
    );

    setTimeout(() => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }, 100);
  };

  // ===================================================
  // CLEAR FORM
  // ===================================================

  const clearInkForm = () => {

    console.log(
      "🧹 CLEARING INK FORM"
    );

    // Basic

    setInkNumber("");
    setBacNumber("");
    setAirline("");
    setTs("");
    setTexture("");
    setCap("");
    setMaterial("");
    setBacking("");

    // ORIGINAL MIX

    setBeforeToners([]);

    setBeforeDeltaE("");

    // Day 2

    setDay2DeltaE("");
    setDay2DeltaL("");
    setDay2DeltaA("");
    setDay2DeltaB("");

    // Flip

    setFlipped(false);

    setFlipToners([]);

    setFlipDeltaL("");
    setFlipDeltaA("");
    setFlipDeltaB("");

    // After Flip

    setAfterDeltaL("");
    setAfterDeltaA("");
    setAfterDeltaB("");

    // Search

    setSearchInk("");
    setSearchResults([]);

    // Document

    setCurrentDocumentId(null);


  };

  // ===================================================
  // RESET TO ORIGINAL MIX
  // ===================================================

  const resetToDayOne = () => {



    clearInkForm();

    setMessage(
      "Ready for a new ink. ORINGINAL MIX."
    );


  };

  // ===================================================
  // SEARCH INK
  // ===================================================

  const searchForInk = async () => {

    const searchValue =
      searchInk.trim().toLowerCase();

    if (!searchValue) {

      setSearchResults([]);

      return;
    }

    console.log(
      "================================="
    );

    console.log(
      "🔎 SEARCHING FOR:",
      searchValue
    );

    setSearching(true);

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "inkRecords"
          )
        );

      const results = [];

      snapshot.forEach(
        (document) => {

          const data =
            document.data();

          const inkNumber =
            String(
              data.inkNumber || ""
            ).toLowerCase();

          if (
            inkNumber.includes(
              searchValue
            )
          ) {

            results.push({

              id:
                document.id,

              ...data

            });
          }
        }
      );

      setSearchResults(
        results
      );

      if (
        results.length === 0
      ) {

        setMessage(
          `No ink found containing "${searchInk.trim()}".`
        );

      } else {

        setMessage(
          `${results.length} ink(s) found.`
        );
      }

    } catch (error) {

      console.error(
        "🔴 SEARCH ERROR:",
        error
      );

      setMessage(
        "Search error: " +
        error.message
      );

    } finally {

      setSearching(false);
    }
  };

  // ===================================================
  // SAVE AFTER FLIP
  // ===================================================

  const saveAfterFlip = async () => {

    console.log(
      "================================="
    );

    console.log(
      "💾 SAVE AFTER FLIP"
    );

    if (!currentDocumentId) {

      alert(
        "Please search and load an existing ink first."
      );

      return;
    }

    setSaving(true);

    setMessage(
      "Saving after-flip information..."
    );

    const beforeTotal =
      getAllTonerTotal(
        beforeToners
      );

    const flipTotal =
      getAllTonerTotal(
        flipToners
      );

    const afterTotal =
      beforeTotal +
      flipTotal;

    // =========================================
    // TONER SUMMARY
    // =========================================

    const tonerNumbers =
      Array.from(
        new Set([

          ...beforeToners.map(
            toner =>
              toner.tonerNumber
          ),

          ...flipToners.map(
            toner =>
              toner.tonerNumber
          )

        ])
      ).filter(Boolean);

    const afterTonerSummary =
      tonerNumbers.map(
        tonerNumber => {

          const before =
            beforeToners.find(
              toner =>
                String(
                  toner.tonerNumber
                ) ===
                String(
                  tonerNumber
                )
            );

          const flip =
            flipToners.find(
              toner =>
                String(
                  toner.tonerNumber
                ) ===
                String(
                  tonerNumber
                )
            );

          const beforeAmount =
            getTonerTotal(
              before
            );

          const addedAmount =
            getTonerTotal(
              flip
            );

          const afterAmount =
            beforeAmount +
            addedAmount;

          return {

            tonerNumber,

            before:
              beforeAmount,

            added:
              addedAmount,

            after:
              afterAmount,

            percentage:
              parseFloat(
                getPercentage(
                  afterAmount,
                  afterTotal
                )
              )

          };
        }
      );

    // =========================================
    // UPDATE DATA
    // =========================================

    const updateData = {

      status:
        "after_flip",

      // =========================================
      // ORIGINAL MIX + DAY 2 COLOR CHECK
      // =========================================

      beforeFlip: {

        toners:
          beforeToners,

        // Original ORIGINAL MIX DE
        deltaE:
          beforeDeltaE,

        // New Day 2 values
        day2DeltaE:
          day2DeltaE,

        day2DeltaL:
          day2DeltaL,

        day2DeltaA:
          day2DeltaA,

        day2DeltaB:
          day2DeltaB,

        totalInk:
          beforeTotal

      },

      // =========================================
      // FLIP
      // =========================================

      flip: {

        flippedAt:
          serverTimestamp(),

        targetDeltaL:
          flipDeltaL,

        targetDeltaA:
          flipDeltaA,

        targetDeltaB:
          flipDeltaB,

        toners:
          flipToners,

        totalAdded:
          flipTotal

      },

      // =========================================
      // AFTER FLIP
      // NO DE
      // =========================================

      afterFlip: {

        deltaL:
          afterDeltaL,

        deltaA:
          afterDeltaA,

        deltaB:
          afterDeltaB,

        toners:
          afterTonerSummary,

        totalInk:
          afterTotal

      },

      updatedAt:
        serverTimestamp()

    };

    console.log(
      "UPDATE DATA:",
      updateData
    );

    try {

      await updateDoc(
        doc(
          db,
          "inkRecords",
          currentDocumentId
        ),
        updateData
      );

      console.log(
        "🟢 AFTER FLIP SAVED"
      );

      await countStorageInks();

      resetToDayOne();

      setMessage(
        "After-flip information saved successfully. Ready for ORIGINAL MIX."
      );

    } catch (error) {

      console.error(
        "🔴 AFTER FLIP SAVE ERROR:",
        error
      );

      setMessage(
        "Error: " +
        error.message
      );

    } finally {

      setSaving(false);
    }
  };

  // ===================================================
  // REMAKE CALCULATOR
  // ===================================================

  const calculateRemake = (
    record,
    targetWeight
  ) => {

    const target =
      parseFloat(
        targetWeight
      );

    if (
      !target ||
      target <= 0
    ) {
      return [];
    }

    // =========================================
    // USE FINAL AFTER-FLIP SUMMARY
    // =========================================

    if (
      record.afterFlip &&
      record.afterFlip.toners &&
      record.afterFlip.toners.length > 0
    ) {

      return record.afterFlip.toners.map(
        (toner) => {

          const percentage =
            parseFloat(
              toner.percentage
            ) || 0;

          const remakeAmount =
            target *
            (
              percentage /
              100
            );

          return {

            tonerNumber:
              toner.tonerNumber,

            percentage:
              percentage,

            amount:
              remakeAmount

          };
        }
      );
    }

    // =========================================
    // OTHERWISE ORIGINAL MIX
    // =========================================

    const toners =
      record.beforeFlip?.toners ||
      [];

    const total =
      parseFloat(
        record.beforeFlip?.totalInk
      ) || 0;

    if (!total) {
      return [];
    }

    return toners.map(
      (toner) => {

        const tonerAmount =
          getTonerTotal(
            toner
          );

        const percentage =
          (
            tonerAmount /
            total
          ) *
          100;

        const remakeAmount =
          target *
          (
            percentage /
            100
          );

        return {

          tonerNumber:
            toner.tonerNumber,

          percentage:
            percentage,

          amount:
            remakeAmount

        };
      }
    );
  };

  // ===================================================
  // STYLES
  // ===================================================

  const pageStyle = {

    minHeight:
      "100vh",

    padding:
      "20px",

    background:
      "linear-gradient(135deg,#111827,#1e293b)",

    color:
      "white"

  };

  const cardStyle = {

    background:
      "rgba(255,255,255,0.08)",

    border:
      "1px solid rgba(255,255,255,0.15)",

    borderRadius:
      "12px",

    padding:
      "18px",

    marginBottom:
      "18px"

  };

  const inputStyle = {

    width:
      "150px",

    height:
      "32px",

    padding:
      "5px 8px",

    fontSize:
      "13px",

    borderRadius:
      "6px",

    border:
      "1px solid #64748b",

    background:
      "#1e293b",

    color:
      "white",

    boxSizing:
      "border-box"

  };

  const smallInputStyle = {

    width:
      "150px",

    height:
      "30px",

    padding:
      "4px",

    fontSize:
      "12px",

    borderRadius:
      "5px",

    border:
      "1px solid #64748b",

    background:
      "#1e293b",

    color:
      "white",

    boxSizing:
      "border-box",

    marginRight:
      "30px"

  };

  const buttonStyle = {

    padding:
      "7px 12px",

    fontSize:
      "12px",

    borderRadius:
      "6px",

    border:
      "none",

    cursor:
      "pointer"

  };

  const labelStyle = {

    display:
      "block",

    fontSize:
      "12px",

    marginBottom:
      "4px",

    fontWeight:
      "600"

  };

  const gridStyle = {

    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(150px,1fr))",

    gap:
      "12px"

  };

  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div style={pageStyle}>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            "15px",

          marginBottom:
            "20px",

          flexWrap:
            "wrap"
        }}
      >

        <button
          id="button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back
        </button>

        <img
          src={logo}
          className="App-logo"
          alt="Payam"
          style={{
            width:
              "50px"
          }}
        />

        <h1
          style={{
            fontSize:
              "24px",

            marginLeft:-380
          }}
        >
          Ink Color Development - 
          <strong style={{marginLeft:10}}>
             {totalInks} inks in database
          </strong>
        </h1>

        {/* SEARCH */}

        <div
          style={{
            display:
              "flex",

            gap:
              "5px"
          }}
        >

          <input
            value={
              searchInk
            }
            onChange={(e) =>
              setSearchInk(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key ===
                "Enter"
              ) {

                searchForInk();
              }

            }}
            placeholder="Search Ink #"
            style={{
              ...inputStyle,
              width:
                "130px"
            }}
          />

          <button
            id="button"
            onClick={
              searchForInk
            }
          >
            {searching
              ? "Searching..."
              : "SEARCH"}
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* MESSAGE */}
      {/* ================================================= */}

      {message && (

        <div
          style={{
            padding:
              "10px",

            marginBottom:
              "15px",

            background:
              "rgba(255,255,255,0.08)",

            borderRadius:
              "6px",

            fontSize:
              "13px"
          }}
        >
          {message}
        </div>

      )}

      {/* ================================================= */}
      {/* SEARCH RESULTS */}
      {/* ================================================= */}

      {searchResults.length > 0 && (

        <div style={cardStyle}>

          <h2
            style={{
              marginTop:
                "0",

              fontSize:
                "19px"
            }}
          >
            Search Results
          </h2>

          {searchResults.map(
            record => {

              const beforeTotal =
                record.beforeFlip?.totalInk ||
                0;

              const flipTotal =
                record.flip?.totalAdded ||
                0;

              const afterTotal =
                record.afterFlip?.totalInk ||
                (
                  beforeTotal +
                  flipTotal
                );

              return (

                <div
                  key={record.id}
                  style={{
                    padding:
                      "15px",

                    marginBottom:
                      "12px",

                    background:
                      "rgba(0,0,0,0.22)",

                    borderRadius:
                      "10px"
                  }}
                >

                  {/* HEADER */}

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      flexWrap:
                        "wrap",

                      gap:
                        "10px"
                    }}
                  >

                    <div>

                      <strong
                        style={{
                          fontSize:
                            "18px"
                        }}
                      >
                        Ink #{record.inkNumber}
                      </strong>

                      <div
                        style={{
                          fontSize:
                            "12px",

                          opacity:
                            "0.75",

                          marginTop:
                            "4px"
                        }}
                      >
                        BAC:
                        {" "}
                        {record.bacNumber}

                        {" | "}

                        Airline:
                        {" "}
                        {record.airline}

                        {" | "}

                        Texture:
                        {" "}
                        {record.texture}
                      </div>

                    </div>

                    <span
                      style={{
                        padding:
                          "5px 10px",

                        borderRadius:
                          "20px",

                        fontSize:
                          "11px",

                        background:
                          record.status ===
                          "after_flip"
                            ? "#166534"
                            : "#92400e"
                      }}
                    >

                      {record.status ===
                      "after_flip"
                        ? "✓ AFTER FLIP"
                        : "● BEFORE FLIP"}

                    </span>

                  </div>

                  {/* ================================================= */}
                  {/* ORIGINAL MIX SUMMARY */}
                  {/* ================================================= */}

                  <div
                    style={{
                      marginTop:
                        "15px",

                      padding:
                        "12px",

                      borderRadius:
                        "8px",

                      background:
                        "rgba(59,130,246,0.12)"
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          "0 0 8px",

                        fontSize:
                          "15px"
                      }}
                    >
                       ORIGINAL MIX
                    </h3>

                    <div
                      style={{
                        fontSize:
                          "12px"
                      }}
                    >

                      Original ΔE:
                      {" "}
                      {record.beforeFlip?.deltaE || "-"}

                      <br />

                      Total:
                      {" "}
                      {beforeTotal}
                      {" "}g

                    </div>

                    {(record.beforeFlip?.toners || [])
                      .map(
                        (toner, index) => {

                          const total =
                            getTonerTotal(
                              toner
                            );

                          return (

                            <div
                              key={index}
                              style={{
                                marginTop:
                                  "6px",

                                fontSize:
                                  "12px"
                              }}
                            >

                              Toner #
                              {toner.tonerNumber}

                              {" — "}

                              {total} g

                              {" — "}

                              {getPercentage(
                                total,
                                beforeTotal
                              )}%

                            </div>

                          );
                        }
                      )}

                  </div>

                  {/* ================================================= */}
                  {/* DAY 2 SUMMARY */}
                  {/* ================================================= */}

                  {(record.beforeFlip?.day2DeltaE ||
                    record.beforeFlip?.day2DeltaL ||
                    record.beforeFlip?.day2DeltaA ||
                    record.beforeFlip?.day2DeltaB) && (

                    <div
                      style={{
                        marginTop:
                          "12px",

                        padding:
                          "12px",

                        borderRadius:
                          "8px",

                        background:
                          "rgba(168,85,247,0.12)"
                      }}
                    >

                      <h3
                        style={{
                          margin:
                            "0 0 8px",

                          fontSize:
                            "15px"
                        }}
                      >
                         COLOR CHECK/ FLIPING
                      </h3>

                      <div
                        style={{
                          fontSize:
                            "12px"
                        }}
                      >

                        DE:
                        {" "}
                        {record.beforeFlip?.day2DeltaE || "-"}

                        {" | "}

                        DL:
                        {" "}
                        {record.beforeFlip?.day2DeltaL || "-"}

                        {" | "}

                        DA:
                        {" "}
                        {record.beforeFlip?.day2DeltaA || "-"}

                        {" | "}

                        DB:
                        {" "}
                        {record.beforeFlip?.day2DeltaB || "-"}

                      </div>

                    </div>

                  )}

                  {/* ================================================= */}
                  {/* FLIP SUMMARY */}
                  {/* ================================================= */}

                  {record.flip && (

                    <div
                      style={{
                        marginTop:
                          "12px",

                        padding:
                          "12px",

                        borderRadius:
                          "8px",

                        background:
                          "rgba(245,158,11,0.12)"
                      }}
                    >

                      <h3
                        style={{
                          margin:
                            "0 0 8px",

                          fontSize:
                            "15px"
                        }}
                      >
                        FLIP
                      </h3>

                      <div
                        style={{
                          fontSize:
                            "12px"
                        }}
                      >

                        Target DL:
                        {" "}
                        {record.flip.targetDeltaL}

                        {" | "}

                        Target DA:
                        {" "}
                        {record.flip.targetDeltaA}

                        {" | "}

                        Target DB:
                        {" "}
                        {record.flip.targetDeltaB}

                        <br />

                        Added:
                        {" "}
                        {flipTotal} g

                      </div>

                      {(record.flip.toners || [])
                        .map(
                          (toner, index) => {

                            const total =
                              getTonerTotal(
                                toner
                              );

                            return (

                              <div
                                key={index}
                                style={{
                                  marginTop:
                                    "6px",

                                  fontSize:
                                    "12px"
                                }}
                              >

                                Toner #
                                {toner.tonerNumber}

                                {" — +"}

                                {total} g

                                {" — "}

                                {getPercentage(
                                  total,
                                  flipTotal
                                )}%

                              </div>

                            );
                          }
                        )}

                    </div>

                  )}

                  {/* ================================================= */}
                  {/* AFTER FLIP */}
                  {/* ================================================= */}

                  {record.afterFlip && (

                    <div
                      style={{
                        marginTop:
                          "12px",

                        padding:
                          "12px",

                        borderRadius:
                          "8px",

                        background:
                          "rgba(34,197,94,0.12)"
                      }}
                    >

                      <h3
                        style={{
                          margin:
                            "0 0 8px",

                          fontSize:
                            "15px"
                        }}
                      >
                        AFTER FLIP
                      </h3>

                      <div
                        style={{
                          fontSize:
                            "12px"
                        }}
                      >

                        DL:
                        {" "}
                        {record.afterFlip.deltaL || "-"}

                        {" | "}

                        DA:
                        {" "}
                        {record.afterFlip.deltaA || "-"}

                        {" | "}

                        DB:
                        {" "}
                        {record.afterFlip.deltaB || "-"}

                        <br />

                        Final Total:
                        {" "}
                        {afterTotal} g

                      </div>

                      {(record.afterFlip.toners || [])
                        .map(
                          (toner, index) => (

                            <div
                              key={index}
                              style={{
                                marginTop:
                                  "7px",

                                fontSize:
                                  "12px"
                              }}
                            >

                              <strong>
                                Toner #
                                {toner.tonerNumber}
                              </strong>

                              {" — "}

                              Before:
                              {" "}
                              {toner.before}g

                              {" | "}

                              Added:
                              {" "}
                              +{toner.added}g

                              {" | "}

                              After:
                              {" "}
                              {toner.after}g

                              {" | "}

                              {toner.percentage}%

                            </div>

                          )
                        )}

                    </div>

                  )}

                  {/* ================================================= */}
                  {/* ACTION BUTTONS */}
                  {/* ================================================= */}

                  <div
                    style={{
                      marginTop:
                        "15px",

                      display:
                        "flex",

                      gap:
                        "8px",

                      flexWrap:
                        "wrap"
                    }}
                  >

                    {!record.flip && (

                      <button
                        id="button"
                        onClick={() =>
                          loadRecord(
                            record
                          )
                        }
                        style={{
                          ...buttonStyle,

                          background:
                            "#f59e0b",

                          color:
                            "black",

                          fontWeight:
                            "bold"
                        }}
                      >
                        START FLIPING
                      </button>

                    )}

                    {record.flip &&
                      !record.afterFlip && (

                        <button
                          id="button"
                          onClick={() =>
                            loadRecord(
                              record
                            )
                          }
                          style={{
                            ...buttonStyle,

                            background:
                              "#22c55e",

                            color:
                              "black",

                            fontWeight:
                              "bold"
                          }}
                        >
                          CONTINUE FLIP
                        </button>

                      )}

                    {record.afterFlip && (

                      <button
                        id="button"
                        onClick={() =>
                          loadRecord(
                            record
                          )
                        }
                        style={
                          buttonStyle
                        }
                      >
                        OPEN RECORD
                      </button>

                    )}

                  </div>

                  {/* ================================================= */}
                  {/* REMAKE CALCULATOR */}
                  {/* ================================================= */}

                  <div
                    style={{
                      marginTop:
                        "15px",

                      padding:
                        "15px",

                      borderRadius:
                        "8px",

                      background:
                        "rgba(168,85,247,0.12)",

                      border:
                        "1px solid rgba(168,85,247,0.25)"
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          "0 0 12px",

                        fontSize:
                          "15px"
                      }}
                    >
                      Remake This Ink
                    </h3>

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "10px",

                        flexWrap:
                          "wrap"
                      }}
                    >

                      <label
                        style={{
                          fontSize:
                            "12px",

                          fontWeight:
                            "600"
                        }}
                      >
                        Target Weight (g)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Enter weight"
                        value={
                          remakeWeights[
                            record.id
                          ] || ""
                        }
                        onChange={(e) => {

                          setRemakeWeights({
                            ...remakeWeights,

                            [record.id]:
                              e.target.value
                          });

                        }}
                        style={{
                          width:
                            "120px",

                          height:
                            "32px",

                          padding:
                            "5px 8px",

                          fontSize:
                            "13px",

                          borderRadius:
                            "6px",

                          border:
                            "1px solid #64748b",

                          background:
                            "#1e293b",

                          color:
                            "white",

                          boxSizing:
                            "border-box"
                        }}
                      />

                    </div>

                    {remakeWeights[record.id] &&
                      calculateRemake(
                        record,
                        remakeWeights[
                          record.id
                        ]
                      ).length > 0 && (

                        <div
                          style={{
                            marginTop:
                              "15px"
                          }}
                        >

                          <div
                            style={{
                              display:
                                "grid",

                              gridTemplateColumns:
                                "repeat(auto-fit,minmax(150px,1fr))",

                              gap:
                                "8px"
                            }}
                          >

                            {calculateRemake(
                              record,
                              remakeWeights[
                                record.id
                              ]
                            ).map(
                              (
                                toner,
                                index
                              ) => (

                                <div
                                  key={index}
                                  style={{
                                    padding:
                                      "10px",

                                    background:
                                      "rgba(0,0,0,0.20)",

                                    borderRadius:
                                      "7px"
                                  }}
                                >

                                  <div
                                    style={{
                                      fontSize:
                                        "12px",

                                      opacity:
                                        "0.75"
                                    }}
                                  >
                                    Toner #
                                    {toner.tonerNumber}
                                  </div>

                                  <div
                                    style={{
                                      fontSize:
                                        "18px",

                                      fontWeight:
                                        "bold",

                                      marginTop:
                                        "4px"
                                    }}
                                  >
                                    {toner.amount.toFixed(2)}
                                    {" "}g
                                  </div>

                                  <div
                                    style={{
                                      fontSize:
                                        "11px",

                                      opacity:
                                        "0.7",

                                      marginTop:
                                        "3px"
                                    }}
                                  >
                                    {toner.percentage.toFixed(2)}
                                    %
                                  </div>

                                </div>

                              )
                            )}

                          </div>

                          <div
                            style={{
                              marginTop:
                                "12px",

                              fontSize:
                                "13px",

                              fontWeight:
                                "bold"
                            }}
                          >

                            Target Total:
                            {" "}

                            {parseFloat(
                              remakeWeights[
                                record.id
                              ]
                            ).toFixed(2)}

                            {" "}g

                          </div>

                        </div>

                      )}

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

      {/* ================================================= */}
      {/* BASIC INFORMATION */}
      {/* ================================================= */}

      <div style={cardStyle}>

        <h2
          style={{
            marginTop:
              "0",

            fontSize:
              "18px"
          }}
        >
          Ink Information
        </h2>

        {currentDocumentId && (

          <div
            style={{
              marginBottom:
                "15px",

              padding:
                "8px 12px",

              background:
                "rgba(245,158,11,0.15)",

              border:
                "1px solid rgba(245,158,11,0.35)",

              borderRadius:
                "6px",

              fontSize:
                "12px"
            }}
          >
            🔒 ORIGINAL MIX information is locked.
            You are working on the color check.
          </div>

        )}

        <div style={gridStyle}>

          {[
            [
              "Ink #",
              inkNumber,
              setInkNumber
            ],

            [
              "BAC #",
              bacNumber,
              setBacNumber
            ],

            [
              "Airline",
              airline,
              setAirline
            ],

            [
              "T/S",
              ts,
              setTs
            ],

            [
              "Texture",
              texture,
              setTexture
            ],

            [
              "CAP",
              cap,
              setCap
            ],

            [
              "Material",
              material,
              setMaterial
            ],

            [
              "Backing",
              backing,
              setBacking
            ]

          ].map(
            ([label, value, setter]) => (

              <div key={label}>

                <label style={labelStyle}>
                  {label}
                </label>

                <input
                  value={
                    value
                  }
                  onChange={(e) =>
                    setter(
                      e.target.value
                    )
                  }
                  readOnly={
                    !!currentDocumentId
                  }
                  style={{
                    ...inputStyle,

                    opacity:
                      currentDocumentId
                        ? 0.65
                        : 1
                  }}
                />

              </div>

            )
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* BEFORE TONERS - ORIGINAL MIX */}
      {/* ================================================= */}

      <div style={cardStyle}>

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center"
          }}
        >

          <h2
            style={{
              fontSize:
                "18px",

              margin:
                "0"
            }}
          >
            Before Flip — Toners
          </h2>

          {!currentDocumentId && (

            <button
              id="button"
              onClick={
                addBeforeToner
              }
            >
              + Add Toner
            </button>

          )}

        </div>

        {currentDocumentId && (

          <p
            style={{
              fontSize:
                "11px",

              opacity:
                "0.7"
            }}
          >
            🔒 Original ORIGINAL MIX toners are locked.
          </p>

        )}

        {beforeToners.map(
          (toner, tonerIndex) => {

            const total =
              getTonerTotal(
                toner
              );

            const grandTotal =
              getAllTonerTotal(
                beforeToners
              );

            return (

              <div
                key={tonerIndex}
                style={{
                  marginTop:
                    "15px",

                  padding:
                    "12px",

                  background:
                    "rgba(0,0,0,0.18)",

                  borderRadius:
                    "8px"
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "8px",

                    flexWrap:
                      "wrap"
                  }}
                >

                  {toner.image && (

                    <img
                      src={
                        toner.image
                      }
                      alt="Toner"
                      style={{
                        width:
                          "40px",

                        height:
                          "40px",

                        borderRadius:
                          "5px"
                      }}
                    />

                  )}

                  <select
                    value={
                      toner.tonerNumber
                    }
                    onChange={(e) =>
                      selectBeforeToner(
                        tonerIndex,
                        e.target.value
                      )
                    }
                    disabled={
                      !!currentDocumentId
                    }
                    style={{
                      ...smallInputStyle,

                      opacity:
                        currentDocumentId
                          ? 0.65
                          : 1
                    }}
                  >

                    <option value="">
                      Toner
                    </option>

                    {TONERS.map(
                      tonerOption => (

                        <option
                          key={
                            tonerOption.number
                          }
                          value={
                            tonerOption.number
                          }
                        >
                          #
                          {tonerOption.number}
                          {" - "}
                          {tonerOption.name}
                        </option>

                      )
                    )}

                  </select>

                  <span
                    style={{
                      fontSize:
                        "12px"
                    }}
                  >
                    Total:
                    {" "}
                    <strong>
                      {total} g
                    </strong>
                  </span>

                  <span
                    style={{
                      fontSize:
                        "12px"
                    }}
                  >
                    {getPercentage(
                      total,
                      grandTotal
                    )}%
                  </span>

                  {!currentDocumentId && (

                    <button
                      id="button"
                      onClick={() =>
                        removeBeforeToner(
                          tonerIndex
                        )
                      }
                      style={
                        buttonStyle
                      }
                    >
                      Remove
                    </button>

                  )}

                </div>

                {/* 10 TRIALS */}

                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "repeat(5,70px)",

                    gap:
                      "8px",

                    marginTop:
                      "12px"
                  }}
                >

                  {toner.trials.map(
                    (
                      trial,
                      trialIndex
                    ) => (

                      <div
                        key={
                          trialIndex
                        }
                      >

                        <label
                          style={{
                            fontSize:
                              "10px",

                            display:
                              "block"
                          }}
                        >
                          Try
                          {" "}
                          {trialIndex + 1}
                        </label>

                        <input
                          type="number"
                          step="any"
                          value={
                            trial.amount
                          }
                          onChange={(e) =>
                            changeBeforeTrial(
                              tonerIndex,
                              trialIndex,
                              e.target.value
                            )
                          }
                          readOnly={
                            !!currentDocumentId
                          }
                          style={{
                            ...smallInputStyle,

                            opacity:
                              currentDocumentId
                                ? 0.65
                                : 1
                          }}
                        />

                      </div>

                    )
                  )}

                </div>

              </div>

            );
          }
        )}

        <div
          style={{
            marginTop:
              "15px",

            fontWeight:
              "bold",

            fontSize:
              "13px"
          }}
        >

          Before Flip Total:
          {" "}
          {getAllTonerTotal(
            beforeToners
          )}
          {" "}g

        </div>

      </div>

      {/* ================================================= */}
      {/* COLOR CHECK */}
      {/* ================================================= */}

      <div style={cardStyle}>

        <h2
          style={{
            marginTop:
              "0",

            fontSize:
              "18px"
          }}
        >

          {currentDocumentId
            ? "ACTUAL COLOR CHECK BEFORE FLIP"
            : "ORIGINAL MIX — ORIGINAL MIX COLOR CHECK"}

        </h2>

        <div style={gridStyle}>

          {/* ========================================= */}
          {/* ORIGINAL MIX */}
          {/* ========================================= */}

          {!currentDocumentId && (

            <div>

              <label style={labelStyle}>
                Original ΔE
              </label>

              <input
                type="number"
                step="any"
                value={
                  beforeDeltaE
                }
                onChange={(e) =>
                  setBeforeDeltaE(
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />

            </div>

          )}

          {/* ========================================= */}
          {/* DAY 2 */}
          {/* ========================================= */}

          {currentDocumentId && (

            <>

              <div>

                <label style={labelStyle}>
                  New ΔE
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    day2DeltaE
                  }
                  onChange={(e) =>
                    setDay2DeltaE(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                />

              </div>

              <div>

                <label style={labelStyle}>
                  New ΔL
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    day2DeltaL
                  }
                  onChange={(e) =>
                    setDay2DeltaL(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                />

              </div>

              <div>

                <label style={labelStyle}>
                  New ΔA
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    day2DeltaA
                  }
                  onChange={(e) =>
                    setDay2DeltaA(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                />

              </div>

              <div>

                <label style={labelStyle}>
                  New ΔB
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    day2DeltaB
                  }
                  onChange={(e) =>
                    setDay2DeltaB(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                />

              </div>

            </>

          )}

        </div>

        {/* ========================================= */}
        {/* FLIP */}
        {/* ========================================= */}

        {currentDocumentId &&
          !flipped && (

            <button
              id="button"
              onClick={
                handleFlip
              }
              style={{
                ...buttonStyle,

                marginTop:
                  "18px",

                padding:
                  "10px 25px",

                background:
                  "#f59e0b",

                color:
                  "black",

                fontWeight:
                  "bold"
              }}
            >
              FLIP
            </button>

          )}

      </div>

      {/* ================================================= */}
      {/* SAVE ORIGINAL MIX */}
      {/* ================================================= */}

      {!currentDocumentId && (

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              "25px"
          }}
        >

          <button
            id="button"
            onClick={
              saveBeforeFlip
            }
            disabled={
              saving
            }
            style={{
              ...buttonStyle,

              padding:
                "12px 30px",

              fontSize:
                "14px",

              background:
                "#3b82f6",

              color:
                "white",

              fontWeight:
                "bold"
            }}
          >

            {saving
              ? "SAVING..."
              : "SAVE BEFORE FLIP"}

          </button>

        </div>

      )}

      {/* ================================================= */}
      {/* FLIP SECTION */}
      {/* ================================================= */}

      {flipped && (

        <>

          {/* ================================================= */}
          {/* TARGET VALUES */}
          {/* ================================================= */}

          <div style={cardStyle}>

            <h2
              style={{
                marginTop:
                  "0",

                fontSize:
                  "18px"
              }}
            >
              Flip — Target Values
            </h2>

            <div style={gridStyle}>

              {[
                [
                  "Target ΔL",
                  flipDeltaL
                ],

                [
                  "Target ΔA",
                  flipDeltaA
                ],

                [
                  "Target ΔB",
                  flipDeltaB
                ]

              ].map(
                ([label, value]) => (

                  <div
                    key={
                      label
                    }
                  >

                    <label
                      style={
                        labelStyle
                      }
                    >
                      {label}
                    </label>

                    <input
                      value={
                        value
                      }
                      readOnly
                      style={{
                        ...inputStyle,

                        background:
                          "#334155"
                      }}
                    />

                  </div>

                )
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* FLIP TONERS */}
          {/* ================================================= */}

          <div style={cardStyle}>

            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center"
              }}
            >

              <h2
                style={{
                  margin:
                    "0",

                  fontSize:
                    "18px"
                }}
              >
                Flip — Toner Additions
              </h2>

              <button
                id="button"
                onClick={
                  addFlipToner
                }
                style={
                  buttonStyle
                }
              >
                + Add Toner
              </button>

            </div>

            <p
              style={{
                fontSize:
                  "11px",

                opacity:
                  "0.7"
              }}
            >
              Enter only the amount added during
              the flip. The original toner amounts
              are locked.
            </p>

            {flipToners.map(
              (
                toner,
                tonerIndex
              ) => {

                const added =
                  getTonerTotal(
                    toner
                  );

                const flipTotal =
                  getAllTonerTotal(
                    flipToners
                  );

                const before =
                  beforeToners.find(
                    t =>
                      String(
                        t.tonerNumber
                      ) ===
                      String(
                        toner.tonerNumber
                      )
                  );

                const beforeAmount =
                  getTonerTotal(
                    before
                  );

                const after =
                  beforeAmount +
                  added;

                return (

                  <div
                    key={
                      tonerIndex
                    }
                    style={{
                      marginTop:
                        "15px",

                      padding:
                        "12px",

                      background:
                        "rgba(245,158,11,0.12)",

                      borderRadius:
                        "8px"
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "8px",

                        flexWrap:
                          "wrap"
                      }}
                    >

                      {toner.image && (

                        <img
                          src={
                            toner.image
                          }
                          alt="Toner"
                          style={{
                            width:
                              "40px",

                            height:
                              "40px",

                            borderRadius:
                              "5px"
                          }}
                        />

                      )}

                      <select
                        value={
                          toner.tonerNumber
                        }
                        onChange={(e) =>
                          selectFlipToner(
                            tonerIndex,
                            e.target.value
                          )
                        }
                        style={
                          smallInputStyle
                        }
                      >

                        <option value="">
                          Toner
                        </option>

                        {TONERS.map(
                          tonerOption => (

                            <option
                              key={
                                tonerOption.number
                              }
                              value={
                                tonerOption.number
                              }
                            >
                              #
                              {tonerOption.number}
                              {" - "}
                              {tonerOption.name}
                            </option>

                          )
                        )}

                      </select>

                      <span
                        style={{
                          fontSize:
                            "12px"
                        }}
                      >
                        Added:
                        {" "}
                        <strong>
                          +{added} g
                        </strong>
                      </span>

                      <span
                        style={{
                          fontSize:
                            "12px"
                        }}
                      >
                        Flip %:
                        {" "}
                        {getPercentage(
                          added,
                          flipTotal
                        )}%
                      </span>

                      <span
                        style={{
                          fontSize:
                            "12px"
                        }}
                      >
                        After:
                        {" "}
                        <strong>
                          {after} g
                        </strong>
                      </span>

                      <button
                        id="button"
                        onClick={() =>
                          removeFlipToner(
                            tonerIndex
                          )
                        }
                        style={
                          buttonStyle
                        }
                      >
                        Remove
                      </button>

                    </div>

                    {/* FLIP TRIALS */}

                    <div
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "repeat(5,70px)",

                        gap:
                          "8px",

                        marginTop:
                          "12px"
                      }}
                    >

                      {toner.trials.map(
                        (
                          trial,
                          trialIndex
                        ) => (

                          <div
                            key={
                              trialIndex
                            }
                          >

                            <label
                              style={{
                                fontSize:
                                  "10px",

                                display:
                                  "block"
                              }}
                            >
                              Try
                              {" "}
                              {trialIndex + 1}
                            </label>

                            <input
                              type="number"
                              step="any"
                              value={
                                trial.amount
                              }
                              onChange={(e) =>
                                changeFlipTrial(
                                  tonerIndex,
                                  trialIndex,
                                  e.target.value
                                )
                              }
                              style={
                                smallInputStyle
                              }
                            />

                          </div>

                        )
                      )}

                    </div>

                  </div>

                );
              }
            )}

            <div
              style={{
                marginTop:
                  "15px",

                fontWeight:
                  "bold",

                fontSize:
                  "13px"
              }}
            >

              Flip Additions:
              {" "}
              {getAllTonerTotal(
                flipToners
              )}
              {" "}g

            </div>

          </div>

          {/* ================================================= */}
          {/* AFTER FLIP COLOR CHECK */}
          {/* NO DE */}
          {/* ================================================= */}

          <div style={cardStyle}>

            <h2
              style={{
                marginTop:
                  "0",

                fontSize:
                  "18px"
              }}
            >
              After Flip — Actual Color Check
            </h2>

            <div style={gridStyle}>

              {[
                [
                  "New ΔL",
                  afterDeltaL,
                  setAfterDeltaL
                ],

                [
                  "New ΔA",
                  afterDeltaA,
                  setAfterDeltaA
                ],

                [
                  "New ΔB",
                  afterDeltaB,
                  setAfterDeltaB
                ]

              ].map(
                ([label, value, setter]) => (

                  <div
                    key={
                      label
                    }
                  >

                    <label
                      style={
                        labelStyle
                      }
                    >
                      {label}
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={
                        value
                      }
                      onChange={(e) =>
                        setter(
                          e.target.value
                        )
                      }
                      style={
                        inputStyle
                      }
                    />

                  </div>

                )
              )}

            </div>

            {/* ================================================= */}
            {/* FINAL TONER SUMMARY */}
            {/* ================================================= */}

            <div
              style={{
                marginTop:
                  "20px"
              }}
            >

              <h3
                style={{
                  fontSize:
                    "15px"
                }}
              >
                Final Toner Summary
              </h3>

              {Array.from(
                new Set([

                  ...beforeToners.map(
                    t =>
                      t.tonerNumber
                  ),

                  ...flipToners.map(
                    t =>
                      t.tonerNumber
                  )

                ])
              )
                .filter(Boolean)
                .map(
                  tonerNumber => {

                    const before =
                      beforeToners.find(
                        t =>
                          String(
                            t.tonerNumber
                          ) ===
                          String(
                            tonerNumber
                          )
                      );

                    const flip =
                      flipToners.find(
                        t =>
                          String(
                            t.tonerNumber
                          ) ===
                          String(
                            tonerNumber
                          )
                      );

                    const beforeAmount =
                      getTonerTotal(
                        before
                      );

                    const addedAmount =
                      getTonerTotal(
                        flip
                      );

                    const afterAmount =
                      beforeAmount +
                      addedAmount;

                    const finalTotal =
                      getAfterTotal();

                    return (

                      <div
                        key={
                          tonerNumber
                        }
                        style={{
                          padding:
                            "9px",

                          marginBottom:
                            "5px",

                          background:
                            "rgba(34,197,94,0.12)",

                          borderRadius:
                            "6px",

                          fontSize:
                            "12px"
                        }}
                      >

                        <strong>
                          Toner #
                          {tonerNumber}
                        </strong>

                        {" | "}

                        Before:
                        {" "}
                        {beforeAmount}g

                        {" | "}

                        Flip:
                        {" "}
                        +{addedAmount}g

                        {" | "}

                        After:
                        {" "}
                        <strong>
                          {afterAmount}g
                        </strong>

                        {" | "}

                        {getPercentage(
                          afterAmount,
                          finalTotal
                        )}%

                      </div>

                    );
                  }
                )}

            </div>

            <div
              style={{
                marginTop:
                  "15px",

                fontWeight:
                  "bold"
              }}
            >

              FINAL TOTAL:
              {" "}
              {getAfterTotal()}
              {" "}g

            </div>

          </div>

          {/* ================================================= */}
          {/* SAVE AFTER FLIP */}
          {/* ================================================= */}

          <div
            style={{
              textAlign:
                "center",

              marginBottom:
                "30px"
            }}
          >

            <button
              id="button"
              onClick={
                saveAfterFlip
              }
              disabled={
                saving
              }
              style={{
                ...buttonStyle,

                padding:
                  "12px 35px",

                fontSize:
                  "14px",

                background:
                  "#22c55e",

                color:
                  "black",

                fontWeight:
                  "bold"
              }}
            >

              {saving
                ? "SAVING..."
                : "SAVE AFTER FLIP"}

            </button>

          </div>

        </>

      )}

    </div>
  );
}

export default Ink;