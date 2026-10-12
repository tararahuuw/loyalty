import React, { useState } from "react";
import { PrimaryButton } from "sprint-asia-custom-component";

const CategoryInput = ({ onChange, error }) => {
  const [input, setInput] = useState("");
  return (
    <div>
      <div className="border rounded-md border-neutral50 grid grid-cols-3 gap-2 p-2">
        <input
          className="p-2 rounded-md col-span-2 focus:outline-none focus:border-none"
          placeholder="Input new"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />

        <div className="col-span-1">
          <PrimaryButton
            title="Add"
            type="full"
            isActive={input}
            onClick={() => {
              onChange(input);
              setInput("");
            }}
          />
        </div>
      </div>
      {error && <p className="text-danger500 text-xs">{error}</p>}
    </div>
  );
};

export default CategoryInput;
