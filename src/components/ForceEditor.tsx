// ./src/components/ForceEditor.tsx
import React, { useEffect, useRef, useState } from 'react';

export interface ControlPoint {
  id: string;
  x: number; // in [0, 1]
  y: number; // in [-1, 1]
  fixed?: boolean;
}

interface ForceEditorProps {
  points: ControlPoint[];
  onChange: (updatedPoints: ControlPoint[]) => void;
}

const ForceEditor: React.FC<ForceEditorProps> = ({ points, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const forceToY = (canvas: HTMLCanvasElement, force: number) => {
    return canvas.height / 2 - (force * canvas.height) / 2;
  };

  const xToCanvas = (canvas: HTMLCanvasElement, x: number) => x * canvas.width;
  const canvasToX = (canvas: HTMLCanvasElement, cx: number) => cx / canvas.width;
  const canvasToForce = (canvas: HTMLCanvasElement, cy: number) => {
    return (canvas.height / 2 - cy) * 2 / canvas.height;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 150;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw x-axis
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw force curve
    ctx.beginPath();
    ctx.strokeStyle = '#007bff';
    points.forEach((p, i) => {
      const x = xToCanvas(canvas, p.x);
      const y = forceToY(canvas, p.y);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw control points
    points.forEach(p => {
      const x = xToCanvas(canvas, p.x);
      const y = forceToY(canvas, p.y);
      ctx.fillStyle = p.fixed ? '#999' : '#007bff';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [points]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const p of points) {
      const px = xToCanvas(canvas, p.x);
      const py = forceToY(canvas, p.y);
      const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);
      if (dist < 10) {
        setDragId(p.id);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const updated = points.map((p) => {
      if (p.id !== dragId) return p;
      const newX = p.id === 'f0' ? p.x : Math.max(0, Math.min(1, canvasToX(canvas, mx)));
      const newY = Math.max(-1, Math.min(1, canvasToForce(canvas, my)));
      return { ...p, x: newX, y: newY };
    });

    onChange(updated);
  };

  const handleMouseUp = () => setDragId(null);

  return (
    <div>
      <label className="form-label">Global Force Function</label>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ width: '100%', height: 150, border: '1px solid #ccc', cursor: 'pointer' }}
      />
    </div>
  );
};

export default ForceEditor;
