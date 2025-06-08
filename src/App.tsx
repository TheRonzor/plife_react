// ./src/App.tsx
import React, { useEffect, useState } from 'react';
import { CanvasArea } from "./components/CanvasArea";
import ForceEditor from './components/ForceEditor';
import InteractionMatrix from './components/InteractionMatrix';
import SimulationControls from './components/SimulationControls';
import ParticleTypeEditor from './components/ParticleTypeEditor';
import { type Particle, type ControlPoint } from "./simulation/SimulationEngine";

const defaultControlPoints: ControlPoint[] = [
  { id: 'f0', x: 0, y: -1, fixed: true },
  { id: 'r1', x: 0.01, y: 0 },
  { id: 'f2', x: 0.05, y: 1 },
  { id: 'r3', x: 0.2, y: 0 },
];

function App() {
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(defaultControlPoints);

  const [particleTypes, setParticleTypes] = useState(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      color: ['#bb3434', '#121212', '#34ff34'][i],
      size: 10,
      count: 20,
    }))
  );

  const [interactionMatrix, setInteractionMatrix] = useState<number[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(0))
  );

  const [particles, setParticles] = useState<Particle[]>([]);

  const [dt, setDt] = useState(0.01);
  const [goo, setGoo] = useState(0.1);
  const [isRunning, setIsRunning] = useState(true);

  // 🧠 Regenerate particles when types or counts change
  useEffect(() => {
    let id = 0;
    const all: Particle[] = [];

    particleTypes.forEach((type, index) => {
      for (let i = 0; i < type.count; i++) {
        all.push({
          id: id++,
          type: index,
          x: Math.random(),
          y: Math.random(),
          vx: 0,
          vy: 0,
        });
      }
    });

    setParticles(all);
  }, [particleTypes]);

  const handleMatrixChange = (row: number, col: number, value: number) => {
    setInteractionMatrix(prev => {
      const updated = prev.map(r => [...r]);
      updated[row][col] = value;
      return updated;
    });
  };

  const addType = () => {
    if (particleTypes.length >= 20) return;
    const newId = particleTypes.length;
    const newTypes = [
      ...particleTypes,
      { id: newId, color: '#888888', size: 10, count: 20 },
    ];
    setParticleTypes(newTypes);

    setInteractionMatrix(prev => {
      const next = prev.map(row => [...row, 0]);
      next.push(new Array(newId + 1).fill(0));
      return next;
    });
  };

  const removeType = (id: number) => {
    if (particleTypes.length <= 1) return;
    const index = particleTypes.findIndex(t => t.id === id);
    const newTypes = particleTypes.filter(t => t.id !== id);
    setParticleTypes(newTypes);

    setInteractionMatrix(prev => {
      return prev
        .filter((_, i) => i !== index)
        .map(row => row.filter((_, j) => j !== index));
    });
  };

  const toggleTheme = () => {
    const link = document.getElementById("theme-css") as HTMLLinkElement | null;
    if (!link) return;
    const isLight = link.href.includes("light.css");
    link.href = isLight ? "/dark.css" : "/light.css";
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1 }}>
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
      <div style={{ width: "50%", padding: "1rem", overflowY: "auto" }}>
        <button className="btn btn-outline-secondary mb-3" onClick={toggleTheme}>
          Toggle Theme
        </button>

        <SimulationControls
          dt={dt}
          goo={goo}
          isRunning={isRunning}
          onDtChange={setDt}
          onGooChange={setGoo}
          onToggleRunning={() => setIsRunning(r => !r)}
        />

        <hr />

        <ForceEditor points={controlPoints} onChange={setControlPoints} />

        <hr />

        <InteractionMatrix
          types={particleTypes}
          matrix={interactionMatrix}
          onChange={handleMatrixChange}
        />

        <hr />

        <ParticleTypeEditor
          types={particleTypes}
          onChange={setParticleTypes}
          onAddType={addType}
          onRemoveType={removeType}
        />
      </div>
    </div>
  );
}

export default App;
