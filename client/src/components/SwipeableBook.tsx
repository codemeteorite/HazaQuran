'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';

interface SwipeableBookProps {
    pages: React.ReactNode[];
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function SwipeableBook({ pages, currentPage, onPageChange }: SwipeableBookProps) {
    const [direction, setDirection] = useState(0);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate page curl effect based on drag distance
    const rotateY = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
    const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        if (offset > threshold || velocity > 500) {
            // Swipe right - go to previous page
            if (currentPage > 0) {
                setDirection(-1);
                onPageChange(currentPage - 2);
            }
        } else if (offset < -threshold || velocity < -500) {
            // Swipe left - go to next page
            if (currentPage < pages.length - 2) {
                setDirection(1);
                onPageChange(currentPage + 2);
            }
        }
    };

    const swipeVariants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? -30 : 30,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            rotateY: direction > 0 ? 30 : -30,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const leftPage = pages[currentPage];
    const rightPage = pages[currentPage + 1];

    return (
        <div ref={containerRef} className="relative w-full" style={{ perspective: '2000px' }}>
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={swipeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        duration: 0.7,
                        ease: [0.34, 1.56, 0.64, 1],
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    style={{
                        x,
                        rotateY,
                        scale,
                        transformStyle: 'preserve-3d',
                        cursor: 'grab',
                    }}
                    whileTap={{ cursor: 'grabbing' }}
                    className="touch-pan-y select-none"
                >
                    {/* Book Spine Shadow */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-amber-900/10 via-amber-900/20 to-amber-900/10 dark:from-amber-950/30 dark:via-amber-950/50 dark:to-amber-950/30 blur-sm z-10 pointer-events-none" />

                    <div className="grid grid-cols-2 gap-0">
                        {/* Left Page */}
                        <motion.div
                            className="relative bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900/80 dark:to-amber-950/20 border-r-4 border-amber-900/20 dark:border-amber-900/40 shadow-2xl"
                            style={{
                                transformStyle: 'preserve-3d',
                                transformOrigin: 'right center',
                            }}
                        >
                            {leftPage}
                        </motion.div>

                        {/* Right Page */}
                        <motion.div
                            className="relative bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900/80 dark:to-amber-950/20 border-l-4 border-amber-900/20 dark:border-amber-900/40 shadow-2xl"
                            style={{
                                transformStyle: 'preserve-3d',
                                transformOrigin: 'left center',
                            }}
                        >
                            {rightPage}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Swipe Hint Indicator */}
            {currentPage === 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 1.5,
                        repeat: 3,
                        repeatType: 'reverse',
                    }}
                    className="absolute right-4  top-1/2 -translate-y-1/2 text-amber-500/50 dark:text-amber-400/50 pointer-events-none"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </motion.div>
            )}
        </div>
    );
}
