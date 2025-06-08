import React, { useEffect, useRef } from 'react';

const CanvasArea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Resize canvas to match parent container
  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = window.innerHeight - 40; // leave room for margins
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Simple render loop placeholder
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId: number;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Placeholder particle (we'll replace this with real particles later)
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', backgroundColor: 'inherit' }} />;
};

export default CanvasArea;