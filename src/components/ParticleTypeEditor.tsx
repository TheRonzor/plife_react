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
      <h5 className="mb-3">Particle Types</h5>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {types.map((type) => (
          <div
            key={type.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'var(--canvas-bg)',
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Type {type.id}</strong>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onRemoveType(type.id)}
                disabled={types.length <= 1}
              >
                Remove
              </button>
            </div>

            <div className="mb-2">
              <label className="form-label">Color</label>
              <input
                type="color"
                value={type.color}
                onChange={(e) => updateField(type.id, 'color', e.target.value)}
                className="form-control form-control-color"
              />
            </div>

            <div className="mb-2">
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

            <div className="mb-2">
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
      </div>

      {types.length < 20 && (
        <button className="btn btn-outline-primary mt-3" onClick={onAddType}>
          Add Type
        </button>
      )}
    </div>
  );
};

export default ParticleTypeEditor;
