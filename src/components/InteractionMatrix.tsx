// ./src/components/InteractionMatrix.tsx
import React from 'react';

interface ParticleType {
  id: number;
  color: string;
  size: number;
}

interface InteractionMatrixProps {
  types: ParticleType[];
  matrix: Record<number, Record<number, number>>;
  onChange: (rowId: number, colId: number, value: number) => void;
}

const InteractionMatrix: React.FC<InteractionMatrixProps> = ({ types, matrix, onChange }) => {
  const handleSliderChange = (rowId: number, colId: number, value: number) => {
    onChange(rowId, colId, value);
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${types.length + 1}, 90px)`,
          gap: '6px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        {/* Top-left corner */}
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

        {/* Rows */}
        {types.map((row) => (
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

            {/* Matrix sliders with value labels */}
            {types.map((col) => (
              <div key={`cell-${row.id}-${col.id}`} style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  {(matrix[row.id]?.[col.id] ?? 0).toFixed(2)}
                </div>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={matrix[row.id]?.[col.id] ?? 0}
                  onChange={(e) => handleSliderChange(row.id, col.id, parseFloat(e.target.value))}
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