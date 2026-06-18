import { useEffect, useRef } from "react";

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const FONT_SIZE = 14;
    const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン!@#$%^&*<>?{}[]";

    let cols = Math.floor(canvas.width / FONT_SIZE);
    let drops: number[] = Array(cols).fill(1).map(() => Math.random() * -50);
    let glitchTimer = 0;
    let glitchActive = false;
    let glitchX = 0;
    let glitchWidth = 0;
    let glitchOffset = 0;

    let animId: number;

    const draw = () => {
      cols = Math.floor(canvas.width / FONT_SIZE);
      if (drops.length !== cols) {
        drops = Array(cols).fill(1).map(() => Math.random() * -50);
      }

      ctx.fillStyle = "rgba(2, 4, 12, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix rain
      for (let i = 0; i < drops.length; i++) {
        const isHead = drops[i] > 0 && drops[i] < canvas.height / FONT_SIZE;
        if (!isHead) {
          ctx.fillStyle = "rgba(0, 220, 120, 0.55)";
        } else {
          ctx.fillStyle = "rgba(160, 255, 200, 0.95)";
        }

        ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }

      // Glitch effect
      glitchTimer++;
      if (glitchTimer > 180 && Math.random() > 0.95) {
        glitchActive = true;
        glitchX = Math.random() * canvas.width;
        glitchWidth = Math.random() * 200 + 50;
        glitchOffset = (Math.random() - 0.5) * 30;
        glitchTimer = 0;
      }

      if (glitchActive) {
        const y = Math.random() * canvas.height;
        const h = Math.random() * 4 + 1;
        const slice = ctx.getImageData(glitchX, y, glitchWidth, h);
        ctx.putImageData(slice, glitchX + glitchOffset, y);

        // Red/cyan glitch flash
        ctx.fillStyle = Math.random() > 0.5
          ? "rgba(255, 0, 80, 0.06)"
          : "rgba(0, 240, 255, 0.06)";
        ctx.fillRect(0, y, canvas.width, h * 3);

        if (Math.random() > 0.7) glitchActive = false;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.18 }}
      />
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
          animation: "scanlines 8s linear infinite",
        }}
      />
      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      {/* Neon grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,140,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Danger pulse — top edge */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.8), rgba(255,0,80,0.6), rgba(0,240,255,0.8), transparent)",
          animation: "pulse-bar 3s ease-in-out infinite",
        }}
      />
    </>
  );
}
