import React from 'react';

const Loader = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <span className="canvas-load"></span>
      <p className="text-xs font-bold text-slate-300 mt-4 tracking-wider uppercase">
        {progress !== undefined ? `${Math.round(progress)}% Loaded` : 'Initializing 3D Canvas...'}
      </p>
    </div>
  );
};

export default Loader;
