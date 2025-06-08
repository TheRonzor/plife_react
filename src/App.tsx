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
  { id: 'r1', x: 0.05, y: 0 },
  { id: 'f2', x: 0.4, y: 1 },
  { id: 'r3', x: 0.8, y: 0 },
];

function App() {
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(defaultControlPoints);

  const [particleTypes, setParticleTypes] = useState(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      color: ['#bb3434', '#121212', '#34ff34'][i],
      size: Math.round(2 + Math.random()*20),
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

  // Particle style/count changes
  useEffect(() => {
  setParticles(prev => {
    let idCounter = 0;

    const updated: Particle[] = [];

    particleTypes.forEach((type, index) => {
      const existing = prev.filter(p => p.type === index);
      const needed = type.count;

      if (existing.length === needed) {
        updated.push(...existing);
      } else if (existing.length < needed) {
        // Keep all existing, add new ones
        const newParticles = Array.from({ length: needed - existing.length }, () => ({
          id: idCounter++,
          type: index,
          x: Math.random(),
          y: Math.random(),
          vx: 0,
          vy: 0,
        }));
        updated.push(...existing, ...newParticles);
      } else {
        // Too many — trim down
        updated.push(...existing.slice(0, needed));
      }
    });

    return updated;
  });
}, [particleTypes]);

  const handleMatrixChange = (row: number, col: number, value: number) => {
    setInteractionMatrix(prev => {
      const updated = prev.map(r => [...r]);
      updated[row][col] = value;
      return updated;
    });
  };

  const randomizeMatrix = () => {
    setInteractionMatrix(matrix =>
      matrix.map(row => row.map(() => parseFloat((Math.random() * 2 - 1).toFixed(2))))
    );
  };

  const resetMatrix = () => {
    setInteractionMatrix(matrix =>
      matrix.map(row => row.map(() => 0))
    );
  };

  // const addType = () => {
  //   if (particleTypes.length >= 20) return;
  //   const newId = particleTypes.length;
  //   const newTypes = [
  //     ...particleTypes,
  //     { id: newId, color: '#888888', size: 10, count: 20 },
  //   ];
  //   setParticleTypes(newTypes);

  //   setInteractionMatrix(prev => {
  //     const next = prev.map(row => [...row, 0]);
  //     next.push(new Array(newId + 1).fill(0));
  //     return next;
  //   });
  // };

  const addType = () => {
    if (particleTypes.length >= 20) return;
    const newId = particleTypes.length;

    // Generate random hex color (pastel-ish)
    const randomChannel = () => Math.floor(128 + Math.random() * 127); // 128–255
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    const randomColor = `#${toHex(randomChannel())}${toHex(randomChannel())}${toHex(randomChannel())}`;

    const randomSize = Math.floor(Math.random() * 6) + 6; // size: 6–11

    const newTypes = [
      ...particleTypes,
      { id: newId, color: randomColor, size: randomSize, count: 20 },
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
      <div style={{ 
        width: "50%", 
        padding: "1rem", 
        overflowY: "auto" ,
        border: "10px solid var(--border-color)",
        display: "block",
        borderRadius: "5px",
        }}>
        
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
