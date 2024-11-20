import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image, Circle } from 'react-konva';
import useImage from 'use-image';
import axios from 'axios'; // Add axios for API requests

const ImageCanvas = ({ imageSrc, maskSrc, clicks, onClick}) => {
  const [image] = useImage(imageSrc);  // Load image from the URL

  const containerWidth = window.innerWidth - 250; // Adjust for sidebar width
  const containerHeight = window.innerHeight;

  // Calculate the image dimensions while maintaining the aspect ratio
  let imageWidth = 0;
  let imageHeight = 0;
  let imageX = 0;
  let imageY = 0;

  if (image) {
    const aspectRatio = image.width / image.height;
    if (containerWidth / containerHeight > aspectRatio) {
      // Container is wider relative to the image; fit by height
      imageHeight = containerHeight;
      imageWidth = containerHeight * aspectRatio;
    } else {
      // Container is taller relative to the image; fit by width
      imageWidth = containerWidth;
      imageHeight = containerWidth / aspectRatio;
    }

    // Center image
    imageX = (containerWidth - imageWidth) / 2;
    imageY = (containerHeight - imageHeight) / 2;
  }

  // Convert back the stored click coordinates to canvas coordinates
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
        onClick={onClick}  // Handle left click
        onContextMenu={onClick}  // Handle right click
      >
        <Layer>
          {image && (
            <Image
              image={image}
              width={imageWidth}
              height={imageHeight}
              x={imageX} // Center the image horizontally
              y={imageY} // Center the image vertically
            />
          )}
          {maskSrc && (
            <Image
              image={maskSrc}  // Use the mask data from the API
              width={imageWidth}
              height={imageHeight}
              x={imageX}
              y={imageY}
            />
          )}
          {/* Display the clicks (markers) */}
          {clicks.map((click, index) => {
            const { x, y } = getCanvasCoordinates(click); // Convert back to canvas coordinates
            return (
              <Circle
                key={index}
                x={x}
                y={y}
                radius={5}
                fill={click.color}  // Use green for left-click, red for right-click
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageCanvas;
