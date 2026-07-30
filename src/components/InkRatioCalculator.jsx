import React, { useState } from "react";

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



  const calculate = () => {


    const desiredWeight =
      Number(targetWeight);



    if(!desiredWeight || desiredWeight <= 0){

      setResult({
        error:"Enter desired final weight."
      });

      return;

    }



    let currentClear = 0;

    let currentAmounts =
      Array(5).fill(0);



    /*
       CURRENT INK
    */

    if(mode === "adjust"){


      const currentRatio =
        currentPowders.reduce(
          (sum,p)=>
          sum + Number(p.ratio || 0),
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
        If same formula:
        just use existing ink
      */

      if(
        formulasMatch() &&
        Number(currentWeight) >= desiredWeight
      ){

        setResult({

          message:
          "Existing ink already matches the target formula. Use required amount.",

          clearAdd:0,

          powderAdd:Array(5).fill(0),

          finalWeight:desiredWeight

        });

        return;

      }




      /*
        Existing powder cannot disappear
      */


      if(!formulasMatch()){


        for(let i=0;i<5;i++){


          const currentRatio =
            Number(currentPowders[i].ratio || 0);


          const targetRatio =
            Number(targetPowders[i].ratio || 0);



          if(
            currentRatio > 0 &&
            targetRatio === 0
          ){

            setResult({

              error:
              `Cannot remove ${
                currentPowders[i].name ||
                powderLabels[i]
              }. It exists in current ink but is missing from target formula.`

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
        (sum,p)=>
        sum + Number(p.ratio || 0),
        0
      );



    let finalWeight =
      desiredWeight;



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
      Adjust Existing Logic
    */


    if(mode === "adjust"){


      let impossible = false;



      if(
        targetClear < currentClear &&
        !formulasMatch()
      ){

        impossible = true;

      }



      for(let i=0;i<5;i++){

        if(
          targetAmounts[i] <
          currentAmounts[i]
        ){

          impossible = true;

        }

      }




      if(impossible){


        finalWeight =
          Math.max(
            desiredWeight,
            currentClear *
            (1 + targetRatio / 100)
          );



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

      }


    }



    const clearAdd =
      mode === "adjust"
      ?
      targetClear-currentClear
      :
      targetClear;



    const powderAdd =
      targetAmounts.map(
        (p,i)=>

        mode==="adjust"
        ?
        p-currentAmounts[i]
        :
        p
      );




    setResult({

      clearAdd,

      powderAdd,

      finalWeight,

      currentClear,

      targetClear

    });


  };





return (

<div className="container mt-4">

<h2>
Ink Ratio Calculator
</h2>



<div className="mb-3">


<label className="me-4">

<input
type="radio"
checked={mode==="new"}
onChange={()=>
setMode("new")
}
/>

New Batch

</label>



<label>

<input
type="radio"
checked={mode==="adjust"}
onChange={()=>
setMode("adjust")
}
/>

Adjust Existing

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
{result.error}
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



{
result.powderAdd.map(
(p,i)=>(

<div key={i}>

{
targetPowders[i].name ||
powderLabels[i]
}

:{" "}
 {p.toFixed(2)} g

</div>

))

}



<hr/>


<h4>
Final Weight:
{result.finalWeight.toFixed(2)} g
</h4>


</>

}


</div>

}



</div>

);

}