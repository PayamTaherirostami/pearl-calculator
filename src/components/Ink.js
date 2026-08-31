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
    name: "CLEAR",
    image: ""
  },
  {
    number: 501,
    name: "PEARL WHITE",
    image: ""
  },
  {
    number: 502,
    name: "MICRO BRONZ",
    image: ""
  },
  {
    number: 503,
    name: "SUPER GOLD",
    image: ""
  },
  {
    number: 504,
    name: "Brilliant Pale Gold",
    image: ""
  },
  {
    number: 505,
    name: "French Rich Gold",
    image: ""
  },
  {
    number: 506,
    name: "Brilliant Aluminum #7",
    image: ""
  },
  {
    number: 507,
    name: "Mearlin Brilliant Gold",
    image: ""
  },
  {
    number: 508,
    name: "Mearlin Super Green",
    image: ""
  },
  {
    number: 509,
    name: "Mearlin Card Gold",
    image: ""
  },
  {
    number: 510,
    name: "HI-LITE Super Green",
    image: ""
  },
  {
    number: 511,
    name: "Lumina Red",
    image: ""
  }
];

// =====================================================
// NUMBER HELPERS
// =====================================================

const roundNumber = (
  value,
  decimals = 4
) => {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  const factor =
    Math.pow(10, decimals);

  return (
    Math.round(
      (number + Number.EPSILON) *
      factor
    ) / factor
  );
};

