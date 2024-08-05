// src/App.js
import React, { useState, useRef } from "react";
import KonvaCanvas from "./components/KonvaCanvas";
import InputForm from "./components/InputForm";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);

  const addText = (text) => {
    const newElement = {
      id: `text-${elements.length + 1}`,
      type: "text",
      x: 50,
      y: 50,
      text: text,
      fontSize: 30,
      draggable: true,
    };
    setElements([...elements, newElement]);
  };

  const addImage = (src) => {
    const newElement = {
      id: `image-${elements.length + 1}`,
      type: "image",
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      src: src,
      draggable: true,
    };
    setElements([...elements, newElement]);
  };

  const handleDownload = () => {
    const dataURL = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1 }}>
        <KonvaCanvas
          elements={elements}
          setElements={setElements}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          stageRef={stageRef}
        />
      </div>
      <div style={{ flex: 1, padding: "20px", borderLeft: "1px solid black" }}>
        <h2>Controls</h2>
        <InputForm addText={addText} addImage={addImage} />
        <button onClick={handleDownload} style={{ marginTop: "20px" }}>
          Download as PNG
        </button>
      </div>
    </div>
  );
}

export default App;
