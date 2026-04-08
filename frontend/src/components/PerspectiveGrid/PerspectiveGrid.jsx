import React, { useEffect, useRef, useState } from "react";
import "./PerspectiveGrid.css";

const PerspectiveGrid = ({
  className = "",
  gridSize = 40,
  showOverlay = true,
  fadeRadius = 80,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const handleResize = () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Increase resolution for crisp lines on HiDPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr * 1.5; // Larger surface for better perspective rendering
      canvas.height = height * dpr * 1.5;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width * 1.5}px`;
      canvas.style.height = `${height * 1.5}px`;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Scale mouse coordinates to match canvas internal resolution
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX / (window.devicePixelRatio || 1),
        y: (e.clientY - rect.top) * scaleY / (window.devicePixelRatio || 1),
      };
    };

    const drawGrid = () => {
      // Clear with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.lineWidth = 1;
      
      // Calculate row and column sizes
      const cellW = width / gridSize;
      const cellH = height / gridSize;

      // 1. Draw Base Grid Lines (Very subtle)
      ctx.strokeStyle = "rgba(175, 179, 247, 0.08)";
      ctx.beginPath();
      for (let i = 0; i <= gridSize; i++) {
        // Vertical lines
        ctx.moveTo(i * cellW, 0);
        ctx.lineTo(i * cellW, height);
        // Horizontal lines
        ctx.moveTo(0, i * cellH);
        ctx.lineTo(width, i * cellH);
      }
      ctx.stroke();

      // 2. Draw Fluid Glow (Reactive to Mouse)
      const glowScale = 300; // Radius of the glow
      const { x, y } = mouseRef.current;

      // Create a gradient that follows the mouse
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowScale);
      gradient.addColorStop(0, "rgba(175, 179, 247, 0.4)");
      gradient.addColorStop(0.5, "rgba(97, 218, 251, 0.1)");
      gradient.addColorStop(1, "transparent");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      
      // Draw highlighted lines around the mouse
      ctx.beginPath();
      
      // Only draw lines within a bounding box of the mouse to save perf
      const startCol = Math.max(0, Math.floor((x - glowScale) / cellW));
      const endCol = Math.min(gridSize, Math.ceil((x + glowScale) / cellW));
      const startRow = Math.max(0, Math.floor((y - glowScale) / cellH));
      const endRow = Math.min(gridSize, Math.ceil((y + glowScale) / cellH));

      for (let i = startCol; i <= endCol; i++) {
        ctx.moveTo(i * cellW, Math.max(0, y - glowScale));
        ctx.lineTo(i * cellW, Math.min(height, y + glowScale));
      }
      for (let j = startRow; j <= endRow; j++) {
        ctx.moveTo(Math.max(0, x - glowScale), j * cellH);
        ctx.lineTo(Math.min(width, x + glowScale), j * cellH);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(drawGrid);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();
    drawGrid();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridSize]);

  return (
    <div ref={containerRef} className={`perspective-grid-container ${className}`}>
      <canvas
        ref={canvasRef}
        className="perspective-grid-canvas"
      />
      {showOverlay && (
        <div
          className="perspective-grid-overlay"
          style={{
            background: `radial-gradient(circle at center, transparent 25%, var(--perspective-fade-stop, #0a0f18) ${fadeRadius}%)`,
          }}
        />
      )}
    </div>
  );
};

export default PerspectiveGrid;