const safeNumber = (value) => {

  const number =
    parseFloat(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

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

const getTonerTotal = (
  toner
) => {

  if (
    !toner ||
    !Array.isArray(
      toner.trials
    )
  ) {
    return 0;
  }

  return roundNumber(
    toner.trials.reduce(
      (
        total,
        trial
      ) => {

        const value =
          parseFloat(
            trial.amount
          );

        if (
          !Number.isFinite(
            value
          )
        ) {
          return total;
        }

        return roundNumber(
          total + value,
          4
        );
      },
      0
    ),
    4
  );
};

// =====================================================
// ALL TONERS TOTAL
// =====================================================

const getAllTonerTotal = (
  toners
) => {

  if (
    !Array.isArray(
      toners
    )
  ) {
    return 0;
  }

  return roundNumber(
    toners.reduce(
      (
        total,
        toner
      ) =>
        roundNumber(
          total +
          getTonerTotal(
            toner
          ),
          4
        ),
      0
    ),
    4
  );
};

// =====================================================
// PERCENTAGE
// =====================================================

const getPercentage = (
  value,
  total
) => {

  const valueNumber =
    safeNumber(value);

  const totalNumber =
    safeNumber(total);

  if (
    totalNumber === 0
  ) {
    return "0.00";
  }

  return (
    (
      valueNumber /
      totalNumber
    ) *
    100
  ).toFixed(2);
};

// =====================================================
// COMPONENT
// =====================================================

function Ink() {

  const navigate =
    useNavigate();

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
  // JOB / INVENTORY
  // ===================================================

  const [jobQnt, setJobQnt] =
    useState("");

  const [inStockWeight, setInStockWeight] =
    useState("");

  const [inkNote, setInkNote] =
    useState("");

  // ===================================================
  // ORIGINAL MIX
  // ===================================================

  const [beforeToners, setBeforeToners] =
    useState([]);

  const [beforeDeltaE, setBeforeDeltaE] =
    useState("");

  // ===================================================
  // DAY 2
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
  // INVENTORY SEARCH EDITS
  // Each result has its own values
  // ===================================================

  const [inventoryEdits, setInventoryEdits] =
    useState({});

  const [updatingInventory, setUpdatingInventory] =
    useState(null);

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

    if (
      currentDocumentId
    ) {
      return;
    }

    if (
      beforeToners.length >= 6
    ) {

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

  const removeBeforeToner = (
    index
  ) => {

    if (
      currentDocumentId
    ) {
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

    if (
      currentDocumentId
    ) {
      return;
    }

    const selected =
      TONERS.find(
        toner =>
          String(
            toner.number
          ) ===
          String(
            value
          )
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

    if (
      currentDocumentId
    ) {
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

    if (
      !currentDocumentId
    ) {

      alert(
        "Please search and load an existing ink first."
      );

      return;
    }

    const L =
      safeNumber(
        day2DeltaL
      );

    const A =
      safeNumber(
        day2DeltaA
      );

    const B =
      safeNumber(
        day2DeltaB
      );

    const targetL =
      roundNumber(
        -L,
        4
      );

    const targetA =
      roundNumber(
        -A,
        4
      );

    const targetB =
      roundNumber(
        -B,
        4
      );

    setFlipDeltaL(
      String(
        targetL
      )
    );

    setFlipDeltaA(
      String(
        targetA
      )
    );

    setFlipDeltaB(
      String(
        targetB
      )
    );

    if (
      !flipped
    ) {

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

    if (
      flipToners.length >= 6
    ) {

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
          String(
            toner.number
          ) ===
          String(
            value
          )
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

    return roundNumber(
      getAllTonerTotal(
        beforeToners
      ) +
      getAllTonerTotal(
        flipToners
      ),
      4
    );
  };

  // ===================================================
  // SAVE ORIGINAL MIX
  // ===================================================

  const saveBeforeFlip = async () => {

    if (
      !inkNumber.trim()
    ) {

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

      // BASIC

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

      // JOB / INVENTORY

      jobQnt:
        jobQnt === ""
          ? ""
          : safeNumber(
              jobQnt
            ),

      inStockWeight:
        inStockWeight === ""
          ? ""
          : roundNumber(
              safeNumber(
                inStockWeight
              ),
              4
            ),

      note:
        inkNote.trim(),

      status:
        "before_flip",

      // ORIGINAL MIX

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
        "🟢 ORIGINAL MIX SAVED:",
        docRef.id
      );

      setMessage(
        `Ink #${inkNumber} saved successfully.`
      );

      await countStorageInks();

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
  // UPDATE JOB / INVENTORY FROM SEARCH RESULT
  // ===================================================

  const updateInkInventory = async (
    recordId
  ) => {

    if (!recordId) {
      return;
    }

    const values =
      inventoryEdits[
        recordId
      ] || {};

    setUpdatingInventory(
      recordId
    );

    try {

      const newJobQnt =
        values.jobQnt === undefined ||
        values.jobQnt === ""
          ? ""
          : safeNumber(
              values.jobQnt
            );

      const newStockWeight =
        values.inStockWeight === undefined ||
        values.inStockWeight === ""
          ? ""
          : roundNumber(
              safeNumber(
                values.inStockWeight
              ),
              4
            );

      const newNote =
        values.note === undefined
          ? ""
          : values.note.trim();

      await updateDoc(
        doc(
          db,
          "inkRecords",
          recordId
        ),
        {

          jobQnt:
            newJobQnt,

          inStockWeight:
            newStockWeight,

          note:
            newNote,

          updatedAt:
            serverTimestamp()

        }
      );

      // Update search results immediately
      setSearchResults(
        previous =>
          previous.map(
            record => {

              if (
                record.id !==
                recordId
              ) {
                return record;
              }

              return {

                ...record,

                jobQnt:
                  newJobQnt,

                inStockWeight:
                  newStockWeight,

                note:
                  newNote

              };
            }
          )
      );

      setInventoryEdits(
        previous => ({

          ...previous,

          [recordId]: {

            jobQnt:
              newJobQnt === ""
                ? ""
                : String(
                    newJobQnt
                  ),

            inStockWeight:
              newStockWeight === ""
                ? ""
                : String(
                    newStockWeight
                  ),

            note:
              newNote

          }

        })
      );

      setMessage(
        "Job Qnt, In Stock Weight and Note updated successfully."
      );

    } catch (error) {

      console.error(
        "🔴 INVENTORY UPDATE ERROR:",
        error
      );

      setMessage(
        "Error updating inventory: " +
        error.message
      );

    } finally {

      setUpdatingInventory(
        null
      );
    }
  };

  // ===================================================
  // UPDATE INVENTORY FIELD
  // ===================================================

  const changeInventoryField = (
    recordId,
    field,
    value
  ) => {

    setInventoryEdits(
      previous => ({

        ...previous,

        [recordId]: {

          ...(previous[
            recordId
          ] || {}),

          [field]:
            value

        }

      })
    );
  };

  // ===================================================
  // LOAD RECORD
  // ===================================================

  const loadRecord = (
    record
  ) => {

    setRemakeWeights({
      [record.id]:
        ""
    });

    setCurrentDocumentId(
      record.id
    );

    // BASIC

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

    // JOB / INVENTORY

    setJobQnt(
      record.jobQnt !== undefined &&
      record.jobQnt !== null
        ? String(
            record.jobQnt
          )
        : ""
    );

    setInStockWeight(
      record.inStockWeight !== undefined &&
      record.inStockWeight !== null
        ? String(
            record.inStockWeight
          )
        : ""
    );

    setInkNote(
      record.note || ""
    );

    // TONERS

    setBeforeToners(
      record.beforeFlip?.toners ||
      []
    );

    setBeforeDeltaE(
      record.beforeFlip?.deltaE ||
      ""
    );

    // DAY 2

    setDay2DeltaE(
      record.beforeFlip?.day2DeltaE ||
      ""
    );

    setDay2DeltaL(
      record.beforeFlip?.day2DeltaL ||
      ""
    );

    setDay2DeltaA(
      record.beforeFlip?.day2DeltaA ||
      ""
    );

    setDay2DeltaB(
      record.beforeFlip?.day2DeltaB ||
      ""
    );

    // FLIP

    if (
      record.flip
    ) {

      setFlipped(
        true
      );

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

      setFlipped(
        false
      );

      setFlipToners(
        []
      );

      setFlipDeltaL("");
      setFlipDeltaA("");
      setFlipDeltaB("");
    }

    // AFTER FLIP

    if (
      record.afterFlip
    ) {

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

    setInkNumber("");
    setBacNumber("");
    setAirline("");
    setTs("");
    setTexture("");
    setCap("");
    setMaterial("");
    setBacking("");

    setJobQnt("");
    setInStockWeight("");
    setInkNote("");

    setBeforeToners([]);
    setBeforeDeltaE("");

    setDay2DeltaE("");
    setDay2DeltaL("");
    setDay2DeltaA("");
    setDay2DeltaB("");

    setFlipped(false);

    setFlipToners([]);
    setFlipDeltaL("");
    setFlipDeltaA("");
    setFlipDeltaB("");

    setAfterDeltaL("");
    setAfterDeltaA("");
    setAfterDeltaB("");

    setSearchInk("");
    setSearchResults([]);

    setInventoryEdits({});

    setCurrentDocumentId(
      null
    );
  };

  // ===================================================
  // RESET
  // ===================================================

  const resetToDayOne = () => {

    clearInkForm();

    setMessage(
      "Ready for a new ink. ORIGINAL MIX."
    );
  };

  // ===================================================
  // SEARCH
  // ===================================================

  const searchForInk = async () => {

    const searchValue =
      searchInk
        .trim()
        .toLowerCase();

    if (!searchValue) {

      setSearchResults([]);

      return;
    }

    setSearching(
      true
    );

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
        document => {

          const data =
            document.data();

          const inkNumber =
            String(
              data.inkNumber ||
              ""
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

      // Initialize inventory fields
      // independently for every result

      const initialEdits = {};

      results.forEach(
        record => {

          initialEdits[
            record.id
          ] = {

            jobQnt:
              record.jobQnt !== undefined &&
              record.jobQnt !== null
                ? String(
                    record.jobQnt
                  )
                : "",

            inStockWeight:
              record.inStockWeight !== undefined &&
              record.inStockWeight !== null
                ? String(
                    record.inStockWeight
                  )
                : "",

            note:
              record.note ||
              ""

          };
        }
      );

      setInventoryEdits(
        initialEdits
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

      setSearching(
        false
      );
    }
  };

  // ===================================================
  // SAVE AFTER FLIP
  // ===================================================

  const saveAfterFlip = async () => {

    if (
      !currentDocumentId
    ) {

      alert(
        "Please search and load an existing ink first."
      );

      return;
    }

    setSaving(
      true
    );

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
      roundNumber(
        beforeTotal +
        flipTotal,
        4
      );

    // TONER SUMMARY

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
      ).filter(
        Boolean
      );

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
            roundNumber(
              beforeAmount +
              addedAmount,
              4
            );

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

    const updateData = {

      status:
        "after_flip",

      beforeFlip: {

        toners:
          beforeToners,

        deltaE:
          beforeDeltaE,

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

    try {

      await updateDoc(
        doc(
          db,
          "inkRecords",
          currentDocumentId
        ),
        updateData
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

      setSaving(
        false
      );
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
      safeNumber(
        targetWeight
      );

    if (
      target <= 0
    ) {
      return [];
    }

    // =========================================
    // AFTER FLIP
    // =========================================

    if (
      record.afterFlip &&
      Array.isArray(
        record.afterFlip.toners
      ) &&
      record.afterFlip.toners.length > 0
    ) {

      const total =
        safeNumber(
          record.afterFlip.totalInk
        );

      if (
        total <= 0
      ) {
        return [];
      }

      return record.afterFlip.toners.map(
        toner => {

          const tonerAmount =
            safeNumber(
              toner.after
            );

          const percentage =
            roundNumber(
              (
                tonerAmount /
                total
              ) *
              100,
              4
            );

          const remakeAmount =
            roundNumber(
              target *
              (
                percentage /
                100
              ),
              4
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
    // ORIGINAL MIX
    // =========================================

    const toners =
      record.beforeFlip?.toners ||
      [];

    const total =
      safeNumber(
        record.beforeFlip?.totalInk
      );

    if (
      total <= 0
    ) {
      return [];
    }

    return toners.map(
      toner => {

        const tonerAmount =
          getTonerTotal(
            toner
          );

        const percentage =
          roundNumber(
            (
              tonerAmount /
              total
            ) *
            100,
            4
          );

        const remakeAmount =
          roundNumber(
            target *
            (
              percentage /
              100
            ),
            4
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

    <div
      style={
        pageStyle
      }
    >

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

            marginLeft:
              -380
          }}
        >
          Ink Color Development -

          <strong
            style={{
              marginLeft:
                10
            }}
          >
            {totalInks}
            {" "}
            inks in database
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

        <div
          style={
            cardStyle
          }
        >

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
                safeNumber(
                  record.beforeFlip?.totalInk
                );

              const flipTotal =
                safeNumber(
                  record.flip?.totalAdded
                );

              const afterTotal =
                safeNumber(
                  record.afterFlip?.totalInk
                ) ||
                roundNumber(
                  beforeTotal +
                  flipTotal,
                  4
                );

              const inventory =
                inventoryEdits[
                  record.id
                ] || {

                  jobQnt:
                    record.jobQnt !== undefined &&
                    record.jobQnt !== null
                      ? String(
                          record.jobQnt
                        )
                      : "",

                  inStockWeight:
                    record.inStockWeight !== undefined &&
                    record.inStockWeight !== null
                      ? String(
                          record.inStockWeight
                        )
                      : "",

                  note:
                    record.note ||
                    ""

                };

              return (

                <div
                  key={
                    record.id
                  }
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
                        Ink #
                        {record.inkNumber}
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
                  {/* JOB / INVENTORY */}
                  {/* ================================================= */}

                  <div
                    style={{
                      marginTop:
                        "12px",

                      padding:
                        "12px",

                      borderRadius:
                        "8px",

                      background:
                        "rgba(14,165,233,0.12)",

                      border:
                        "1px solid rgba(14,165,233,0.25)"
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          "0 0 10px",

                        fontSize:
                          "15px"
                      }}
                    >
                      JOB / INVENTORY
                    </h3>

                    <div
                      style={{
                        display:
                          "flex",

                        gap:
                          "12px",

                        flexWrap:
                          "wrap",

                        alignItems:
                          "flex-end"
                      }}
                    >

                      {/* JOB QNT */}

                      <div>

                        <label
                          style={
                            labelStyle
                          }
                        >
                          Job Qnt
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={
                            inventory.jobQnt
                          }
                          onChange={(e) =>
                            changeInventoryField(
                              record.id,
                              "jobQnt",
                              e.target.value
                            )
                          }
                          style={
                            inputStyle
                          }
                          placeholder="Job quantity"
                        />

                      </div>

                      {/* STOCK */}

                      <div>

                        <label
                          style={
                            labelStyle
                          }
                        >
                          In Stock Weight (g)
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={
                            inventory.inStockWeight
                          }
                          onChange={(e) =>
                            changeInventoryField(
                              record.id,
                              "inStockWeight",
                              e.target.value
                            )
                          }
                          style={
                            inputStyle
                          }
                          placeholder="Stock weight"
                        />

                      </div>

                      {/* NOTE */}

                      <div>

                        <label
                          style={
                            labelStyle
                          }
                        >
                          Note
                        </label>

                        <input
                          type="text"
                          value={
                            inventory.note
                          }
                          onChange={(e) =>
                            changeInventoryField(
                              record.id,
                              "note",
                              e.target.value
                            )
                          }
                          style={{
                            ...inputStyle,
                            width:
                              "280px"
                          }}
                          placeholder="Add note..."
                        />

                      </div>

                      {/* UPDATE */}

                      <button
                        id="button"
                        onClick={() =>
                          updateInkInventory(
                            record.id
                          )
                        }
                        disabled={
                          updatingInventory ===
                          record.id
                        }
                        style={{
                          ...buttonStyle,

                          background:
                            "#0ea5e9",

                          color:
                            "white",

                          fontWeight:
                            "bold",

                          height:
                            "32px"
                        }}
                      >

                        {updatingInventory ===
                        record.id
                          ? "UPDATING..."
                          : "UPDATE"}

                      </button>

                    </div>

                  </div>

                  {/* ================================================= */}
                  {/* ORIGINAL MIX */}
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
                      {roundNumber(
                        beforeTotal,
                        4
                      )}
                      {" "}g

                    </div>

                    {(
                      record.beforeFlip?.toners ||
                      []
                    ).map(
                      (
                        toner,
                        index
                      ) => {

                        const total =
                          getTonerTotal(
                            toner
                          );

                        return (

                          <div
                            key={
                              index
                            }
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

                            {roundNumber(
                              total,
                              4
                            )} g

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
                  {/* DAY 2 */}
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
                        COLOR CHECK / FLIPPING
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
                  {/* FLIP */}
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
                        {roundNumber(
                          flipTotal,
                          4
                        )} g

                      </div>

                      {(
                        record.flip.toners ||
                        []
                      ).map(
                        (
                          toner,
                          index
                        ) => {

                          const total =
                            getTonerTotal(
                              toner
                            );

                          return (

                            <div
                              key={
                                index
                              }
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

                              {roundNumber(
                                total,
                                4
                              )} g

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
                        {roundNumber(
                          afterTotal,
                          4
                        )} g

                      </div>

                      {(
                        record.afterFlip.toners ||
                        []
                      ).map(
                        (
                          toner,
                          index
                        ) => (

                          <div
                            key={
                              index
                            }
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
                            {roundNumber(
                              toner.before,
                              4
                            )}g

                            {" | "}

                            Added:
                            {" "}
                            +{roundNumber(
                              toner.added,
                              4
                            )}g

                            {" | "}

                            After:
                            {" "}
                            {roundNumber(
                              toner.after,
                              4
                            )}g

                            {" | "}

                            {Number(
                              toner.percentage
                            ).toFixed(2)}%

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

                    {remakeWeights[
                      record.id
                    ] &&
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
                                  key={
                                    index
                                  }
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
                                    {roundNumber(
                                      toner.amount,
                                      4
                                    ).toFixed(2)}
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
                                    {Number(
                                      toner.percentage
                                    ).toFixed(2)}
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

                            {safeNumber(
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

      <div
        style={
          cardStyle
        }
      >

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

        <div
          style={
            gridStyle
          }
        >

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
            (
              [
                label,
                value,
                setter
              ]
            ) => (

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

        {/* ================================================= */}
        {/* JOB / INVENTORY FOR NEW INK */}
        {/* ================================================= */}

        {!currentDocumentId && (

          <div
            style={{
              marginTop:
                "18px",

              padding:
                "14px",

              borderRadius:
                "8px",

              background:
                "rgba(14,165,233,0.10)",

              border:
                "1px solid rgba(14,165,233,0.25)"
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
              JOB / INVENTORY
            </h3>

            <div
              style={
                gridStyle
              }
            >

              <div>

                <label
                  style={
                    labelStyle
                  }
                >
                  Job Qnt
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    jobQnt
                  }
                  onChange={(e) =>
                    setJobQnt(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                  placeholder="Job quantity"
                />

              </div>

              <div>

                <label
                  style={
                    labelStyle
                  }
                >
                  In Stock Weight (g)
                </label>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={
                    inStockWeight
                  }
                  onChange={(e) =>
                    setInStockWeight(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                  placeholder="Stock weight"
                />

              </div>

              <div
                style={{
                  gridColumn:
                    "span 2"
                }}
              >

                <label
                  style={
                    labelStyle
                  }
                >
                  Note
                </label>

                <input
                  type="text"
                  value={
                    inkNote
                  }
                  onChange={(e) =>
                    setInkNote(
                      e.target.value
                    )
                  }
                  style={{
                    ...inputStyle,
                    width:
                      "100%"
                  }}
                  placeholder="Add note..."
                />

              </div>

            </div>

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* BEFORE TONERS */}
      {/* ================================================= */}

      <div
        style={
          cardStyle
        }
      >

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
          (
            toner,
            tonerIndex
          ) => {

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
                key={
                  tonerIndex
                }
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
                      {roundNumber(
                        total,
                        4
                      )} g
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
          {roundNumber(
            getAllTonerTotal(
              beforeToners
            ),
            4
          )}
          {" "}g

        </div>

      </div>

      {/* ================================================= */}
      {/* COLOR CHECK */}
      {/* ================================================= */}

      <div
        style={
          cardStyle
        }
      >

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

        <div
          style={
            gridStyle
          }
        >

          {!currentDocumentId && (

            <div>

              <label
                style={
                  labelStyle
                }
              >
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

          {currentDocumentId && (

            <>

              <div>

                <label
                  style={
                    labelStyle
                  }
                >
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

                <label
                  style={
                    labelStyle
                  }
                >
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

                <label
                  style={
                    labelStyle
                  }
                >
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

                <label
                  style={
                    labelStyle
                  }
                >
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
      {/* SAVE ORIGINAL */}
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

          {/* TARGET VALUES */}

          <div
            style={
              cardStyle
            }
          >

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

            <div
              style={
                gridStyle
              }
            >

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
                (
                  [
                    label,
                    value
                  ]
                ) => (

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

          {/* FLIP TONERS */}

          <div
            style={
              cardStyle
            }
          >

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
                  roundNumber(
                    beforeAmount +
                    added,
                    4
                  );

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
                          +{roundNumber(
                            added,
                            4
                          )} g
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
              {roundNumber(
                getAllTonerTotal(
                  flipToners
                ),
                4
              )}
              {" "}g

            </div>

          </div>

          {/* AFTER FLIP */}

          <div
            style={
              cardStyle
            }
          >

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

            <div
              style={
                gridStyle
              }
            >

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
                (
                  [
                    label,
                    value,
                    setter
                  ]
                ) => (

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

            {/* FINAL TONER SUMMARY */}

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
                .filter(
                  Boolean
                )
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
                      roundNumber(
                        beforeAmount +
                        addedAmount,
                        4
                      );

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
              {roundNumber(
                getAfterTotal(),
                4
              )}
              {" "}g

            </div>

          </div>

          {/* SAVE AFTER FLIP */}

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