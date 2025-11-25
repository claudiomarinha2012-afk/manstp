import { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

interface DraggableImageProps {
  element: {
    id: string;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updated: any) => void;
}

export const DraggableImage = ({
  element,
  isSelected,
  onSelect,
  onChange,
}: DraggableImageProps) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();
  const [image] = useImage(element.src);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        opacity={element.opacity}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={(e) => {
          onChange({ ...element, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
