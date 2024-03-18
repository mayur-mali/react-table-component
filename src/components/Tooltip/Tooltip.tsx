/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
// import ReactDOM from "react-dom";

const Tooltip = ({ text, children }: any) => {
  const [position, setPosition] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const handleMouseEnter = (event) => {
    console.log(event.target.getBoundingClientRect());

    setShowTooltip(true);
    const { top, left, height } = event.target.getBoundingClientRect();
    setPosition({ top: top + height + 5, left });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="relative inline-block">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {showTooltip && (
        <div
          className={`absolute z-50 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow top-[${position.top}px] left-[${position.left}px]`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
