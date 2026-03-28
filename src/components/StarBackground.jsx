import { useEffect, useRef } from "react";

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let stars = [];
    let shootingStars = [];
    let noiseCanvas, noiseCtx;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);

      generateNoise();
      createStars();
    };

    const generateNoise = () => {
      noiseCanvas = document.createElement("canvas");
      const w = window.innerWidth;
      const h = window.innerHeight;
      noiseCanvas.width = w;
      noiseCanvas.height = h;
      noiseCtx = noiseCanvas.getContext("2d");

      const imageData = noiseCtx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 12;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v + Math.random() * 3;
        data[i + 3] = 35;
      }
      noiseCtx.putImageData(imageData, 0, 0);
    };

    // Simplex-like noise for nebula
    const hash = (x, y) => {
      let h = x * 374761393 + y * 668265263;
      h = (h ^ (h >> 13)) * 1274126177;
      return (h ^ (h >> 16)) / 2147483648;
    };

    const smoothNoise = (x, y) => {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      const fx = x - ix;
      const fy = y - iy;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);
      const n00 = hash(ix, iy);
      const n10 = hash(ix + 1, iy);
      const n01 = hash(ix, iy + 1);
      const n11 = hash(ix + 1, iy + 1);
      const nx0 = n00 + (n10 - n00) * sx;
      const nx1 = n01 + (n11 - n01) * sx;
      return nx0 + (nx1 - nx0) * sy;
    };

    const fbm = (x, y, octaves = 4) => {
      let value = 0;
      let amplitude = 0.5;
      let frequency = 1;
      for (let i = 0; i < octaves; i++) {
        value += amplitude * smoothNoise(x * frequency, y * frequency);
        amplitude *= 0.5;
        frequency *= 2;
      }
      return value;
    };

    const createStars = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      stars = [];

      const count = Math.floor((w * h) / 600);
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        let radius, brightness;

        if (roll < 0.85) {
          radius = Math.random() * 0.4 + 0.3;
          brightness = Math.random() * 0.5 + 0.3;
        } else if (roll < 0.97) {
          radius = Math.random() * 0.7 + 0.4;
          brightness = Math.random() * 0.3 + 0.6;
        } else {
          radius = Math.random() * 1.2 + 0.7;
          brightness = Math.random() * 0.2 + 0.8;
        }

        const temp = Math.random();
        let r, g, b;
        if (temp < 0.6) {
          r = 220 + Math.random() * 35;
          g = 220 + Math.random() * 35;
          b = 230 + Math.random() * 25;
        } else if (temp < 0.8) {
          r = 170 + Math.random() * 40;
          g = 190 + Math.random() * 40;
          b = 255;
        } else if (temp < 0.92) {
          r = 255;
          g = 230 + Math.random() * 20;
          b = 180 + Math.random() * 40;
        } else {
          r = 255;
          g = 180 + Math.random() * 40;
          b = 130 + Math.random() * 50;
        }

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          baseBrightness: brightness,
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinkleOffset: Math.random() * Math.PI * 2,
          r: Math.round(r),
          g: Math.round(g),
          b: Math.round(b),
          glow: roll > 0.95,
        });
      }
    };

    const createShootingStar = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (shootingStars.length < 2 && Math.random() < 0.005) {
        const angle = Math.random() * 0.4 + 0.15;
        shootingStars.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.3,
          length: Math.random() * 100 + 60,
          speed: Math.random() * 6 + 5,
          angle,
          opacity: 1,
          decay: Math.random() * 0.005 + 0.004,
        });
      }
    };

    const drawNebula = (time) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scale = 0.002;
      const t = time * 0.00002;

      for (let y = 0; y < h; y += 6) {
        for (let x = 0; x < w; x += 6) {
          const n1 = fbm(x * scale + t, y * scale + t * 0.5, 4);
          const n2 = fbm(x * scale * 1.5 + 100 + t * 0.3, y * scale * 1.5 + 100, 3);

          const density = Math.max(0, n1 * n2 - 0.15) * 2.5;

          if (density > 0.01) {
            const region = fbm(x * scale * 0.5 + 200, y * scale * 0.5 + 200, 2);

            let r, g, b;
            if (region < 0.4) {
              r = 80;
              g = 20;
              b = 120;
            } else if (region < 0.6) {
              r = 20;
              g = 40;
              b = 130;
            } else if (region < 0.75) {
              r = 120;
              g = 30;
              b = 80;
            } else {
              r = 10;
              g = 50;
              b = 100;
            }

            const alpha = Math.min(density * 0.08, 0.12);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.fillRect(x, y, 6, 6);
          }
        }
      }
    };

    const draw = (time) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#030308";
      ctx.fillRect(0, 0, w, h);

      drawNebula(time);

      if (noiseCanvas) {
        ctx.drawImage(noiseCanvas, 0, 0);
      }

      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const a = star.baseBrightness * twinkle;

        if (star.glow) {
          const gs = star.radius * 6;
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, gs);
          glow.addColorStop(0, `rgba(${star.r},${star.g},${star.b},${a * 0.5})`);
          glow.addColorStop(0.2, `rgba(${star.r},${star.g},${star.b},${a * 0.15})`);
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, gs, 0, Math.PI * 2);
          ctx.fill();

          const sl = star.radius * 4;
          ctx.strokeStyle = `rgba(${star.r},${star.g},${star.b},${a * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - sl, star.y);
          ctx.lineTo(star.x + sl, star.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - sl);
          ctx.lineTo(star.x, star.y + sl);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.r},${star.g},${star.b},${a})`;
        ctx.fill();
      }

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

        const tx = s.x - Math.cos(s.angle) * s.length;
        const ty = s.y - Math.sin(s.angle) * s.length;

        const tg = ctx.createLinearGradient(tx, ty, s.x, s.y);
        tg.addColorStop(0, "rgba(255,255,255,0)");
        tg.addColorStop(0.5, `rgba(220,230,255,${s.opacity * 0.4})`);
        tg.addColorStop(1, `rgba(255,255,255,${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5);
        hg.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        hg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    animationId = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
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
