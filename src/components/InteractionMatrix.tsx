// ./src/components/InteractionMatrix.tsx
import React from 'react';

interface ParticleType {
  id: number;
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
    <div>
      <label className="form-label">Interaction Matrix</label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${types.length + 1}, 60px)`,
          gap: '4px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        {/* Top-left empty corner */}
        <div />

        {/* Column headers */}
        {types.map((col) => (
          <div key={`col-header-${col.id}`}>
            <div
              style={{
                backgroundColor: col.color,
                width: col.size,
                height: col.size,
                borderRadius: '50%',
              }}
              title={`Type ${col.id}`}
            />
          </div>
        ))}

        {/* Matrix body */}
        {types.map((row, i) => (
          <React.Fragment key={`row-${row.id}`}>
            {/* Row header */}
            <div>
              <div
                style={{
                  backgroundColor: row.color,
                  width: row.size,
                  height: row.size,
                  borderRadius: '50%',
                }}
                title={`Type ${row.id}`}
              />
            </div>

            {/* Sliders */}
            {types.map((_, j) => (
              <div key={`cell-${i}-${j}`} style={{ width: '100%' }}>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={matrix[i][j]}
                  onChange={(e) => handleSliderChange(i, j, parseFloat(e.target.value))}
                  style={{ width: '100%' }}
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
