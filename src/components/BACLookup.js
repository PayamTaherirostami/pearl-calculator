// import React, { useState } from "react";
// import bacData from "./bacData.json";
// import "../App.css";

// // =====================================
// // DROPDOWN OPTIONS
// // =====================================






import React, { useState } from "react";
import bacData from "./bacData.json";
import "../App.css";

// =====================================
// DROPDOWN OPTIONS
// =====================================
const textureOptions = [
// "Texture",
// "SKY",
// "CRYSTAL",
// "CANVAS",
// "REMAY",
// "NEW WOVEN",
// "NEW HEAVY WOVEN",
// "MESA O",
// "MICRO",
// "HEAVY LINEN",
// "RIPPLE",
// "TURKISH",
// "BRUSHED ALUMINUM",
// "LUXOR",
// "PATAPAR",
// "MICRO B",
// "SUEDE",
// "TELATEX",
// "MESA P",
// "MESA-O",
// "LINEN L",
// "SPIGA",
// "ALLOY",
// "PERF",
// "BLOCKS",
// "LUNA",
// "MOSIAC",
// "TELA",
// "EMPTY",
// "TURKISH SILK",
// "N/A",
// "LINEN",
// "AURORA",
// "BLOCKS D",
// "FAUNA",
// "GRASS",
// "INTERWOVEN",
// "MOSAIC",
// "NABUK",
// "ROCKPORT",
// "ROSE",
// "SILK",
// "TATAMI",
// "VARIGATED",
// "DOTTED MESH",
// "1037/ M. Dimp. H",
// "1036/ M. Dimp. V",
// "Struc. Button",
// "LINEN LT",
// "CARBONIUM",
// "SKY D",
// "METAL",
// "1046/ BRUSH ALUM",
// "1045",
// "1014/ MICRO B",
// "REV. ZIRCON",
// "NAVAJO",
// "CORRUG",
// "ZIRCON",
// "DECAL",
// "PATAPAR/ MESA O",
// "MESWA O",
// "QUERCIA VERT.",
// "HERRING BONE",
// "ORIENTAL SILK",
// "FIBRA",
// "BASKET WEAVE",
// "MED DIMPLE",
// "STRUCTED BUTTON",
// "CRYSTAL D",
// "BAMBOO",
// "1031",
// "LOT LOGO",
// "GRASS VERT.",
// "MESA P LEFT",
// "SAPPI",
// "STAR DIAMOND",
// "STAR CIRCLE",
// "1015",
// "LOT LINEN",
// "RED OAK",
// "LINEN LITE",
// "LINEN CHEVERON",
// "CORRUGATED",
// "1012",
// "WOOD GRAIN",
// "1010",
// "1016",
// "MICRO 1008",
// "FIBER",
// "O TEX",
// "BRUSHED WOOD",
// "1043",
// "ROVERE",
// "1045 VERT.",
// "1046 HORIZ.",
// "1053 VERT.",
// "1054 HORIZ.",
// "1046",
// "SILK HORIZ.",
// "SILK VERT.",
// "1045 HORIZ.",
// "1017",
// "1055",
// "BRUSHED AL. HORIZ.",
// "QUERCIA",
// "1038",
// "ROCK PORT",
// "FEATHERS VERT.",
// "KOVER",
// "1049",
// "1055 SILK",
"1008",
"1010",
"1012",
"1013",
"1014",
"1015",
"1016",
"1017",
"1018",
"1024",
"1026",
"1028",
"1029",
"1031",
"1032",
"1036",
"1037",
"1038",
"1039",
"1043",
"1045",
"1046",
"1049",
"1053",
"1054",
"1055",
"ALLOY",
"1057",
"BLOCKS",
"BLOCKS D",
"BRUSHED WOOD",
"CANVAS",
"CARBONIUM",
"CRYSTAL",
"CRYSTAL D",
"DECAL",
"FAUNA",
"FEATHERS VERT.",
"FIBER",
"FIBRA",
"GRASS",
"GRASS VERT.",
"HEAVY LINEN",
"HERRING BONE",
"1059",
"KOVER",
"LINEN",
"LINEN CHEVERON",
"LINEN LITE",
"LUNA",
"LUXOR",
"MESA O",
"MESA P",
"MESA P LEFT",
"MOSAIC",
"MOSIAC",
"NABUK",
"NEW HEAVY WOVEN",
"O TEX",
"1009",
"PATAPAR",
"PATAPAR/ MESA O",
"PERF",
"QUERCIA",
"QUERCIA VERT.",
"RED OAK",
"REMAY",
"REV. ZIRCON",
"ROCK PORT",
"ROSE",
"ROVERE",
"SAPPI",
"SILK",
"1056",
"SKY",
"SKY D",
"SPIGA",
"Struc. Button",
"STRUCTED BUTTON",
"SUEDE",
"TELA",
"TELATEX",
"WOOD GRAIN",
"ZIRCON",

];
const textureMapping=[
  {number:"1007",name:"Oriental Silk"},
{number:"1008",name:"Micro"},
{number:"1009",name:"Oriental Silk"},
{number:"1010",name:"New Woven (Vertical)"},
{number:"1011",name:"New Woven (Horizontal)"},
{number:"1012",name:"Corrugated"},
{number:"1013",name:"Ripple"},
{number:"1014",name:"Micro B"},
{number:"1015",name:"Tatami (Vertical)"},
{number:"1016",name:"Dotted Mesh (Vertical)"},
{number:"1017",name:"Metal (Vertical)"},
{number:"1018",name:"Basket Weave"},
{number:"1024",name:"Turkish Silk (Horizontal)"},
{number:"1025",name:"Turkish Silk (Vertical)"},
{number:"1026",name:"Bamboo (Horizontal)"},
{number:"1027",name:"Bamboo (Vertical)"},
{number:"1028",name:"Star Circle"},
{number:"1029",name:"Star Diamond"},
{number:"1031",name:"Lot Linen"},
{number:"1032",name:"Lot Logo"},
{number:"1035",name:"Dimple Small"},
{number:"1036",name:"Dimple Medium (Vertical)"},
{number:"1037",name:"Dimple Medium (Horizontal)"},
{number:"1038",name:"Tatami (Horizontal)"},
{number:"1039",name:"Navajo"},
{number:"1040",name:"Chevron (Horizontal)"},
{number:"1041",name:"Chevron (Vertical)"},
{number:"1042",name:"Dotted Mesh (Horizontal)"},
{number:"1043",name:"GTA Emboss"},
{number:"1044",name:"Met* (Horizontal) [text unclear in photo]"},
{number:"1045",name:"Brushed Aluminum (Vertical)"},
{number:"1046",name:"Brushed Aluminum (Horizontal)"},
{number:"1053",name:"Variegated (Vertical)"},
{number:"1054",name:"Variegated (Horizontal)"},
{number:"1055",name:"Silk (Vertical)"},
{number:"1056",name:"Silk (Horizontal)"},
{number:"1057",name:"Aurora (Vertical)"},
{number:"1058",name:"Aurora (Horizontal)"},
{number:"1059",name:"Interwoven (Vertical)"},
{number:"1060",name:"Interwoven (Horizontal)"},

]
export default function BACLookup() {
  const [bac, setBac] = useState("");
  const [texture, setTexture] = useState("");
  const [textureSearch, setTextureSearch] = useState("");
  const [airline, setAirline] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [result, setResult] = useState(null);

  const filteredTextures = textureOptions.filter((option) =>
    option.toLowerCase().includes(textureSearch.toLowerCase())
  );

  // =====================================
  // SEARCH
  // =====================================
  const handleSearch = (bacValue, textureValue, airlineValue) => {

    const cleanBac = String(bacValue || "").trim();
    const cleanTexture = String(textureValue || "").trim();
    const cleanAirline = String(airlineValue || "").trim();

    // Don't search until all 3 values exist
    if (!cleanBac || !cleanTexture || !cleanAirline) {
      setResult(null);
      return;
    }

    // Create key:
    // BAC-TEXTURE-AIRLINE
    const key = `${cleanBac}-${cleanTexture}-${cleanAirline}`;

    console.log("Searching for:", key);

    const found = bacData.find((item) => {

      const jsonKey = String(item.Column1 || "")
        .trim()
        .toUpperCase();

      return jsonKey === key.toUpperCase();
    });

    console.log("Found:", found);

    setResult(found || { notFound: true, key });
  };

  return (
    <div className="calculator-card">

      {/* <h3>BAC Lookup</h3> */}

      {/* BAC NUMBER */}
      <div className="calculator-row">

        <input
          type="number"
          value={bac}
          style={{
            width: 200,
            marginBottom: 5,
            height: 35,
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
            marginTop: -5
          }}
          onChange={(e) => {
            const value = e.target.value;

            setBac(value);
            setResult(null);

            handleSearch(value, texture, airline);
          }}
          placeholder="BAC#"
        />

      </div>

      {/* DROPDOWN */}
      <div className="calculator-row">

        <div className="searchable-dropdown">

          <input
            type="text"
            style={{
              width: 200,
              height: 35,
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            value={textureSearch}
            placeholder="Select..."
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {

              const value = e.target.value;

              setTextureSearch(value);
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
                    style={{fontSize:18, color:"red"}}
                    onMouseDown={() => {

                      setTexture(option);
                      setTextureSearch(option);
                      setShowDropdown(false);
                      setResult(null);

                      handleSearch(
                        bac,
                        option,
                        airline
                      );

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

      {/* AIRLINE */}
      <div className="calculator-row">

        <input
          type="text"
          value={airline}
          style={{
            width: 200,
            height: 35,
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
          onChange={(e) => {

            const value = e.target.value;

            setAirline(value);

            handleSearch(
              bac,
              texture,
              value
            );

          }}
          placeholder="Airline"
        />

      </div>

      {/* =====================================
          RESULTS
          DIRECTLY BELOW AIRLINE INPUT
      ===================================== */}

      {result && !result.notFound && (
        <div className="bac-result">

          <div style={{ fontSize: 22, marginTop: 5 }}>
            Cart: {result.Cart}
          </div>

          <div style={{ fontSize: 22, marginTop: 5 }}>
            Bin: {result.Bin}
          </div>

          <div style={{ fontSize: 22, marginTop: 5 }}>
            Airline: {result.Airline}
          </div>

          <div style={{ fontSize: 13, marginTop: 5, color: "pink" }}>
            Pos: {result.POS}
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