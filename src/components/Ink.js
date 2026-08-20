
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase";
import '../App2.css';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";


// =====================================================
// TONERS
// =====================================================

const TONERS = Array.from(
  { length: 10 },
  (_, index) => ({
    number: index + 1,
    image: `https://picsum.photos/seed/toner${index + 1}/100/100`
  })
);


// =====================================================
// CREATE 10 EMPTY TRIALS
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

      const value =
        parseFloat(trial.amount);

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

  return toners.reduce(
    (total, toner) =>
      total + getTonerTotal(toner),
    0
  );
};


// =====================================================
// PERCENTAGE
// =====================================================

const getPercentage = (
  value,
  total
) => {

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
  // BEFORE FLIP TONERS
  // ===================================================

  const [beforeToners, setBeforeToners] =
    useState([]);


  // ===================================================
  // BEFORE COLOR CHECK
  // ===================================================

  const [beforeDeltaE, setBeforeDeltaE] =
    useState("");

  const [beforeDeltaL, setBeforeDeltaL] =
    useState("");

  const [beforeDeltaA, setBeforeDeltaA] =
    useState("");

  const [beforeDeltaB, setBeforeDeltaB] =
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
  // ===================================================

  const [afterDeltaE, setAfterDeltaE] =
    useState("");

  const [afterDeltaL, setAfterDeltaL] =
    useState("");

  const [afterDeltaA, setAfterDeltaA] =
    useState("");

  const [afterDeltaB, setAfterDeltaB] =
    useState("");


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
  // ADD BEFORE TONER
  // ===================================================

  const addBeforeToner = () => {

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

    const newToners =
      [...beforeToners];

    newToners.splice(index, 1);

    setBeforeToners(newToners);
  };


  // ===================================================
  // SELECT BEFORE TONER
  // ===================================================

  const selectBeforeToner = (
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
      [...beforeToners];

    newToners[index] = {

      ...newToners[index],

      tonerNumber: value,

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
  // CREATE FLIP TONERS
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
  // ===================================================

  const handleFlip = () => {

    console.log(
      "================================="
    );

    console.log(
      "🔄 FLIP BUTTON CLICKED"
    );


    const L =
      parseFloat(
        beforeDeltaL
      ) || 0;

    const A =
      parseFloat(
        beforeDeltaA
      ) || 0;

    const B =
      parseFloat(
        beforeDeltaB
      ) || 0;


    // Reverse values

    const targetL = -L;
    const targetA = -A;
    const targetB = -B;


    console.log(
      "Original Delta L:",
      L
    );

    console.log(
      "Original Delta A:",
      A
    );

    console.log(
      "Original Delta B:",
      B
    );


    console.log(
      "Target Delta L:",
      targetL
    );

    console.log(
      "Target Delta A:",
      targetA
    );

    console.log(
      "Target Delta B:",
      targetB
    );


    setFlipDeltaL(
      String(targetL)
    );

    setFlipDeltaA(
      String(targetA)
    );

    setFlipDeltaB(
      String(targetB)
    );


    // IMPORTANT:
    // BEFORE TONERS ARE NEVER CHANGED

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

  const removeFlipToner = (
    index
  ) => {

    const newToners =
      [...flipToners];

    newToners.splice(index, 1);

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

      tonerNumber: value,

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
  // FINAL TONER TOTAL
  // ===================================================

  const getAfterTonerTotal = (
    tonerNumber
  ) => {

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


    return (
      getTonerTotal(before) +
      getTonerTotal(flip)
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
  // SAVE BEFORE FLIP
  // ===================================================

  const saveBeforeFlip = async () => {

    console.log(
      "================================="
    );

    console.log(
      "💾 SAVE BEFORE FLIP"
    );


    if (!inkNumber.trim()) {

      alert(
        "Please enter Ink #."
      );

      return;
    }


    setSaving(true);
    setMessage(
      "Saving before-flip information..."
    );


    const beforeTotal =
      getAllTonerTotal(
        beforeToners
      );


    const data = {

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


      beforeFlip: {

        toners:
          beforeToners,

        deltaE:
          beforeDeltaE,

        deltaL:
          beforeDeltaL,

        deltaA:
          beforeDeltaA,

        deltaB:
          beforeDeltaB,

        totalInk:
          beforeTotal

      },


      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp()

    };


    console.log(
      "DATA:",
      data
    );


    try {

      const docRef =
        await addDoc(
          collection(
            db,
            "inkRecords"
          ),
          data
        );


      setCurrentDocumentId(
        docRef.id
      );


      console.log(
        "🟢 BEFORE FLIP SAVED"
      );

      console.log(
        "Document ID:",
        docRef.id
      );


      setMessage(
        `Before flip saved successfully. ID: ${docRef.id}`
      );

    } catch (error) {

      console.error(
        "🔴 SAVE ERROR:",
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
  // LOAD RECORD INTO FORM
  // ===================================================

  const loadRecord = (
    record
  ) => {

    console.log(
      "📂 LOADING RECORD:",
      record
    );


    setCurrentDocumentId(
      record.id
    );


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


    // BEFORE

    setBeforeToners(
      record.beforeFlip?.toners || []
    );

    setBeforeDeltaE(
      record.beforeFlip?.deltaE || ""
    );

    setBeforeDeltaL(
      record.beforeFlip?.deltaL || ""
    );

    setBeforeDeltaA(
      record.beforeFlip?.deltaA || ""
    );

    setBeforeDeltaB(
      record.beforeFlip?.deltaB || ""
    );


    // FLIP

    if (
      record.flip
    ) {

      setFlipped(true);

      setFlipDeltaL(
        record.flip.targetDeltaL ||
        ""
      );

      setFlipDeltaA(
        record.flip.targetDeltaA ||
        ""
      );

      setFlipDeltaB(
        record.flip.targetDeltaB ||
        ""
      );

      setFlipToners(
        record.flip.toners ||
        []
      );

    } else {

      setFlipped(false);

      setFlipToners([]);

    }


    // AFTER

    if (
      record.afterFlip
    ) {

      setAfterDeltaE(
        record.afterFlip.deltaE ||
        ""
      );

      setAfterDeltaL(
        record.afterFlip.deltaL ||
        ""
      );

      setAfterDeltaA(
        record.afterFlip.deltaA ||
        ""
      );

      setAfterDeltaB(
        record.afterFlip.deltaB ||
        ""
      );

    } else {

      setAfterDeltaE("");
      setAfterDeltaL("");
      setAfterDeltaA("");
      setAfterDeltaB("");

    }


    setMessage(
      `Ink #${record.inkNumber} loaded.`
    );


    // Scroll down

    setTimeout(() => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }, 100);

  };


  // ===================================================
  // SEARCH INK
  // ===================================================

  const searchForInk = async () => {

    if (!searchInk.trim()) {

      setSearchResults([]);

      return;
    }


    console.log(
      "================================="
    );

    console.log(
      "🔎 SEARCHING:",
      searchInk
    );


    setSearching(true);


    try {

      const q =
        query(
          collection(
            db,
            "inkRecords"
          ),

          where(
            "inkNumber",
            "==",
            searchInk.trim()
          )
        );


      const snapshot =
        await getDocs(q);


      const results = [];


      snapshot.forEach(
        document => {

          results.push({

            id:
              document.id,

            ...document.data()

          });

        }
      );


      console.log(
        "🔎 SEARCH RESULTS:",
        results
      );


      setSearchResults(
        results
      );


      if (
        results.length === 0
      ) {

        setMessage(
          "No ink found."
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
  // OPEN RECORD AND FLIP
  // ===================================================

  const openAndFlip = (
    record
  ) => {

    loadRecord(record);


    setTimeout(() => {

      // If the record already has
      // flip data, don't overwrite it.

      if (
        record.flip
      ) {

        setFlipped(true);

        return;
      }


      // Otherwise create new flip section.

      const L =
        parseFloat(
          record.beforeFlip?.deltaL
        ) || 0;

      const A =
        parseFloat(
          record.beforeFlip?.deltaA
        ) || 0;

      const B =
        parseFloat(
          record.beforeFlip?.deltaB
        ) || 0;


      setFlipDeltaL(
        String(-L)
      );

      setFlipDeltaA(
        String(-A)
      );

      setFlipDeltaB(
        String(-B)
      );


      setFlipToners(
        (
          record.beforeFlip?.toners ||
          []
        ).map(
          toner => ({

            tonerNumber:
              toner.tonerNumber,

            image:
              toner.image,

            trials:
              createTrials()

          })
        )
      );


      setFlipped(true);


      setMessage(
        "Flip section opened."
      );


    }, 100);

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


    if (
      !currentDocumentId
    ) {

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


    // =================================================
    // CREATE FINAL TONER SUMMARY
    // =================================================

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


    // =================================================
    // DATA TO UPDATE
    // =================================================

    const updateData = {

      status:
        "after_flip",


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


      afterFlip: {

        deltaE:
          afterDeltaE,

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


      setMessage(
        "After-flip information saved successfully."
      );


      // Search again so results
      // immediately show updated data.

      await searchForInk();


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
  // STYLES
  // CHANGE EACH VALUE AS NEEDED
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
      "75px",

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
      "border-box"

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
        //   style={buttonStyle}
        >
          ← Back
        </button>


        <h1
          style={{
            fontSize:
              "24px",

            marginLeft:
              550,
              marginRight:550
          }}
        >
          Ink Color Development
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
            value={searchInk}
            onChange={(e) =>
              setSearchInk(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter"
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
            // style={buttonStyle}
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
                beforeTotal +
                flipTotal;


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
                        BAC: {record.bacNumber}
                        {" | "}
                        Airline: {record.airline}
                        {" | "}
                        Texture: {record.texture}
                      </div>

                    </div>


                    {/* STATUS */}

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


                  {/* BEFORE */}

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
                      BEFORE FLIP
                    </h3>


                    <div
                      style={{
                        fontSize:
                          "12px"
                      }}
                    >

                      <div>
                        Delta E:
                        {" "}
                        {record.beforeFlip?.deltaE || "-"}
                      </div>

                      <div>
                        L:
                        {" "}
                        {record.beforeFlip?.deltaL || "-"}
                        {" | "}
                        A:
                        {" "}
                        {record.beforeFlip?.deltaA || "-"}
                        {" | "}
                        B:
                        {" "}
                        {record.beforeFlip?.deltaB || "-"}
                      </div>

                      <div>
                        Total:
                        {" "}
                        {beforeTotal} g
                      </div>

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


                  {/* FLIP */}

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

                        Target L:
                        {" "}
                        {record.flip.targetDeltaL}

                        {" | "}

                        Target A:
                        {" "}
                        {record.flip.targetDeltaA}

                        {" | "}

                        Target B:
                        {" "}
                        {record.flip.targetDeltaB}

                      </div>


                      <div
                        style={{
                          marginTop:
                            "5px",

                          fontSize:
                            "12px"
                        }}
                      >

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


                  {/* AFTER */}

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

                        Delta E:
                        {" "}
                        {record.afterFlip.deltaE || "-"}

                        <br />

                        L:
                        {" "}
                        {record.afterFlip.deltaL || "-"}

                        {" | "}

                        A:
                        {" "}
                        {record.afterFlip.deltaA || "-"}

                        {" | "}

                        B:
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


                  {/* ACTION BUTTON */}

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
                          openAndFlip(
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
                        FLIP
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
                  value={value}
                  onChange={(e) =>
                    setter(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

              </div>

            )
          )}

        </div>

      </div>


      {/* ================================================= */}
      {/* BEFORE TONERS */}
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
              marginRight:
                1050,

              fontSize:
                "18px"
            }}
          >
            Before Flip — Toners
          </h2>


          <button
  id="button"
            onClick={
              addBeforeToner
            }
            // style={buttonStyle}
          >
            + Add Toner
          </button>

        </div>


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
                      src={toner.image}
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
                          Toner{" "}
                          {tonerOption.number}
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
                    (trial, trialIndex) => (

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
                          Try{" "}
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

          Before Flip Total:
          {" "}
          {getAllTonerTotal(
            beforeToners
          )}
          {" "}g

        </div>

      </div>


      {/* ================================================= */}
      {/* BEFORE COLOR CHECK */}
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
          Before Flip — Color Check
        </h2>


        <div style={gridStyle}>

          {[
            [
              "Delta E",
              beforeDeltaE,
              setBeforeDeltaE
            ],

            [
              "Delta L",
              beforeDeltaL,
              setBeforeDeltaL
            ],

            [
              "Delta A",
              beforeDeltaA,
              setBeforeDeltaA
            ],

            [
              "Delta B",
              beforeDeltaB,
              setBeforeDeltaB
            ]

          ].map(
            ([label, value, setter]) => (

              <div key={label}>

                <label style={labelStyle}>
                  {label}
                </label>

                <input
                  type="number"
                  step="any"
                  value={value}
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

      </div>


      {/* ================================================= */}
      {/* SAVE BEFORE FLIP */}
      {/* ================================================= */}

      {!flipped && (

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

          {/* TARGET VALUES */}

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
                  "Target Delta L",
                  flipDeltaL
                ],

                [
                  "Target Delta A",
                  flipDeltaA
                ],

                [
                  "Target Delta B",
                  flipDeltaB
                ]

              ].map(
                ([label, value]) => (

                  <div key={label}>

                    <label
                      style={
                        labelStyle
                      }
                    >
                      {label}
                    </label>

                    <input
                      value={value}
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
              will never be changed.
            </p>


            {flipToners.map(
              (toner, tonerIndex) => {

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
                    key={tonerIndex}
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
                              Toner{" "}
                              {tonerOption.number}
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


                    {/* FLIP 10 TRIALS */}

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
                              Try{" "}
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
                  "Delta E",
                  afterDeltaE,
                  setAfterDeltaE
                ],

                [
                  "Delta L",
                  afterDeltaL,
                  setAfterDeltaL
                ],

                [
                  "Delta A",
                  afterDeltaA,
                  setAfterDeltaA
                ],

                [
                  "Delta B",
                  afterDeltaB,
                  setAfterDeltaB
                ]

              ].map(
                ([label, value, setter]) => (

                  <div key={label}>

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
                      value={value}
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


            {/* FINAL SUMMARY */}

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