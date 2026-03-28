import { useEffect, useRef } from "react";

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let stars = [];
    let dustParticles = [];
    let shootingStars = [];
    let nebulaTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };

    const starColors = [
      { r: 255, g: 255, b: 255 }, // white
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 180, g: 200, b: 255 }, // blue-white
      { r: 160, g: 185, b: 255 }, // blue
      { r: 255, g: 240, b: 210 }, // warm white
      { r: 255, g: 210, b: 160 }, // yellow-orange
      { r: 255, g: 180, b: 130 }, // orange
      { r: 255, g: 150, b: 120 }, // red-orange
    ];

    const createStars = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      stars = [];
      dustParticles = [];

      const count = Math.floor((w * h) / 1800);
      for (let i = 0; i < count; i++) {
        const layer = Math.random();
        let radius, brightness, speed;
        if (layer < 0.7) {
          radius = Math.random() * 0.8 + 0.2;
          brightness = Math.random() * 0.4 + 0.15;
          speed = Math.random() * 0.008 + 0.002;
        } else if (layer < 0.93) {
          radius = Math.random() * 1.3 + 0.5;
          brightness = Math.random() * 0.5 + 0.4;
          speed = Math.random() * 0.015 + 0.005;
        } else {
          radius = Math.random() * 2.2 + 1;
          brightness = Math.random() * 0.3 + 0.7;
          speed = Math.random() * 0.025 + 0.01;
        }

        const color = starColors[Math.floor(Math.random() * starColors.length)];

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          baseBrightness: brightness,
          twinkleSpeed: speed,
          twinkleOffset: Math.random() * Math.PI * 2,
          color,
          hasDiffraction: radius > 1.2,
        });
      }

      const dustCount = Math.floor((w * h) / 8000);
      for (let i = 0; i < dustCount; i++) {
        dustParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 30 + 10,
          opacity: Math.random() * 0.03 + 0.01,
          driftX: (Math.random() - 0.5) * 0.02,
          driftY: (Math.random() - 0.5) * 0.01,
          color: Math.random() > 0.5
            ? { r: 100 + Math.random() * 40, g: 80 + Math.random() * 40, b: 160 + Math.random() * 60 }
            : { r: 60 + Math.random() * 40, g: 40 + Math.random() * 40, b: 100 + Math.random() * 80 },
        });
      }
    };

    const createShootingStar = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (shootingStars.length < 3 && Math.random() < 0.006) {
        const angle = Math.random() * 0.5 + 0.15;
        const fromLeft = Math.random() > 0.5;
        shootingStars.push({
          x: fromLeft ? Math.random() * w * 0.3 : Math.random() * w * 0.6 + w * 0.3,
          y: Math.random() * h * 0.35,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 6 + 5,
          angle,
          opacity: 1,
          decay: Math.random() * 0.006 + 0.004,
          headSize: Math.random() * 2.5 + 1.5,
        });
      }
    };

    const drawNebula = (time) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const drift = Math.sin(time * 0.0001) * 20;

      const nebulae = [
        { cx: w * 0.15 + drift, cy: h * 0.25, r: w * 0.35, color1: "rgba(40, 10, 80, 0.12)", color2: "rgba(20, 5, 60, 0.06)" },
        { cx: w * 0.8 - drift, cy: h * 0.6, r: w * 0.4, color1: "rgba(15, 30, 80, 0.1)", color2: "rgba(5, 10, 40, 0.04)" },
        { cx: w * 0.5, cy: h * 0.85, r: w * 0.5, color1: "rgba(50, 15, 45, 0.08)", color2: "rgba(0, 0, 0, 0)" },
        { cx: w * 0.9, cy: h * 0.15, r: w * 0.25, color1: "rgba(10, 40, 70, 0.07)", color2: "rgba(0, 0, 0, 0)" },
      ];

      for (const n of nebulae) {
        const g = ctx.createRadialGradient(n.cx, n.cy, 0, n.cx, n.cy, n.r);
        g.addColorStop(0, n.color1);
        g.addColorStop(0.6, n.color2);
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      const bandX = w * 0.7 + Math.sin(time * 0.00008) * 30;
      const band = ctx.createLinearGradient(bandX - w * 0.4, 0, bandX + w * 0.4, h);
      band.addColorStop(0, "rgba(0, 0, 0, 0)");
      band.addColorStop(0.3, "rgba(60, 40, 100, 0.04)");
      band.addColorStop(0.5, "rgba(80, 50, 120, 0.06)");
      band.addColorStop(0.7, "rgba(60, 40, 100, 0.04)");
      band.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = band;
      ctx.fillRect(0, 0, w, h);
    };

    const drawDust = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const d of dustParticles) {
        d.x += d.driftX;
        d.y += d.driftY;
        if (d.x < -50) d.x = w + 50;
        if (d.x > w + 50) d.x = -50;
        if (d.y < -50) d.y = h + 50;
        if (d.y > h + 50) d.y = -50;

        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
        g.addColorStop(0, `rgba(${d.color.r}, ${d.color.g}, ${d.color.b}, ${d.opacity})`);
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(d.x - d.radius, d.y - d.radius, d.radius * 2, d.radius * 2);
      }
    };

    const draw = (time) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Deep space base
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.9);
      bg.addColorStop(0, "#080818");
      bg.addColorStop(0.3, "#050512");
      bg.addColorStop(0.7, "#030310");
      bg.addColorStop(1, "#010108");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Nebula clouds
      drawNebula(time);

      // Cosmic dust
      drawDust();

      // Stars
      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.35 + 0.65;
        const brightness = star.baseBrightness * twinkle;

        if (star.hasDiffraction) {
          const glowSize = star.radius * 4;
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowSize
          );
          glow.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${brightness * 0.4})`);
          glow.addColorStop(0.3, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${brightness * 0.15})`);
          glow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(star.x - glowSize, star.y - glowSize, glowSize * 2, glowSize * 2);

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${brightness})`;
          ctx.fill();

          // Cross diffraction spikes for bright stars
          const spikeLen = star.radius * 3;
          ctx.strokeStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${brightness * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - spikeLen, star.y);
          ctx.lineTo(star.x + spikeLen, star.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - spikeLen);
          ctx.lineTo(star.x, star.y + spikeLen);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${brightness})`;
          ctx.fill();
        }
      }

      // Shooting stars
      createShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= s.decay;

        if (s.opacity <= 0 || s.x > w + 50 || s.y > h + 50) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const trailGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        trailGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        trailGrad.addColorStop(0.4, `rgba(200, 210, 255, ${s.opacity * 0.3})`);
        trailGrad.addColorStop(0.8, `rgba(230, 240, 255, ${s.opacity * 0.7})`);
        trailGrad.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glow around head
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.headSize * 4);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        headGlow.addColorStop(0.3, `rgba(180, 200, 255, ${s.opacity * 0.5})`);
        headGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = headGlow;
        ctx.fillRect(s.x - s.headSize * 4, s.y - s.headSize * 4, s.headSize * 8, s.headSize * 8);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.headSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();
      }

      nebulaTime = time;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    animationId = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      createStars();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
