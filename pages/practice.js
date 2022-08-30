import React from "react";

const Practice = () => {
  return (
    <div
      onClick={() => {
        console.log("most Outer clicked");
      }}
    >
      <div
        onClick={() => {
          console.log("practice clicked");
        }}
        style={{
          width: 100,
          height: 100,
          background: "red",
        }}
      >
        <button
          onClick={(e) => {
            // e.stopPropagation();
            // console.log("button clicked");
          }}
        >
          Child
        </button>
      </div>
    </div>
  );
};

export default Practice;
