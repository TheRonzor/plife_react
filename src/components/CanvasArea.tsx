// ./src/components/CanvasArea.tsx
import { useEffect, useRef } from "react";
import { SimulationEngine, type Particle, type ControlPoint } from "../simulation/SimulationEngine";

interface CanvasAreaProps {
  particles: Particle[];
  interactionMatrix: number[][];
  controlPoints: ControlPoint[];
  dt: number;
  goo: number;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  particles,
  interactionMatrix,
  controlPoints,
  dt,
  goo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef(new SimulationEngine());

  useEffect(() => {
    const engine = engineRef.current;
    engine.setParticles([...particles]); // clone to avoid mutation
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
      engine.step();
      const simParticles = engine.getParticles();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      simParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red"; // TODO: Use particle type color
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};
