import React, { useState } from "react";
import bacData from "./bacData.json";
import "../App.css";

// =====================================
// DROPDOWN OPTIONS
// =====================================
const textureOptions = [
"Texture",
"SKY",
"CRYSTAL",
"CANVAS",
"REMAY",
"NEW WOVEN",
"NEW HEAVY WOVEN",
"MESA O",
"MICRO",
"HEAVY LINEN",
"RIPPLE",
"TURKISH",
"BRUSHED ALUMINUM",
"LUXOR",
"PATAPAR",
"MICRO B",
"SUEDE",
"TELATEX",
"MESA P",
"MESA-O",
"LINEN L",
"SPIGA",
"ALLOY",
"PERF",
"BLOCKS",
"LUNA",
"MOSIAC",
"TELA",
"EMPTY",
"TURKISH SILK",
"N/A",
"LINEN",
"AURORA",
"BLOCKS D",
"FAUNA",
"GRASS",
"INTERWOVEN",
"MOSAIC",
"NABUK",
"ROCKPORT",
"ROSE",
"SILK",
"TATAMI",
"VARIGATED",
"DOTTED MESH",
"1037/ M. Dimp.  H",
"1036/ M. Dimp. V",
"Struc. Button",
"LINEN LT",
"CARBONIUM",
"SKY D",
"METAL",
"1046/ BRUSH ALUM",
"1045",
"1014/ MICRO B",
"REV. ZIRCON",
"NAVAJO",
"CORRUG",
"CARBINIUM",
"ZIRCON",
"DECAL",
"PATAPAR/ MESA O",
"MESWA O",
"QUERCIA VERT.",
"HERRING BONE",
"ORIENTAL SILK",
"FIBRA",
"BASKET WEAVE",
"MED DIMPLE",
"STRUCTED BUTTON",
"CRYSTAL D",
"BAMBOO",
"1031",
"LOT LOGO",
"GRASS VERT.",
"MESA P LEFT",
"SAPPI",
"STAR DIAMOND",
"STAR CIRCLE",
"1015",
"LOT LINEN",
"RED OAK",
"LINEN LITE",
"LINEN CHEVERON",
"CORRUGATED",
"1012",
"WOOD GRAIN",
"1010",
"1016",
"MICRO 1008",
"FIBER",
"O TEX",
"BRUSHED WOOD",
"1043",
"ROVERE",
"1045 VERT.",
"1046 HORIZ.",
"1053 VERT.",
"1054 HORIZ.",
"1046",
"SILK HORIZ.",
"SILK VERT.",
"1045 HORIZ.",
"1017",
"1055",
"BRUSHED AL. HORIZ.",
"QUERCIA",
"1038",
"ROCK PORT",
"FEATHERS VERT.",
"KOVER",
"1049",
"1055 SILK",

];

export default function BACLookup() {
  const [bac, setBac] = useState("");
const [texture, setTexture] = useState("");
const [textureSearch, setTextureSearch] = useState("");
const [showDropdown, setShowDropdown] = useState(false);


  const [result, setResult] = useState(null);
const filteredTextures = textureOptions.filter((option) =>
  option.toLowerCase().includes(textureSearch.toLowerCase())
);
  const handleSearch = () => {
    if (!bac || !texture) {
      setResult(null);
      return;
    }

    // Create the Column1 key
    const key = `${bac}-${texture}`;

    // Find matching record in JSON
    const found = bacData.find(
      (item) =>
        item.Column1.toString().toUpperCase() === key.toUpperCase()
    );

    setResult(found || { notFound: true, key });
  };

  return (
    <div className="calculator-card">

      {/* <h3>BAC Lookup</h3> */}

      {/* BAC NUMBER */}
      <div className="calculator-row">
        {/* <label>BAC#</label> */}

        <input
          type="number"
          value={bac}
            style={{width:200, marginBottom:5, height:35,
                        width: "100%",
          padding: "8px",
          // marginBottom: "8px",
          borderRadius: "6px",
          fontSize: "14px",
          boxSizing: "border-box",
          marginTop:-5
            }}
          onChange={(e) => {
            setBac(e.target.value);
            setResult(null);
          }}
          placeholder="BAC#"
        />
      </div>

      {/* DROPDOWN */}
<div className="calculator-row">
  {/* <label>Type</label> */}

  <div className="searchable-dropdown">

    <input
      type="text"
      style={{width:200 , height:35,
                  width: "100%",
          padding: "8px",
          // marginBottom: "8px",
          borderRadius: "6px",
          fontSize: "14px",
          boxSizing: "border-box",
      }}
      value={textureSearch}
      placeholder="Select..."
      onFocus={() => setShowDropdown(true)}
      onChange={(e) => {
        setTextureSearch(e.target.value);
        setShowDropdown(true);
        setTexture("");
        setResult(null);
      }}
    />

    {showDropdown && (
      <div className="dropdown-options">

        {filteredTextures.length > 0 ? (
          filteredTextures.map((option) => (
            <div
              key={option}
              className="dropdown-option"
              onMouseDown={() => {
                setTexture(option);
                setTextureSearch(option);
                setShowDropdown(false);
                setResult(null);
              }}
            >
              {option}
            </div>
          ))
        ) : (
          <div className="dropdown-no-results">
            No match
          </div>
        )}

      </div>
    )}

  </div>
</div>

      {/* SHOW CREATED KEY */}
      {/* {bac && texture && (
        <div className="bac-key">
          Key: <strong>{bac}-{texture}</strong>
        </div>
      )} */}

      {/* FIND BUTTON */}
      <button className="timer-btn"  style={{marginTop:10, marginLeft:60}} onClick={handleSearch}>
        Find
      </button>

      {/* RESULTS */}
      {result && !result.notFound && (
        <div className="bac-result">

          <div style={{fontSize:22, marginTop:5}}>
            Cart: {result.Cart}
          </div>

          <div style={{fontSize:22, marginTop:5}}>
            Bin: {result.Bin}
          </div>

          <div style={{fontSize:22, marginTop:5}}>
            Airline: {result.Airline}
          </div>

          <div style={{fontSize:22, marginTop:5}}>
            Cap: {result.Cap}
          </div>

        </div>
      )}

      {/* NOT FOUND */}
      {result?.notFound && (
        <div className="bac-not-found">
          No match found!
        </div>
      )}

    </div>
  );
}