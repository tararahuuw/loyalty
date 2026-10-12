import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const DateButton = () => {
  const [monthYear, setMonthYear] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = { month: "long", year: "numeric" };
    setMonthYear(today.toLocaleDateString("en-US", options));
  }, []);

  return (
    <div className="flex flex-col w-full relative">
      <button className="flex items-center gap-2 justify-center bg-primary50 py-4 px-4 rounded-full text-base text-primary500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="text-primary500"
        >
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
        </svg>
        <span>{monthYear}</span>
      </button>
    </div>
  );
};

export default DateButton;
