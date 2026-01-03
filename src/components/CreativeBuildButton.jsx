import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreativeBuildButton() {
    return (
        <Link to="/build">
            <motion.button
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="relative group cursor-none" // Using cursor-none if we want custom interactions, but keeping standard for now
            >
                {/* 1. The Rough Scribble Background Layer (Absolute) */}
                <motion.div
                    className="absolute inset-0 bg-yellow-300 border-[3px] border-black"
                    style={{
                        borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                    }}
                    variants={{
                        initial: {
                            rotate: 2,
                            scale: 1,
                            backgroundColor: "#fef08a", // yellow-200
                        },
                        hover: {
                            rotate: -1,
                            scale: 1.05,
                            borderRadius: [
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                                "25px 225px 25px 225px / 225px 25px 225px 25px",
                                "255px 15px 225px 15px / 15px 225px 15px 255px"
                            ],
                            backgroundColor: "#fbbf24", // yellow-400 (darker)
                            transition: {
                                duration: 0.2, // Fast wobble
                                repeat: Infinity,
                                repeatType: "reverse"
                            }
                        },
                        tap: {
                            scale: 0.95
                        }
                    }}
                />

                {/* 2. Secondary 'Shadow' Scribble (creates depth) */}
                <motion.div
                    className="absolute inset-0 border-[3px] border-black opacity-0"
                    variants={{
                        hover: {
                            opacity: 0.3,
                            rotate: 3,
                            x: 4,
                            y: 4,
                            borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                            transition: { duration: 0.1 }
                        }
                    }}
                />

                {/* 3. The Content (Relative to sit on top) */}
                <div className="relative z-10 px-8 py-3 flex items-center gap-3">
                    <span className="font-sketch font-bold text-xl tracking-wider text-black">
                        BUILD CV
                    </span>

                    {/* Floating Icon */}
                    <motion.div
                        variants={{
                            hover: {
                                rotate: [0, -15, 15, 0],
                                scale: 1.2,
                                transition: { duration: 0.3 }
                            }
                        }}
                    >
                        <PenTool size={20} className="text-black stroke-[3]" />
                    </motion.div>
                </div>

                {/* 4. Particle Effects on Hover (Little dots flying off) */}
                <motion.div
                    className="absolute -right-2 -top-2 text-black"
                    variants={{
                        initial: { scale: 0, opacity: 0 },
                        hover: {
                            scale: 1,
                            opacity: 1,
                            rotate: 180,
                            transition: { duration: 0.4 }
                        }
                    }}
                >
                    <Sparkles size={16} />
                </motion.div>
            </motion.button>
        </Link>
    );
}
