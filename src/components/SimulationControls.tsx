import React from 'react';

interface SimulationControlsProps {
  dt: number;
  goo: number;
  isRunning: boolean;
  onDtChange: (dt: number) => void;
  onGooChange: (goo: number) => void;
  onToggleRunning: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  dt,
  goo,
  isRunning,
  onDtChange,
  onGooChange,
  onToggleRunning
}) => {
  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Time Step (dt): {dt.toFixed(3)}</label>
        <input
          type="range"
          min={0.001}
          max={0.05}
          step={0.001}
          value={dt}
          onChange={(e) => onDtChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Goo (Damping): {goo.toFixed(2)}</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={goo}
          onChange={(e) => onGooChange(parseFloat(e.target.value))}
        />
      </div>

      <button
        className="btn btn-outline-secondary"
        onClick={onToggleRunning}
      >
        {isRunning ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default SimulationControls;
