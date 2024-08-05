// src/components/InputForm.js
import React, { useState } from "react";

const InputForm = ({ addText, addImage }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (text) {
      addText(text);
      setText("");
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        addImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
      setImageFile(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text"
        />
        <button type="submit">Add Text</button>
      </form>
      <form onSubmit={handleImageSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default InputForm;
