// ./src/components/CanvasArea.tsx
import { useEffect, useRef } from "react";
import { SimulationEngine, type Particle, type ControlPoint } from "../simulation/SimulationEngine";

interface ParticleTypeInfo {
  id: number;
  color: string;
  size: number;
}

interface CanvasAreaProps {
  particles: Particle[];
  interactionMatrix: Record<number, Record<number, number>>;
  controlPoints: ControlPoint[];
  dt: number;
  goo: number;
  isRunning: boolean;
  particleTypeProperties: ParticleTypeInfo[];
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  particles,
  interactionMatrix,
  controlPoints,
  dt,
  goo,
  isRunning,
  particleTypeProperties,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef(new SimulationEngine());

  useEffect(() => {
    const engine = engineRef.current;
    engine.setParticles([...particles]); // Clone to avoid mutation
    engine.setInteractionMatrix(interactionMatrix);
    engine.setControlPoints(controlPoints);
    engine.setDt(dt);
    engine.setGoo(goo);
  }, [particles, interactionMatrix, controlPoints, dt, goo]);

  useEffect(() => {
    let frameId: number;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const engine = engineRef.current;

      if (isRunning) {
        engine.step();
      }

      const simParticles = engine.getParticles();

      // Resize canvas to match its element size
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      simParticles.forEach(p => {
        const type = particleTypeProperties.find(t => t.id === p.type);
        const radius = type?.size ?? 5;
        const color = type?.color ?? 'red';

        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, particleTypeProperties]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: "100%", 
        height: "100%",
        border: "10px solid var(--border-color)",
        display: "block",
        borderRadius: "5px",
        backgroundColor: '#000000'
      }}
    />
  );
};
