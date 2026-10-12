import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./TextEditor.scss";

// ADDED value and onChange

const TextEditor = ({ title = "", value, onChange, isRequired = true, description }) => {
  // ADDED function to handle the change from parent

  return (
    <div className="w-full">
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}

      {/* ADDED the parameters to be used in Parent*/}

      <ReactQuill
        value={value}
        onChange={(content) => onChange(content)}
        className="quill-extra"
        modules={{
          toolbar: [
            [{ header: [1, 3, 4, 5, 6, false] }],
            ["bold", "italic", "link", { list: "bullet" }, { list: "ordered" }],
            [{ indent: "-1" }, { indent: "+1" }],
          ],
        }}
        formats={["header", "bold", "italic", "strike", "blockquote", "list", "bullet", "link", "indent"]}
      />

      <p className="m-0 mt-2 text-xs text-neutral300">{description}</p>
    </div>
  );
};

export default TextEditor;
