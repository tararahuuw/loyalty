import React from "react";
import ReactQuill from "react-quill";
import "../../assets/css/reactquill/quill.snow.css";

// ADDED value and onChange

const TextEditor = ({ title = "", value, onChange, isRequired = true, className }) => {
  // ADDED function to handle the change from parent

  const handleChange = (content) => {
    onChange(content);
  };

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
        onChange={handleChange}
        className={className}
        modules={{
          toolbar: [
            [{ header: [1, 3, 4, 5, 6, false] }],
            ["bold", "italic", "link", { list: "bullet" }, { list: "ordered" }],
            [{ indent: "-1" }, { indent: "+1" }],
          ],
        }}
        formats={["header", "bold", "italic", "strike", "blockquote", "list", "bullet", "link", "indent"]}
      />
    </div>
  );
};

export default TextEditor;
