"use client";

import { useEffect, useRef } from "react";

export default function CosmicSky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createSky();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    class Star {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      isMajor = false;
      baseRadius = 0;
      alpha = 0;
      twinkleSpeed = 0;
      phase = 0;
      depth = 1;
      color = "#ffffff";
      currentAlpha = 1;
      renderX = 0;
      renderY = 0;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.isMajor = Math.random() > 0.88;
        this.baseRadius = this.isMajor ? Math.random() * 0.9 + 1.2 : Math.random() * 0.7 + 0.35;
        this.alpha = Math.random() * 0.6 + 0.3;
        this.twinkleSpeed = Math.random() * 0.015 + 0.006;
        this.phase = Math.random() * Math.PI * 2;
        this.depth = Math.random() * 1.5 + 0.5;

        this.vx = (Math.random() - 0.5) * 0.08;
        this.vy = Math.random() * 0.08 + 0.02;

        this.color = this.isMajor
          ? Math.random() > 0.5
            ? "#bae6fd"
            : "#ffffff"
          : Math.random() > 0.35
          ? "#e2e8f0"
          : "#7dd3fc";
      }

      update(offsetX: number, offsetY: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y > height + 20) this.reset(false);

        this.phase += this.twinkleSpeed;
        this.currentAlpha = this.alpha + Math.sin(this.phase) * 0.25;
        this.currentAlpha = Math.max(0.1, Math.min(1, this.currentAlpha));

        this.renderX = this.x + offsetX * this.depth;
        this.renderY = this.y + offsetY * this.depth;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.currentAlpha;

        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Cruz de luz nas estrelas maiores
        if (this.isMajor && this.currentAlpha > 0.45) {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = (this.currentAlpha - 0.35) * 0.6;

          const spike = this.baseRadius * 4.5;
          ctx.beginPath();
          ctx.moveTo(this.renderX - spike, this.renderY);
          ctx.lineTo(this.renderX + spike, this.renderY);
          ctx.moveTo(this.renderX, this.renderY - spike);
          ctx.lineTo(this.renderX, this.renderY + spike);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    class ShootingStar {
      x = 0;
      y = 0;
      len = 0;
      speed = 0;
      angle = Math.PI / 4.2;
      alpha = 1;
      active = false;

      spawn() {
        this.x = Math.random() * (width * 0.85);
        this.y = Math.random() * (height * 0.35);
        this.len = Math.random() * 110 + 80;
        this.speed = Math.random() * 14 + 14;
        this.alpha = 1;
        this.active = true;
      }

      update() {
        if (!this.active) return;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.016;

        if (this.alpha <= 0 || this.x > width + 150 || this.y > height + 150) {
          this.active = false;
        }
      }

      draw() {
        if (!this.active || !ctx) return;

        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;

        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        grad.addColorStop(0.25, `rgba(125, 211, 252, ${this.alpha * 0.7})`);
        grad.addColorStop(1, "rgba(30, 58, 138, 0)");

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.restore();
      }
    }

    const starCount = 120;
    const stars: Star[] = [];
    const shootingStar = new ShootingStar();

    function createSky() {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    }
    createSky();

    let timeoutId: NodeJS.Timeout;
    function launchShootingStar() {
      if (!shootingStar.active) {
        shootingStar.spawn();
      }
      timeoutId = setTimeout(launchShootingStar, Math.random() * 4500 + 4000);
    }
    timeoutId = setTimeout(launchShootingStar, 2500);

    function drawConstellations() {
      if (!ctx) return;
      const maxDist = 85;
      const mouseMaxDist = 130;

      ctx.save();
      ctx.lineWidth = 0.5;

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].renderX - stars[j].renderX;
          const dy = stars[i].renderY - stars[j].renderY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const factor = 1 - dist / maxDist;
            const lineAlpha = factor * 0.13 * Math.min(stars[i].currentAlpha, stars[j].currentAlpha);

            ctx.strokeStyle = `rgba(186, 230, 253, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].renderX, stars[i].renderY);
            ctx.lineTo(stars[j].renderX, stars[j].renderY);
            ctx.stroke();
          }
        }

        if (mouse.isHovered) {
          const mdx = stars[i].renderX - mouse.x;
          const mdy = stars[i].renderY - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouseMaxDist) {
            const mFactor = 1 - mdist / mouseMaxDist;
            ctx.strokeStyle = `rgba(125, 211, 252, ${mFactor * 0.28})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].renderX, stars[i].renderY);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      if (mouse.isHovered) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
        glow.addColorStop(0, "rgba(56, 189, 248, 0.12)");
        glow.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const offsetX = (mouse.x - width / 2) * -0.015;
      const offsetY = (mouse.y - height / 2) * -0.015;

      for (const star of stars) {
        star.update(offsetX, offsetY);
      }

      drawConstellations();

      for (const star of stars) {
        star.draw();
      }

      shootingStar.update();
      shootingStar.draw();

      animationFrameId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="cosmic-void" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] w-full h-full" />
    </>
  );
}