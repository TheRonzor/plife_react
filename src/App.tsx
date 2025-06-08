// ./src/App.tsx
import React, { useState } from 'react';
import { CanvasArea } from "./components/CanvasArea";
import ForceEditor from './components/ForceEditor';
import InteractionMatrix from './components/InteractionMatrix';
import { type Particle, type ControlPoint } from "./simulation/SimulationEngine";

// Constants
const NUM_TYPES = 4;
const PARTICLES_PER_TYPE = 50;

const generateParticles = (): Particle[] => {
  let particles: Particle[] = [];
  let id = 0;
  for (let type = 0; type < NUM_TYPES; type++) {
    for (let i = 0; i < PARTICLES_PER_TYPE; i++) {
      particles.push({
        id: id++,
        type,
        x: Math.random(),
        y: Math.random(),
        vx: 0,
        vy: 0,
      });
    }
  }
  return particles;
};

const generateInteractionMatrix = (): number[][] => {
  const matrix: number[][] = [];
  for (let i = 0; i < NUM_TYPES; i++) {
    matrix[i] = [];
    for (let j = 0; j < NUM_TYPES; j++) {
      matrix[i][j] = parseFloat((Math.random() * 2 - 1).toFixed(2));
    }
  }
  return matrix;
};

const defaultControlPoints: ControlPoint[] = [
  { id: 'f0', x: 0, y: -1 },
  { id: 'r1', x: 0.05, y: 0 },
  { id: 'f2', x: 0.15, y: 1 },
  { id: 'r3', x: 0.5, y: 0 },
];

// TEMP mock type info — this should eventually be editable by user
const particleTypes = [
  { id: '0', color: 'red', size: 8 },
  { id: '1', color: 'green', size: 10 },
  { id: '2', color: 'blue', size: 12 },
  { id: '3', color: 'black', size: 15 },
];

function App() {
  const [particles] = useState<Particle[]>(generateParticles);
  const [interactionMatrix, setInteractionMatrix] = useState<number[][]>(generateInteractionMatrix);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>(defaultControlPoints);
  const [dt] = useState(0.01);
  const [goo] = useState(0.1);

  const handleMatrixChange = (row: number, col: number, value: number) => {
    setInteractionMatrix(prev => {
      const updated = prev.map(row => [...row]);
      updated[row][col] = value;
      return updated;
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
        />
      </div>
      <div style={{ width: "50%", padding: "1rem", overflowY: "auto" }}>
        <h2>Controls</h2>
        <ForceEditor points={controlPoints} onChange={setControlPoints} />
        <hr />
        <InteractionMatrix
          types={particleTypes}
          matrix={interactionMatrix}
          onChange={handleMatrixChange}
        />
      </div>
    </div>
  );
}

export default App;
