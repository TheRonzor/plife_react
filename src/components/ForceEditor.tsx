// ./src/components/ForceEditor.tsx
import React, { useEffect, useRef, useState } from 'react';

export interface ControlPoint {
  id: string;
  x: number; // 0 to 1
  y: number; // -1 to 1
  fixed?: boolean;
}

interface ForceEditorProps {
  points: ControlPoint[];
  onChange: (updatedPoints: ControlPoint[]) => void;
}

const DRAG_RADIUS = 10; // px padding for click/drag detection
const MIN_SPACING = 0.005; // enforce order with spacing

const ForceEditor: React.FC<ForceEditorProps> = ({ points, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const forceToY = (canvas: HTMLCanvasElement, force: number) =>
    canvas.height / 2 - (force * canvas.height) / 2;

  const xToCanvas = (canvas: HTMLCanvasElement, x: number) => x * canvas.width;
  const canvasToX = (canvas: HTMLCanvasElement, cx: number) => cx / canvas.width;

  const canvasToForce = (canvas: HTMLCanvasElement, cy: number) => {
    const h = canvas.height;
    return (h / 2 - cy) * 2 / h;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axis
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Curve
    ctx.beginPath();
    ctx.strokeStyle = '#007bff';
    points.forEach((p, i) => {
      const x = xToCanvas(canvas, p.x);
      const y = forceToY(canvas, p.y);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Points
    points.forEach((p) => {
      const x = xToCanvas(canvas, p.x);
      const y = forceToY(canvas, p.y);
      ctx.fillStyle = p.fixed ? '#999' : '#007bff';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawCanvas();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return () => observer.disconnect();
  }, [points]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const p of points) {
      if (p.fixed) continue;
      const px = xToCanvas(canvas, p.x);
      const py = forceToY(canvas, p.y);
      const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);
      if (dist < DRAG_RADIUS) {
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

    const updated = points.map((p, _, arr) => {
      if (p.id !== dragId) return p;

      let newX = p.x;
      let newY = p.y;

      const rawX = canvasToX(canvas, mx);
      const rawY = canvasToForce(canvas, my);

      if (p.id === 'r1') {
        const max = arr[2].x - MIN_SPACING;
        newX = Math.max(MIN_SPACING, Math.min(rawX, max));
      } else if (p.id === 'f2') {
        const min = arr[1].x + MIN_SPACING;
        const max = arr[3].x - MIN_SPACING;
        newX = Math.max(min, Math.min(rawX, max));
      } else if (p.id === 'r3') {
        const min = arr[2].x + MIN_SPACING;
        newX = Math.max(min, Math.min(rawX, 1));
      }

      if (p.id === 'f0') {
        newX = 0;
        newY = Math.max(-1, Math.min(1, rawY));
      } else if (p.id === 'r1' || p.id === 'r3') {
        newY = 0;
      } else if (p.id === 'f2') {
        newY = Math.max(-1, Math.min(1, rawY));
      }

      return { ...p, x: newX, y: newY };
    });

    onChange(updated);
  };

  const handleMouseUp = () => setDragId(null);

  return (
    <div>
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

