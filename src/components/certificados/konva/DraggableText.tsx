import { useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";

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

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDblClick = () => {
    const newText = prompt("Editar texto:", element.text);
    if (newText !== null) {
      onChange({ ...element, text: newText });
    }
  };

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
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        onDragEnd={(e) =>
          onChange({ ...element, x: e.target.x(), y: e.target.y() })
        }
        onDblClick={handleDblClick}
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
