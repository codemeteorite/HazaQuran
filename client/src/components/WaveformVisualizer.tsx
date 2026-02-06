'use client';

import { motion } from 'framer-motion';

export default function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
    const bars = Array.from({ length: 40 });

    return (
        <div className="flex items-center justify-center gap-[2px] h-8 w-full">
            {bars.map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-emerald-500/40 rounded-full"
                    animate={{
                        height: isPlaying
                            ? [10, Math.random() * 20 + 10, 10]
                            : 8
                    }}
                    transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
