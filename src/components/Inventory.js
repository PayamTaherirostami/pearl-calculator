import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  orderBy,
  query
} from "firebase/firestore";

import { db } from "../firebase";

import "./inventory.css";


// =====================================================
// INVENTORY
// =====================================================

const Inventory = () => {

  // ===================================================
  // NAVIGATION
  // ===================================================

  const navigate = useNavigate();


  // ===================================================
  // STATE
  // ===================================================

  const [inks, setInks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ===================================================
  // SEARCH
  // ===================================================

  const [search, setSearch] =
    useState("");


  // ===================================================
  // SORTING
  // ===================================================

  const [sortField, setSortField] =
    useState("inkNumber");

  const [sortDirection, setSortDirection] =
    useState("asc");


  // ===================================================
  // LOAD INKS
  // ===================================================

  const loadInventory = async () => {

    try {

      setLoading(true);

      setError("");

      console.log(
        "📦 Loading inks from Firestore..."
      );


      const inksRef =
        collection(
          db,
          "inkRecords"
        );


      let snapshot;


      try {

        // =========================================
        // TRY NEWEST FIRST
        // =========================================

        const q =
          query(
            inksRef,
            orderBy(
              "createdAt",
              "desc"
            )
          );


        snapshot =
          await getDocs(q);


      } catch (err) {

        // =========================================
        // FALLBACK IF createdAt IS MISSING
        // =========================================

        console.warn(
          "Could not order by createdAt. Loading all records.",
          err
        );


        snapshot =
          await getDocs(
            inksRef
          );
      }


      // =========================================
      // CONVERT FIRESTORE DOCUMENTS
      // =========================================

      const records =
        snapshot.docs.map(
          (document) => {

            const data =
              document.data();


            return {

              id:
                document.id,

              inkNumber:
                data.inkNumber ?? "",

              bacNumber:
                data.bacNumber ?? "",

              airline:
                data.airline ?? "",

              ts:
                data.ts ?? "",

              texture:
                data.texture ?? "",

              material:
                data.material ?? "",

              backing:
                data.backing ?? "",

              cap:
                data.cap ?? "",

              status:
                data.status ?? "",

              createdAt:
                data.createdAt ?? null,

              updatedAt:
                data.updatedAt ?? null

            };

          }
        );


      console.log(
        "✅ Loaded inks:",
        records
      );


      setInks(
        records
      );


    } catch (err) {

      console.error(
        "🔴 Error loading inventory:",
        err
      );


      setError(
        "Could not load inventory from Firestore."
      );


    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // LOAD WHEN COMPONENT OPENS
  // ===================================================

  useEffect(() => {

    loadInventory();

  }, []);


  // ===================================================
  // SORT
  // ===================================================

  const handleSort = (
    field
  ) => {

    if (
      sortField === field
    ) {

      setSortDirection(
        (previous) =>
          previous === "asc"
            ? "desc"
            : "asc"
      );

    } else {

      setSortField(
        field
      );

      setSortDirection(
        "asc"
      );

    }

  };


  // ===================================================
  // FILTER + SORT
  // ===================================================

  const filteredAndSortedInks =
    useMemo(() => {

      let result =
        [...inks];


      // =============================================
      // SEARCH
      // =============================================

      const searchValue =
        search
          .trim()
          .toLowerCase();


      if (
        searchValue
      ) {

        result =
          result.filter(
            (ink) => {

              return (

                String(
                  ink.inkNumber
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )

                ||

                String(
                  ink.bacNumber
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )

                ||

                String(
                  ink.airline
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )

                ||

                String(
                  ink.ts
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )

                ||

                String(
                  ink.texture
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )

                ||

                String(
                  ink.material
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )

                ||

                String(
                  ink.backing
                )
                  .toLowerCase()
                  .includes(
                    searchValue
                  )

              );

            }
          );

      }


      // =============================================
      // SORT
      // =============================================

      result.sort(
        (a, b) => {

          let valueA =
            a[sortField];

          let valueB =
            b[sortField];


          valueA =
            String(
              valueA ?? ""
            )
              .toLowerCase();


          valueB =
            String(
              valueB ?? ""
            )
              .toLowerCase();


          if (
            valueA < valueB
          ) {

            return (
              sortDirection ===
              "asc"
                ? -1
                : 1
            );

          }


          if (
            valueA > valueB
          ) {

            return (
              sortDirection ===
              "asc"
                ? 1
                : -1
            );

          }


          return 0;

        }
      );


      return result;

    }, [
      inks,
      search,
      sortField,
      sortDirection
    ]);


  // ===================================================
  // SORT ARROW
  // ===================================================

  const getSortArrow = (
    field
  ) => {

    if (
      sortField !== field
    ) {

      return "↕";

    }


    return (
      sortDirection ===
      "asc"
        ? "↑"
        : "↓"
    );

  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="inventory-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="inventory-header">


        {/* ===============================================
            LEFT SIDE
        =============================================== */}

        <div>

          {/* BACK BUTTON */}

          <button
            className="inventory-refresh"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back
          </button>


          <h1>
            Ink Inventory
          </h1>


          <div className="inventory-count">

            Showing{" "}

            <strong>
              {
                filteredAndSortedInks.length
              }
            </strong>

            {" "}of{" "}

            <strong>
              {
                inks.length
              }
            </strong>

            {" "}inks

          </div>

        </div>


        {/* ===============================================
            REFRESH BUTTON
        =============================================== */}

        <button
          className="inventory-refresh"
          onClick={
            loadInventory
          }
          disabled={
            loading
          }
        >

          {
            loading
              ? "Loading..."
              : "↻ Refresh"
          }

        </button>


      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="inventory-controls">


        <input
          type="text"

          className="inventory-search"

          placeholder={
            "Search Ink #, BAC, Airline, T/S, " +
            "Texture, Material, Backing..."
          }

          value={
            search
          }

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

        />


        {search && (

          <button
            className="clear-search"

            onClick={() =>
              setSearch("")
            }
          >
            Clear
          </button>

        )}


      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="inventory-error">
          {error}
        </div>

      )}


      {/* =================================================
          LOADING / TABLE
      ================================================= */}

      {loading ? (

        <div className="inventory-loading">
          Loading inks...
        </div>

      ) : (

        <div className="inventory-table-wrapper">

          <table className="inventory-table">


            {/* ===========================================
                HEADER
            =========================================== */}

            <thead>

              <tr>


                {/* INK */}

                <th
                  onClick={() =>
                    handleSort(
                      "inkNumber"
                    )
                  }
                >

                  Ink #

                  <span>
                    {
                      getSortArrow(
                        "inkNumber"
                      )
                    }
                  </span>

                </th>


                {/* AIRLINE */}

                <th
                  onClick={() =>
                    handleSort(
                      "airline"
                    )
                  }
                >

                  Airline

                  <span>
                    {
                      getSortArrow(
                        "airline"
                      )
                    }
                  </span>

                </th>


                {/* BAC */}

                <th
                  onClick={() =>
                    handleSort(
                      "bacNumber"
                    )
                  }
                >

                  BAC #

                  <span>
                    {
                      getSortArrow(
                        "bacNumber"
                      )
                    }
                  </span>

                </th>


                {/* T/S */}

                <th
                  onClick={() =>
                    handleSort(
                      "ts"
                    )
                  }
                >

                  T/S

                  <span>
                    {
                      getSortArrow(
                        "ts"
                      )
                    }
                  </span>

                </th>


                {/* TEXTURE */}

                <th
                  onClick={() =>
                    handleSort(
                      "texture"
                    )
                  }
                >

                  Texture

                  <span>
                    {
                      getSortArrow(
                        "texture"
                      )
                    }
                  </span>

                </th>


                {/* MATERIAL */}

                <th
                  onClick={() =>
                    handleSort(
                      "material"
                    )
                  }
                >

                  Material

                  <span>
                    {
                      getSortArrow(
                        "material"
                      )
                    }
                  </span>

                </th>


                {/* BACKING */}

                <th
                  onClick={() =>
                    handleSort(
                      "backing"
                    )
                  }
                >

                  Backing

                  <span>
                    {
                      getSortArrow(
                        "backing"
                      )
                    }
                  </span>

                </th>


              </tr>

            </thead>


            {/* ===========================================
                BODY
            =========================================== */}

            <tbody>


              {filteredAndSortedInks.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="inventory-empty"
                  >

                    {
                      search
                        ? "No inks match your search."
                        : "No inks found in Firestore."
                    }

                  </td>

                </tr>

              ) : (

                filteredAndSortedInks.map(
                  (ink) => (

                    <tr
                      key={
                        ink.id
                      }
                    >


                      <td className="ink-number-cell">
                        {
                          ink.inkNumber ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          ink.airline ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          ink.bacNumber ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          ink.ts ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          ink.texture ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          ink.material ||
                          "—"
                        }
                      </td>


                      <td>
                        {
                          ink.backing ||
                          "—"
                        }
                      </td>


                    </tr>

                  )
                )

              )}


            </tbody>


          </table>

        </div>

      )}


    </div>

  );

};


export default Inventory;