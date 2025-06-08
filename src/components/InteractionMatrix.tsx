import React from 'react';
import './InteractionMatrix.css';

interface ParticleType {
  id: string;
  color: string;
  size: number;
}

interface InteractionMatrixProps {
  types: ParticleType[];
  matrix: number[][];
  onChange: (row: number, col: number, value: number) => void;
}

const InteractionMatrix: React.FC<InteractionMatrixProps> = ({ types, matrix, onChange }) => {
  const handleSliderChange = (row: number, col: number, value: number) => {
    onChange(row, col, value);
  };

  return (
    <div className="interaction-matrix">
      <label className="form-label">Interaction Matrix</label>
      <div
        className="matrix-grid"
        style={{ gridTemplateColumns: `repeat(${types.length + 1}, 60px)` }}
      >
        {/* Top-left empty cell */}
        <div className="matrix-cell" />

        {/* Top row headers */}
        {types.map((col) => (
          <div key={`col-header-${col.id}`} className="matrix-cell">
            <div
              className="particle-preview"
              style={{ backgroundColor: col.color, width: col.size, height: col.size }}
              title={`Type ${col.id}`}
            />
          </div>
        ))}

        {/* Rows */}
        {types.map((row, i) => (
          <React.Fragment key={`row-${row.id}`}>
            {/* Left column header */}
            <div className="matrix-cell">
              <div
                className="particle-preview"
                style={{ backgroundColor: row.color, width: row.size, height: row.size }}
                title={`Type ${row.id}`}
              />
            </div>

            {/* Interaction sliders */}
            {types.map((_, j) => (
              <div key={`cell-${i}-${j}`} className="matrix-cell">
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={matrix[i][j]}
                  onChange={(e) => handleSliderChange(i, j, parseFloat(e.target.value))}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InteractionMatrix;