'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Geometric Islamic Pattern - Star
export function IslamicStar({ className = '', size = 80, color = 'currentColor' }: {
    className?: string;
    size?: number;
    color?: string;
}) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            className={className}
            initial={{ rotate: 0, opacity: 0.6 }}
            animate={{ rotate: 360, opacity: [0.3, 0.7, 0.3] }}
            transition={{
                rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            <path
                d="M50 10 L58 42 L90 42 L65 61 L73 93 L50 75 L27 93 L35 61 L10 42 L42 42 Z"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                opacity="0.4"
            />
            <circle cx="50" cy="50" r="12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
        </motion.svg>
    );
}

// Moroccan Quatrefoil Pattern
export function QuatrefoilPattern({ className = '', size = 60 }: {
    className?: string;
    size?: number;
}) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            className={className}
            animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <path
                d="M50 0 Q75 25 100 50 Q75 75 50 100 Q25 75 0 50 Q25 25 50 0 Z"
                className="fill-current opacity-20"
            />
            <path
                d="M50 20 Q65 35 80 50 Q65 65 50 80 Q35 65 20 50 Q35 35 50 20 Z"
                className="fill-current opacity-30"
            />
        </motion.svg>
    );
}

// Arabesque Curls
export function ArabesqueCurl({ className = '', color = 'currentColor' }: {
    className?: string;
    color?: string;
}) {
    return (
        <motion.svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            className={className}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        >
            <path
                d="M10 40 Q30 10, 60 40 T110 40"
                stroke={color}
                strokeWidth="2"
                fill="none"
                opacity="0.4"
            />
            <path
                d="M15 50 Q35 20, 65 50 T115 50"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                opacity="0.3"
            />
        </motion.svg>
    );
}

// Geometric Hexagon Pattern
export function HexagonPattern({ className = '' }: { className?: string }) {
    return (
        <motion.div
            className={`relative ${className}`}
            animate={{
                rotate: [0, 360],
            }}
            transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <path
                    d="M50 10 L80 30 L80 70 L50 90 L20 70 L20 30 Z"
                    className="stroke-current opacity-20"
                    strokeWidth="2"
                    fill="none"
                />
                <path
                    d="M50 25 L70 37.5 L70 62.5 L50 75 L30 62.5 L30 37.5 Z"
                    className="stroke-current opacity-30"
                    strokeWidth="1.5"
                    fill="none"
                />
                <circle cx="50" cy="50" r="8" className="fill-current opacity-25" />
            </svg>
        </motion.div>
    );
}

// Decorative Corner Flourish
export function CornerFlourish({ className = '', flip = false }: {
    className?: string;
    flip?: boolean;
}) {
    return (
        <motion.svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className={className}
            style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
        >
            <path
                d="M0 0 Q20 10, 30 0 M0 0 Q10 20, 0 30 M30 0 Q35 15, 45 10 M0 30 Q15 35, 10 45"
                className="stroke-current"
                strokeWidth="1.5"
                opacity="0.4"
            />
        </motion.svg>
    );
}

// Floating Particle Effect
export function FloatingParticles({ count = 20 }: { count?: number }) {
    const [particles, setParticles] = useState<Array<{ x: number, y: number, scale: number, duration: number, delay: number }>>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setParticles(Array.from({ length: count }).map(() => ({
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            scale: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 2
        })));
    }, [count]);

    if (!mounted || particles.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-30"
                    initial={{
                        x: p.x,
                        y: p.y,
                        scale: p.scale
                    }}
                    animate={{
                        y: [null, -20, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}
