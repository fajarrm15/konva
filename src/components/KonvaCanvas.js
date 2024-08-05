// src/components/KonvaCanvas.js
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Image, Transformer } from "react-konva";

const URLImage = ({ imageUrl, shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const boundBoxFunc = (oldBox, newBox) => {
    // Ensure the shape stays within the stage
    const stageWidth = shapeProps.stageWidth;
    const stageHeight = shapeProps.stageHeight;

    // Constraint logic
    if (
      newBox.x < 0 ||
      newBox.y < 0 ||
      newBox.x + newBox.width > stageWidth ||
      newBox.y + newBox.height > stageHeight
    ) {
      return oldBox;
    }
    return newBox;
  };

  return (
    <>
      <Image
        image={image}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const node = shapeRef.current;
          const newX = Math.max(
            0,
            Math.min(node.x(), shapeProps.stageWidth - node.width())
          );
          const newY = Math.max(
            0,
            Math.min(node.y(), shapeProps.stageHeight - node.height())
          );
          onChange({
            ...shapeProps,
            x: newX,
            y: newY,
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
            rotation: node.rotation(),
          });
        }}
        boundBoxFunc={boundBoxFunc}
      />
      {isSelected && <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />}
    </>
  );
};

const KonvaCanvas = ({
  elements,
  setElements,
  selectedId,
  setSelectedId,
  stageRef,
}) => {
  const [editingTextId, setEditingTextId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleChange = (id, newAttrs) => {
    const newElements = elements.slice();
    const index = elements.findIndex((el) => el.id === id);
    newElements[index] = { ...newElements[index], ...newAttrs };
    setElements(newElements);
  };

  const handleDoubleClick = (id, text) => {
    setEditingTextId(id);
    setInputValue(text);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (editingTextId) {
      handleChange(editingTextId, { text: inputValue });
      setEditingTextId(null);
      setInputValue("");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Stage
        ref={stageRef}
        width={600}
        height={600}
        style={{ border: "1px solid black" }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
          }
        }}
      >
        <Layer>
          {elements.map((el) => {
            if (el.type === "text") {
              return (
                <Text
                  key={el.id}
                  {...el}
                  onClick={() => handleSelect(el.id)}
                  onTap={() => handleSelect(el.id)}
                  onDblClick={() => handleDoubleClick(el.id, el.text)}
                  onDragEnd={(e) => {
                    const node = e.target;
                    const newX = Math.max(
                      0,
                      Math.min(node.x(), 600 - node.width())
                    );
                    const newY = Math.max(
                      0,
                      Math.min(node.y(), 600 - node.height())
                    );
                    handleChange(el.id, {
                      x: newX,
                      y: newY,
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    handleChange(el.id, {
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * scaleX,
                      height: node.height() * scaleY,
                      rotation: node.rotation(),
                    });
                  }}
                  draggable
                />
              );
            } else if (el.type === "image") {
              return (
                <URLImage
                  key={el.id}
                  imageUrl={el.src}
                  shapeProps={{ ...el, stageWidth: 600, stageHeight: 600 }}
                  isSelected={el.id === selectedId}
                  onSelect={() => handleSelect(el.id)}
                  onChange={(newAttrs) => handleChange(el.id, newAttrs)}
                />
              );
            } else {
              return null;
            }
          })}
        </Layer>
      </Stage>
      {editingTextId && (
        <input
          style={{
            position: "absolute",
            top: elements.find((el) => el.id === editingTextId).y,
            left: elements.find((el) => el.id === editingTextId).x,
            fontSize: elements.find((el) => el.id === editingTextId).fontSize,
            fontFamily: "Arial",
            border: "none",
            padding: "4px",
            outline: "none",
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      )}
    </div>
  );
};

export default KonvaCanvas;
