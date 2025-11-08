import { useRef, useEffect, useState } from "react";
import { Text, Transformer, Rect } from "react-konva";

interface DraggableTextProps {
  element: {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily?: string;
    fill?: string;
    fontWeight?: string;
    textAlign?: string;
    fontStyle?: string;
    width?: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updated: any) => void;
}

export const DraggableText = ({
  element,
  isSelected,
  onSelect,
  onChange,
}: DraggableTextProps) => {
  const textRef = useRef<any>();
  const trRef = useRef<any>();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Cursor piscante
  useEffect(() => {
    if (!isSelected) {
      setShowCursor(false);
      return;
    }

    setShowCursor(true);
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [isSelected]);

  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const text = element.text;
      let newCursorPos = cursorPosition;

      if (e.key === "Backspace") {
        e.preventDefault();
        if (cursorPosition > 0) {
          const newText = text.slice(0, cursorPosition - 1) + text.slice(cursorPosition);
          onChange({ ...element, text: newText });
          newCursorPos = cursorPosition - 1;
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        if (cursorPosition < text.length) {
          const newText = text.slice(0, cursorPosition) + text.slice(cursorPosition + 1);
          onChange({ ...element, text: newText });
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        const newText = text.slice(0, cursorPosition) + "\n" + text.slice(cursorPosition);
        onChange({ ...element, text: newText });
        newCursorPos = cursorPosition + 1;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        newCursorPos = Math.max(0, cursorPosition - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        newCursorPos = Math.min(text.length, cursorPosition + 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        const lines = text.slice(0, cursorPosition).split("\n");
        const currentLineStart = cursorPosition - lines[lines.length - 1].length;
        newCursorPos = currentLineStart;
      } else if (e.key === "End") {
        e.preventDefault();
        const remainingText = text.slice(cursorPosition);
        const nextNewline = remainingText.indexOf("\n");
        newCursorPos = nextNewline === -1 ? text.length : cursorPosition + nextNewline;
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const newText = text.slice(0, cursorPosition) + e.key + text.slice(cursorPosition);
        onChange({ ...element, text: newText });
        newCursorPos = cursorPosition + 1;
      }

      setCursorPosition(newCursorPos);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, element, onChange, cursorPosition]);

  // Atualizar posição do cursor quando o texto muda externamente
  useEffect(() => {
    if (cursorPosition > element.text.length) {
      setCursorPosition(element.text.length);
    }
  }, [element.text, cursorPosition]);

  const handleTextClick = (e: any) => {
    onSelect();
    
    if (!textRef.current) return;
    
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const textNode = textRef.current;
    
    const relativeX = pointerPosition.x - textNode.x();
    const relativeY = pointerPosition.y - textNode.y();
    
    const context = textNode.getContext();
    context.font = `${element.fontWeight === "bold" ? "bold " : ""}${element.fontStyle === "italic" ? "italic " : ""}${element.fontSize}px ${element.fontFamily || "Arial"}`;
    
    const lines = element.text.split("\n");
    const lineHeight = element.fontSize * 1.2;
    const clickedLine = Math.floor(relativeY / lineHeight);
    
    if (clickedLine < 0) {
      setCursorPosition(0);
      return;
    }
    
    if (clickedLine >= lines.length) {
      setCursorPosition(element.text.length);
      return;
    }
    
    let charsSoFar = 0;
    for (let i = 0; i < clickedLine; i++) {
      charsSoFar += lines[i].length + 1;
    }
    
    const lineText = lines[clickedLine];
    let bestPos = charsSoFar;
    let minDist = Infinity;
    
    for (let i = 0; i <= lineText.length; i++) {
      const substr = lineText.slice(0, i);
      const width = context.measureText(substr).width;
      const dist = Math.abs(width - relativeX);
      
      if (dist < minDist) {
        minDist = dist;
        bestPos = charsSoFar + i;
      }
    }
    
    setCursorPosition(bestPos);
  };

  const getCursorCoordinates = () => {
    if (!textRef.current) return { x: 0, y: 0 };
    
    const textNode = textRef.current;
    const context = textNode.getContext();
    context.font = `${element.fontWeight === "bold" ? "bold " : ""}${element.fontStyle === "italic" ? "italic " : ""}${element.fontSize}px ${element.fontFamily || "Arial"}`;
    
    const textBeforeCursor = element.text.slice(0, cursorPosition);
    const lines = element.text.split("\n");
    const linesBeforeCursor = textBeforeCursor.split("\n");
    
    const lineHeight = element.fontSize * 1.2;
    const currentLine = linesBeforeCursor.length - 1;
    const y = currentLine * lineHeight;
    
    const currentLineText = linesBeforeCursor[linesBeforeCursor.length - 1];
    const x = context.measureText(currentLineText).width;
    
    return { x, y };
  };

  const cursorCoords = getCursorCoordinates();

  return (
    <>
      <Text
        x={element.x}
        y={element.y}
        text={element.text}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily || "Arial"}
        fill={element.fill || "#000000"}
        fontStyle={`${element.fontWeight === "bold" ? "bold " : ""}${element.fontStyle === "italic" ? "italic" : ""}`.trim() || "normal"}
        align={element.textAlign || "left"}
        width={element.width}
        draggable
        onClick={handleTextClick}
        onTap={handleTextClick}
        ref={textRef}
        onDragEnd={(e) =>
          onChange({ ...element, x: e.target.x(), y: e.target.y() })
        }
        onTransformEnd={(e) => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            width: Math.max(node.width() * scaleX, 30),
            fontSize: Math.max(node.fontSize() * scaleY, 8),
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && showCursor && (
        <Rect
          x={element.x + cursorCoords.x}
          y={element.y + cursorCoords.y}
          width={2}
          height={element.fontSize}
          fill={element.fill || "#000000"}
          listening={false}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={["middle-left", "middle-right", "top-center", "bottom-center"]}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </>
  );
};
