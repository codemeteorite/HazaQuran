'use client';

import { motion } from 'framer-motion';

export default function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
    const bars = Array.from({ length: 24 }); // Reduced count for cleaner look

    return (
        <div className="flex items-center justify-center gap-[3px] h-8">
            {bars.map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1.5 bg-emerald-500/50 dark:bg-emerald-400/50 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    animate={{
                        height: isPlaying
                            ? [8, Math.random() * 24 + 8, 8]
                            : 4,
                        opacity: isPlaying ? 1 : 0.5
                    }}
                    transition={{
                        duration: 0.4 + Math.random() * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.05
                    }}
                />
            ))}
        </div>
    );
}
