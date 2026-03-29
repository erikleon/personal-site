import { useEffect, useRef, useCallback } from "react";
import styles from "./EmojiRain.module.css";

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
}

interface EmojiRainProps {
  emoji: string;
  count?: number;
  duration?: number;
}

const GRAVITY = 0.35;
const BOUNCE_DAMPING = 0.6;
const FRICTION = 0.995;
const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 8;

export default function EmojiRain({ emoji, count = 40 }: EmojiRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      mouseRef.current = { x: touch.clientX, y: touch.clientY };
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = styles.particle;
      el.textContent = emoji;
      const size = 24 + Math.random() * 28;
      el.style.fontSize = `${size}px`;
      container.appendChild(el);

      particles.push({
        el,
        x: Math.random() * w,
        y: -(Math.random() * h * 0.6) - 40,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        size,
      });
    }

    particlesRef.current = particles;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    function tick() {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Physics
        p.vy += GRAVITY;
        p.vx *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Bounce off bottom
        if (p.y > h - p.size) {
          p.y = h - p.size;
          p.vy = -Math.abs(p.vy) * BOUNCE_DAMPING;
          p.rotationSpeed *= 0.8;
        }

        // Bounce off sides
        if (p.x < 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx) * BOUNCE_DAMPING;
        } else if (p.x > w - p.size) {
          p.x = w - p.size;
          p.vx = -Math.abs(p.vx) * BOUNCE_DAMPING;
        }

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [emoji, count, handleMouseMove, handleTouchMove]);

  return <div ref={containerRef} className={styles.container} />;
}
