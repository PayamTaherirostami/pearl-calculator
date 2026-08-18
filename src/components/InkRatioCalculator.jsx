import React, { useState, useRef } from "react";

const powderLabels = [
  "Powder 1",
  "Powder 2",
  "Powder 3",
  "Powder 4",
  "Powder 5",
];

export default function InkRatioCalculator() {

  const createPowders = () =>
    Array.from({ length: 5 }, () => ({
      name: "",
      ratio: 0,
    }));


  const [mode, setMode] = useState("adjust");

  const [currentWeight, setCurrentWeight] = useState("");

  const [currentPowders, setCurrentPowders] =
    useState(createPowders());
const printRef = useRef();
  const [targetWeight, setTargetWeight] =
    useState("");

  const [targetPowders, setTargetPowders] =
    useState(createPowders());

  const [result, setResult] =
    useState(null);



  const updatePowder = (
    setter,
    list,
    index,
    field,
    value
  ) => {

    const copy = [...list];

    copy[index] = {
      ...copy[index],
      [field]:
        field === "ratio"
          ? Number(value)
          : value
    };

    setter(copy);
  };



  const formulasMatch = () => {

    for(let i = 0; i < 5; i++){

      const current =
        Number(currentPowders[i].ratio || 0);

      const target =
        Number(targetPowders[i].ratio || 0);


      if(current !== target){
        return false;
      }

    }

    return true;

  };



  // const calculate = () => {


  //   const desiredWeight =
  //     Number(targetWeight);



  //   if(!desiredWeight || desiredWeight <= 0){

  //     setResult({
  //       error:"Enter desired final weight."
  //     });

  //     return;

  //   }



  //   let currentClear = 0;

  //   let currentAmounts =
  //     Array(5).fill(0);



  //   /*
  //      CURRENT INK
  //   */

  //   if(mode === "adjust"){


  //     const currentRatio =
  //       currentPowders.reduce(
  //         (sum,p)=>
  //         sum + Number(p.ratio || 0),
  //         0
  //       );



  //     currentClear =
  //       Number(currentWeight) /
  //       (1 + currentRatio / 100);



  //     currentAmounts =
  //       currentPowders.map(
  //         p =>
  //         currentClear *
  //         Number(p.ratio || 0) /
  //         100
  //       );



  //     /*
  //       If same formula:
  //       just use existing ink
  //     */

  //     if(
  //       formulasMatch() &&
  //       Number(currentWeight) >= desiredWeight
  //     ){

  //       setResult({

  //         message:
  //         "Existing ink already matches the target formula. Use required amount.",

  //         clearAdd:0,

  //         powderAdd:Array(5).fill(0),

  //         finalWeight:desiredWeight

  //       });

  //       return;

  //     }




  //     /*
  //       Existing powder cannot disappear
  //     */


  //     if(!formulasMatch()){


  //       for(let i=0;i<5;i++){


  //         const currentRatio =
  //           Number(currentPowders[i].ratio || 0);


  //         const targetRatio =
  //           Number(targetPowders[i].ratio || 0);



  //         if(
  //           currentRatio > 0 &&
  //           targetRatio === 0
  //         ){

  //           setResult({

  //             error:
  //             `Cannot remove ${
  //               currentPowders[i].name ||
  //               powderLabels[i]
  //             }. It exists in current ink but is missing from target formula.`

  //           });


  //           return;

  //         }

  //       }

  //     }


  //   }



  //   /*
  //     TARGET FORMULA
  //   */


  //   const targetRatio =
  //     targetPowders.reduce(
  //       (sum,p)=>
  //       sum + Number(p.ratio || 0),
  //       0
  //     );



  //   let finalWeight =
  //     desiredWeight;



  //   let targetClear =
  //     finalWeight /
  //     (1 + targetRatio / 100);



  //   let targetAmounts =
  //     targetPowders.map(
  //       p =>
  //       targetClear *
  //       Number(p.ratio || 0) /
  //       100
  //     );




  //   /*
  //     Adjust Existing Logic
  //   */


  //   if(mode === "adjust"){


  //     let impossible = false;



  //     if(
  //       targetClear < currentClear &&
  //       !formulasMatch()
  //     ){

  //       impossible = true;

  //     }



  //     for(let i=0;i<5;i++){

  //       if(
  //         targetAmounts[i] <
  //         currentAmounts[i]
  //       ){

  //         impossible = true;

  //       }

  //     }




  //     if(impossible){


  //       finalWeight =
  //         Math.max(
  //           desiredWeight,
  //           currentClear *
  //           (1 + targetRatio / 100)
  //         );



  //       targetClear =
  //         finalWeight /
  //         (1 + targetRatio / 100);



  //       targetAmounts =
  //         targetPowders.map(
  //           p =>
  //           targetClear *
  //           Number(p.ratio || 0) /
  //           100
  //         );

  //     }


  //   }



  //   const clearAdd =
  //     mode === "adjust"
  //     ?
  //     targetClear-currentClear
  //     :
  //     targetClear;



  //   const powderAdd =
  //     targetAmounts.map(
  //       (p,i)=>

  //       mode==="adjust"
  //       ?
  //       p-currentAmounts[i]
  //       :
  //       p
  //     );




  //   setResult({

  //     clearAdd,

  //     powderAdd,

  //     finalWeight,

  //     currentClear,

  //     targetClear

  //   });


  // };

const calculate = () => {

  const desiredWeight = Number(targetWeight);

  if (!desiredWeight || desiredWeight <= 0) {
    setResult({
      error: "Enter desired final weight."
    });
    return;
  }

  let currentClear = 0;
  let currentAmounts = Array(5).fill(0);

  /*
    CURRENT INK
  */

  if (mode === "adjust") {

    const currentRatio =
      currentPowders.reduce(
        (sum, p) => sum + Number(p.ratio || 0),
        0
      );

    currentClear =
      Number(currentWeight) /
      (1 + currentRatio / 100);

    currentAmounts =
      currentPowders.map(
        p =>
          currentClear *
          Number(p.ratio || 0) /
          100
      );

    /*
      If same formula and enough existing ink,
      no additions are needed.
    */

    if (
      formulasMatch() &&
      Number(currentWeight) >= desiredWeight
    ) {

      setResult({
        message:
          "Existing ink already matches the target formula. Use the required amount.",

        clearAdd: 0,

        powderAdd: Array(5).fill(0),

        finalWeight: desiredWeight
      });

      return;
    }

    /*
      Existing powder cannot disappear.
    */

    if (!formulasMatch()) {

      for (let i = 0; i < 5; i++) {

        const currentRatio =
          Number(currentPowders[i].ratio || 0);

        const targetRatio =
          Number(targetPowders[i].ratio || 0);

        if (
          currentRatio > 0 &&
          targetRatio === 0
        ) {

          setResult({
            error:
              `Cannot remove ${
                currentPowders[i].name ||
                powderLabels[i]
              }. It exists in the current ink but is missing from the target formula.`
          });

          return;
        }
      }
    }
  }


  /*
    TARGET FORMULA
  */

  const targetRatio =
    targetPowders.reduce(
      (sum, p) =>
        sum + Number(p.ratio || 0),
      0
    );


  let finalWeight = desiredWeight;

  let targetClear =
    finalWeight /
    (1 + targetRatio / 100);

  let targetAmounts =
    targetPowders.map(
      p =>
        targetClear *
        Number(p.ratio || 0) /
        100
    );


  /*
    ADJUST EXISTING
  */

  if (mode === "adjust") {

    /*
      Calculate the minimum final weight required
      so that NONE of the existing powder has
      to be removed.
    */

    let minimumWeight =
      currentClear *
      (1 + targetRatio / 100);


    for (let i = 0; i < 5; i++) {

      const targetRatioForPowder =
        Number(targetPowders[i].ratio || 0);

      const currentAmount =
        currentAmounts[i];

      /*
        If this powder already exists in the
        current ink, calculate how much total
        ink is needed to contain that amount
        at the target ratio.
      */

      if (
        currentAmount > 0 &&
        targetRatioForPowder > 0
      ) {

        const requiredWeight =
          currentAmount *
          100 /
          targetRatioForPowder *
          (1 + targetRatio / 100) /
          100;

        minimumWeight =
          Math.max(
            minimumWeight,
            requiredWeight
          );
      }
    }


    /*
      If requested weight is too low,
      DO NOT show negative powder.

      Instead tell user to increase weight.
    */

    // if (desiredWeight < minimumWeight) {

    //   setResult({

    //     error:
    //       `The requested final weight of ${desiredWeight.toFixed(2)} g is too low. ` +
    //       `You cannot remove powder from the existing ink. ` +
    //       `Increase the requested final weight to at least ${minimumWeight.toFixed(2)} g ` +
    //       `to make this formula possible.`,

    //     minimumWeight: minimumWeight

    //   });

    //   return;
    // }
if (desiredWeight < minimumWeight) {

  setResult({
    error: true,
    requestedWeight: desiredWeight,
    minimumWeight: minimumWeight,
    errorMessage:
      "The requested final weight is too low because existing powder cannot be removed."
  });

  return;
}

    /*
      Recalculate using requested weight
    */

    finalWeight = desiredWeight;

    targetClear =
      finalWeight /
      (1 + targetRatio / 100);

    targetAmounts =
      targetPowders.map(
        p =>
          targetClear *
          Number(p.ratio || 0) /
          100
      );


    /*
      Final safety check.
      This guarantees powderAdd can never be negative.
    */

    for (let i = 0; i < 5; i++) {

      if (
        targetAmounts[i] <
        currentAmounts[i] - 0.000001
      ) {

        setResult({

          error:
            `The requested final weight is too low. ` +
            `Increase the requested weight to make ` +
            `${currentPowders[i].name || powderLabels[i]} possible.`

        });

        return;
      }
    }
  }


  /*
    ADDITIONS
  */

  const clearAdd =
    mode === "adjust"
      ? targetClear - currentClear
      : targetClear;


  const powderAdd =
    targetAmounts.map(
      (p, i) =>
        mode === "adjust"
          ? p - currentAmounts[i]
          : p
    );


  /*
    FINAL SAFETY:
    Never allow negative additions.
  */

  if (powderAdd.some(p => p < -0.000001)) {

    setResult({
      error:
        "The requested final weight is too low. Increase the requested weight because powder cannot be removed from the existing ink."
    });

    return;
  }


  setResult({

    clearAdd,

    /*
      Prevent tiny floating-point values such as
      -0.00000001 from appearing.
    */
    powderAdd:
      powderAdd.map(
        p => Math.max(0, p)
      ),

    finalWeight,

    currentClear,

    targetClear

  });

};



return (
<div className="ink-ratio-container" ref={printRef}>
<div className="container mt-4" >

{/* <h2>
Ink Ratio Calculator
</h2> */}



<div className="mb-3" style={{ marginTop: "-20px" }}>


<label className="me-4" style={{ marginTop: "-20px" }}>

<input
type="radio"
checked={mode==="new"}
onChange={()=>
setMode("new")
}
/>

 <span>  </span>New Batch

</label>



<label>

<input
type="radio"
checked={mode==="adjust"}
onChange={()=>
setMode("adjust")
}
/>

<span>  </span>Adjust Existing

</label>


</div>





{
mode==="adjust" &&

<div className="card p-3 mb-3">


<h4>
Current Ink
</h4>


<input
className="form-control mb-2"
placeholder="Current weight (g)"
value={currentWeight}
onChange={
e=>setCurrentWeight(e.target.value)
}
/>



{
currentPowders.map((p,i)=>(

<div className="row mb-2" key={i}>


<div className="col">

<input
className="form-control"
placeholder={powderLabels[i]}
value={p.name}
onChange={
e=>
updatePowder(
setCurrentPowders,
currentPowders,
i,
"name",
e.target.value
)
}
/>

</div>


<div className="col">

<input
className="form-control"
type="number"
placeholder="Ratio"
value={p.ratio}
onChange={
e=>
updatePowder(
setCurrentPowders,
currentPowders,
i,
"ratio",
e.target.value
)
}
/>

</div>


</div>

))

}


</div>

}





<div className="card p-3">


<h4>
Target Formula
</h4>



<input
className="form-control mb-2"
placeholder="Desired final weight"
value={targetWeight}
onChange={
e=>setTargetWeight(e.target.value)
}
/>




{
targetPowders.map((p,i)=>(

<div className="row mb-2" key={i}>


<div className="col">

<input
className="form-control"
placeholder={powderLabels[i]}
value={p.name}
onChange={
e=>
updatePowder(
setTargetPowders,
targetPowders,
i,
"name",
e.target.value
)
}
/>

</div>


<div className="col">

<input
className="form-control"
type="number"
placeholder="Ratio"
value={p.ratio}
onChange={
e=>
updatePowder(
setTargetPowders,
targetPowders,
i,
"ratio",
e.target.value
)
}
/>

</div>


</div>

))

}


</div>




<button
style={{width:"100%"}}
className="btn btn-primary mt-3"
onClick={calculate}
>
Calculate
</button>




{
result &&

<div className="card mt-4 p-3">


{
result.error ?

<div className="alert alert-danger">

  <h5 style={{ marginBottom: 10 }}>
    ⚠️ Requested Weight Too Low
  </h5>

  <p style={{ marginBottom: 8 }}>
    {result.errorMessage}
  </p>

  <p style={{ marginBottom: 8 }}>
    <strong>Requested Final Weight:</strong>{" "}
    {result.requestedWeight.toFixed(2)} g
  </p>

  <p style={{ marginBottom: 8 }}>
    <strong>Minimum Final Weight:</strong>{" "}
    {result.minimumWeight.toFixed(2)} g
  </p>

  <hr />

  <p style={{ marginBottom: 0, fontWeight: "bold" }}>
    Increase the requested final weight to at least{" "}
    {result.minimumWeight.toFixed(2)} g.
  </p>

</div>


:

<>


{
result.message &&
<div className="alert alert-success">
{result.message}
</div>
}



<h5>
Clear To Add: {" "}
{result.clearAdd.toFixed(2)} g
</h5>


<h6 style={{marginTop:5}}>
{
result.powderAdd.map(
(p,i)=>(

<div key={i} style={{marginTop:5}}>

{
targetPowders[i].name ||
powderLabels[i]
} 

:{" "}
 {p.toFixed(2)} g

</div>

))

}

</h6>

<hr/>


<h4>
Final Weight:
{result.finalWeight.toFixed(2)} g
</h4>


</>

}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  }}
>
  <button
  style={{width:"100%"}}
    className="btn btn-success"
    onClick={() => window.print()}
  >
    🖨 Print This Sheet
  </button>
</div>
</div>

}



</div>
</div>

);

}