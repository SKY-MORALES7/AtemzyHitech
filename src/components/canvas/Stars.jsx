import React, { useEffect, useRef } from 'react';

const StarsCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const setSize = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    setSize();

    // 400 deep space galaxy stars
    const starCount = 400;
    const stars = [];
    const colors = [
      '#f272c8', // Pink
      '#c084fc', // Purple
      '#38bdf8', // Cyan
      '#818cf8', // Indigo
      '#ffffff', // White
      '#f43f5e', // Rose
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1800,
        y: (Math.random() - 0.5) * 1800,
        z: Math.random() * 1200 + 20,
        size: Math.random() * 1.6 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.025 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const handleResize = () => {
      setSize();
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 450;

      angleX += 0.0003;
      angleY += 0.0005;
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // 3D rotation
        const x1 = star.x * cosY - star.z * sinY;
        const z1 = star.z * cosY + star.x * sinY;

        const y1 = star.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + star.y * sinX + 600;

        if (z2 > 15) {
          const scale = fov / z2;
          const sx = cx + x1 * scale;
          const sy = cy + y1 * scale;

          if (sx >= -10 && sx <= width + 10 && sy >= -10 && sy <= height + 10) {
            star.twinklePhase += star.twinkleSpeed;
            const alpha = Math.sin(star.twinklePhase) * 0.35 + 0.65;
            const radius = Math.max(0.5, star.size * scale);

            ctx.save();
            ctx.globalAlpha = Math.min(1, Math.max(0.1, alpha));
            ctx.fillStyle = star.color;
            ctx.shadowBlur = radius * 3.5;
            ctx.shadowColor = star.color;

            ctx.beginPath();
            ctx.arc(sx, sy, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default StarsCanvas;