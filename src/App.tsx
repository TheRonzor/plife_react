// ./src/App.tsx

import { useEffect, useState } from 'react';
import { CanvasArea } from "./components/CanvasArea";
import ForceEditor from './components/ForceEditor';
import InteractionMatrix from './components/InteractionMatrix';
import SimulationControls from './components/SimulationControls';
import ParticleTypeEditor from './components/ParticleTypeEditor';
import { type Particle, type ControlPoint } from "./simulation/SimulationEngine";

const defaultControlPoints: ControlPoint[] = [
  { id: 'f0', x: 0, y: -1, fixed: true },
  { id: 'r1', x: 0.05, y: 0 },
  { id: 'f2', x: 0.3, y: 1 },
  { id: 'r3', x: 0.6, y: 0 },
];

function App() {
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(defaultControlPoints);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [nextId, setNextId] = useState(3);
  const [particleTypes, setParticleTypes] = useState(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      color: ['#ff4d4d', '#c5c515', '#4d4dff'][i],
      size: [2, 5, 15][i],
      count: [500, 100, 10][i],
    }))
  );
  const [interactionMatrix, setInteractionMatrix] = useState<Record<number, Record<number, number>>>({
    0: { 0: 0, 1: 0, 2: 1 },
    1: { 0: -0.1, 1: -0.15, 2: -0.10 },
    2: { 0: -0.1, 1: -0.15, 2: -0.20 },
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dt, setDt] = useState(0.01);
  const [goo, setGoo] = useState(0.1);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setParticles(prev => {
      let idCounter = prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 0;
      const updated: Particle[] = [];

      particleTypes.forEach((type, _) => {
        const existing = prev.filter(p => p.type === type.id);
        const needed = type.count;

        if (existing.length === needed) {
          updated.push(...existing);
        } else if (existing.length < needed) {
          const newParticles = Array.from({ length: needed - existing.length }, () => ({
            id: idCounter++,
            type: type.id,
            x: Math.random(),
            y: Math.random(),
            vx: 0,
            vy: 0,
          }));
          updated.push(...existing, ...newParticles);
        } else {
          updated.push(...existing.slice(0, needed));
        }
      });

      return updated;
    });
  }, [particleTypes]);

  const handleMatrixChange = (rowId: number, colId: number, value: number) => {
    setInteractionMatrix(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [colId]: value
      }
    }));
  };

  const randomizeMatrix = () => {
    setInteractionMatrix(_ => {
      const updated: Record<number, Record<number, number>> = {};
      for (const row of particleTypes) {
        updated[row.id] = {};
        for (const col of particleTypes) {
          updated[row.id][col.id] = parseFloat((Math.random() * 2 - 1).toFixed(2));
        }
      }
      return updated;
    });
  };

  const resetMatrix = () => {
    setInteractionMatrix(_ => {
      const updated: Record<number, Record<number, number>> = {};
      for (const row of particleTypes) {
        updated[row.id] = {};
        for (const col of particleTypes) {
          updated[row.id][col.id] = 0;
        }
      }
      return updated;
    });
  };

  const addType = () => {
    if (particleTypes.length >= 20) return;
    const newId = nextId;
    setNextId(id => id + 1);

    const randomChannel = () => Math.floor(128 + Math.random() * 127);
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    const randomColor = `#${toHex(randomChannel())}${toHex(randomChannel())}${toHex(randomChannel())}`;
    const randomSize = Math.floor(Math.random() * 6) + 6;

    setParticleTypes(prev => [...prev, { id: newId, color: randomColor, size: randomSize, count: 20 }]);
    setInteractionMatrix(prev => {
      const updated = { ...prev };
      updated[newId] = {};
      for (const type of particleTypes) {
        updated[type.id] = { ...updated[type.id], [newId]: 0 };
        updated[newId][type.id] = 0;
      }
      updated[newId][newId] = 0;
      return updated;
    });
  };

  const removeType = (id: number) => {
    if (particleTypes.length <= 1) return;
    setParticleTypes(prev => prev.filter(t => t.id !== id));
    setInteractionMatrix(prev => {
      const updated = { ...prev };
      delete updated[id];
      for (const row of Object.values(updated)) {
        delete row[id];
      }
      return updated;
    });
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh", position: "relative" }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setControlsVisible(v => !v)}
        >
          {controlsVisible ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      <div style={{ flex: controlsVisible ? 1 : "1 1 100%", transition: "flex 0.3s" }}>
        <CanvasArea
          particles={particles}
          interactionMatrix={interactionMatrix}
          controlPoints={controlPoints}
          dt={dt}
          goo={goo}
          isRunning={isRunning}
          particleTypeProperties={particleTypes}
        />
      </div>

      {controlsVisible && (
        <div style={{ width: "50%", padding: "1rem", overflowY: "auto", borderLeft: "2px solid var(--border-color)" }}>
          <h5 className="mb-3">Simulation Controls</h5>
          <SimulationControls
            dt={dt}
            goo={goo}
            isRunning={isRunning}
            onDtChange={setDt}
            onGooChange={setGoo}
            onToggleRunning={() => setIsRunning(r => !r)}
          />

          <hr />

          <h5 className="mb-3">Global Force Function</h5>
          <ForceEditor points={controlPoints} onChange={setControlPoints} />
          <hr />

          <div className="d-flex gap-2 align-items-center mb-2">
            <h5 className="mb-0">Interaction Matrix</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={randomizeMatrix}>
              Randomize
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={resetMatrix}>
              Reset
            </button>
          </div>
          <InteractionMatrix
            types={particleTypes}
            matrix={interactionMatrix}
            onChange={handleMatrixChange}
          />

          <hr />

          <h5 className="mb-3">Particle Types</h5>
          <ParticleTypeEditor
            types={particleTypes}
            onChange={setParticleTypes}
            onAddType={addType}
            onRemoveType={removeType}
          />
        </div>
      )}
    </div>
  );
}

export default App;