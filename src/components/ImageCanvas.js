import React from 'react';
import { Stage, Layer, Image, Circle } from 'react-konva';
import useImage from 'use-image';

const ImageCanvas = ({ imageSrc, maskSrc, clicks, onAddClick }) => {
  const [image] = useImage(imageSrc); // Load image
  const [maskImage] = useImage(maskSrc); // Load mask image

  const containerWidth = window.innerWidth - 250; // Sidebar width adjustment
  const containerHeight = window.innerHeight;

  // Calculate image dimensions while maintaining the aspect ratio
  let imageWidth = 0;
  let imageHeight = 0;
  let imageX = 0;
  let imageY = 0;

  if (image) {
    const aspectRatio = image.width / image.height;
    if (containerWidth / containerHeight > aspectRatio) {
      imageHeight = containerHeight;
      imageWidth = containerHeight * aspectRatio;
    } else {
      imageWidth = containerWidth;
      imageHeight = containerWidth / aspectRatio;
    }

    // Center image
    imageX = (containerWidth - imageWidth) / 2;
    imageY = (containerHeight - imageHeight) / 2;
  }

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (!pointerPosition || !image) return;

    const { x, y } = pointerPosition;
    if (
      x >= imageX &&
      x <= imageX + imageWidth &&
      y >= imageY &&
      y <= imageY + imageHeight
    ) {
      e.evt.preventDefault();

      // Convert canvas coordinates to image coordinates
      const imageClickX = (x - imageX) * (image.width / imageWidth);
      const imageClickY = (y - imageY) * (image.height / imageHeight);

      // Identify left-click (green) or right-click (red)
      const clickLabel = e.evt.button === 0 ? 1 : 0;

      // Pass new click to parent via onAddClick
      onAddClick({
        x: imageClickX,
        y: imageClickY,
        label: clickLabel,
      });
    }
  };

  // Convert image coordinates back to canvas coordinates
  const getCanvasCoordinates = (click) => {
    const canvasX = imageX + (click.x * imageWidth) / image.width;
    const canvasY = imageY + (click.y * imageHeight) / image.height;
    return { x: canvasX, y: canvasY };
  };

  return (
    <div className="image-container">
      <Stage
        width={containerWidth}
        height={containerHeight}
        onClick={handleStageClick}
        onContextMenu={(e) => e.evt.preventDefault()}  // Disable right-click context menu
      >
        <Layer>
          {image && (
            <Image
              image={image}
              width={imageWidth}
              height={imageHeight}
              x={imageX}
              y={imageY}
            />
          )}
          {maskImage && (
            <Image
              image={maskImage}
              width={imageWidth}
              height={imageHeight}
              x={imageX}
              y={imageY}
              compositeOperation="source-in"
              opacity={0.4}
            />
          )}
          {clicks.map((click, index) => {
            const { x, y } = getCanvasCoordinates(click);
            return (
              <Circle
                key={index}
                x={x}
                y={y}
                radius={5}
                fill={click.label === 1 ? 'green' : 'red'}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageCanvas;

