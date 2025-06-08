// ./src/components/ParticleTypeEditor.tsx
import React from 'react';

interface ParticleType {
  id: number;
  color: string;
  size: number;
  count: number;
}

interface ParticleTypeEditorProps {
  types: ParticleType[];
  onChange: (updated: ParticleType[]) => void;
  onAddType: () => void;
  onRemoveType: (id: number) => void;
}

const ParticleTypeEditor: React.FC<ParticleTypeEditorProps> = ({
  types,
  onChange,
  onAddType,
  onRemoveType,
}) => {
  const updateField = (id: number, field: keyof ParticleType, value: string | number) => {
    onChange(types.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  return (
    <div>
      <h5>Particle Types</h5>
      {types.map(type => (
        <div key={type.id} className="mb-2 p-2 border rounded">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong>Type {type.id}</strong>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemoveType(type.id)}
              disabled={types.length <= 1}
            >
              Remove
            </button>
          </div>
          <div className="mb-1">
            <label className="form-label">Color</label>
            <input
              type="color"
              value={type.color}
              onChange={(e) => updateField(type.id, 'color', e.target.value)}
              className="form-control form-control-color"
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Size</label>
            <input
              type="number"
              min={1}
              max={20}
              value={type.size}
              onChange={(e) => updateField(type.id, 'size', parseInt(e.target.value))}
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Count</label>
            <input
              type="number"
              min={0}
              max={1000}
              value={type.count}
              onChange={(e) => updateField(type.id, 'count', parseInt(e.target.value))}
              className="form-control"
            />
          </div>
        </div>
      ))}

      {types.length < 20 && (
        <button className="btn btn-outline-primary mt-2" onClick={onAddType}>
          Add Type
        </button>
      )}
    </div>
  );
};

export default ParticleTypeEditor;
