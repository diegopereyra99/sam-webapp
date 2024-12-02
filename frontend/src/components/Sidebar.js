// src/components/Sidebar.js
import React from 'react';

function Sidebar({ onUpload, onHold, onSave, onReset }) {
  return (
    <div className="sidebar">
      <h2>Controls</h2>
      <button className="sidebar-button" onClick={onUpload}>Upload Image</button>
      <button className="sidebar-button" onClick={onHold}>Hold Mask</button>
      <button className="sidebar-button" onClick={onSave}>Save Mask</button>
      <button className="sidebar-button" onClick={onReset}>Reset Mask</button>
    </div>
  );
}

export default Sidebar;
