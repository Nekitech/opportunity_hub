"use client";

import { useEffect, useRef } from "react";

// Particle system: dots (sources) aggregate toward center — Three.js
export default function HeroAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let animId: number;
        let cleanup: (() => void) | undefined;

        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced) {
            // Static gradient fallback
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    grad.addColorStop(0, "#0369a1");
                    grad.addColorStop(1, "#312e81");
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }
            return;
        }

        import("three").then((THREE) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                60,
                canvas.clientWidth / canvas.clientHeight,
                0.1,
                1000
            );
            camera.position.z = 5;

            // --- Particles ---
            const COUNT = 350;
            const positions = new Float32Array(COUNT * 3);
            const targets = new Float32Array(COUNT * 3);
            const speeds = new Float32Array(COUNT);

            for (let i = 0; i < COUNT; i++) {
                const angle = (i / COUNT) * Math.PI * 2;
                const radius = 3 + Math.random() * 4;
                const sx = Math.cos(angle + Math.random() * 0.5) * radius;
                const sy = (Math.random() - 0.5) * 6;
                const sz = (Math.random() - 0.5) * 3;
                positions[i * 3] = sx;
                positions[i * 3 + 1] = sy;
                positions[i * 3 + 2] = sz;

                // Targets converge toward center with slight offset
                targets[i * 3] = (Math.random() - 0.5) * 0.4;
                targets[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
                targets[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
                speeds[i] = 0.004 + Math.random() * 0.006;
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

            const mat = new THREE.PointsMaterial({
                color: 0x7dd3fc,
                size: 0.06,
                transparent: true,
                opacity: 0.7,
                sizeAttenuation: true,
            });

            const points = new THREE.Points(geo, mat);
            scene.add(points);

            // Central glow sphere
            const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
            const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            scene.add(sphere);

            let t = 0;

            const animate = () => {
                animId = requestAnimationFrame(animate);
                t += 0.01;

                const pos = geo.attributes.position.array as Float32Array;
                for (let i = 0; i < COUNT; i++) {
                    const s = speeds[i];
                    pos[i * 3] += (targets[i * 3] - pos[i * 3]) * s;
                    pos[i * 3 + 1] += (targets[i * 3 + 1] - pos[i * 3 + 1]) * s;
                    pos[i * 3 + 2] += (targets[i * 3 + 2] - pos[i * 3 + 2]) * s;

                    // Once close to target, re-scatter
                    const dx = pos[i * 3] - targets[i * 3];
                    const dy = pos[i * 3 + 1] - targets[i * 3 + 1];
                    const dz = pos[i * 3 + 2] - targets[i * 3 + 2];
                    if (dx * dx + dy * dy + dz * dz < 0.002) {
                        const angle = Math.random() * Math.PI * 2;
                        const r = 2.5 + Math.random() * 4;
                        pos[i * 3] = Math.cos(angle) * r;
                        pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
                    }
                }
                geo.attributes.position.needsUpdate = true;

                // Gentle sphere pulse
                const pulse = 1 + Math.sin(t * 2) * 0.15;
                sphere.scale.set(pulse, pulse, pulse);

                points.rotation.y += 0.0008;
                renderer.render(scene, camera);
            };
            animate();

            const onResize = () => {
                if (!canvas) return;
                const w = canvas.clientWidth;
                const h = canvas.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h, false);
            };
            window.addEventListener("resize", onResize);

            cleanup = () => {
                cancelAnimationFrame(animId);
                window.removeEventListener("resize", onResize);
                renderer.dispose();
                geo.dispose();
                mat.dispose();
            };
        });

        return () => {
            cancelAnimationFrame(animId);
            cleanup?.();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="h-full w-full"
            style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #1e1b4b 100%)" }}
        />
    );
}
