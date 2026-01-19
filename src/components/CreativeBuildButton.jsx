import React from 'react';
import { motion } from 'framer-motion';
import { PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreativeBuildButton() {
    return (
        <Link to="/build">
            <motion.button
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="relative group cursor-pointer"
            >
                {/* 1. Underlying Scribble Shadow (Static offset that reacts) */}
                <motion.div
                    className="absolute inset-0 border-2 border-black bg-black"
                    style={{
                        borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                    }}
                    variants={{
                        initial: {
                            rotate: 4,
                            x: 4,
                            y: 4,
                            opacity: 0
                        },
                        hover: {
                            rotate: 5,
                            x: 6,
                            y: 6,
                            opacity: 0.2, // Subtle shadow reveal
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                        },
                        tap: {
                            rotate: 4,
                            x: 2,
                            y: 2,
                            opacity: 0.2
                        }
                    }}
                />

                {/* 2. Main Button Layer */}
                <motion.div
                    className="absolute inset-0 bg-yellow-300 border-[3px] border-black"
                    style={{
                        borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                    }}
                    variants={{
                        initial: {
                            rotate: -2,
                            scale: 1,
                            backgroundColor: "#fef08a", // yellow-200
                        },
                        hover: {
                            rotate: 0, // Straighten up
                            scale: 1.05,
                            backgroundColor: "#fcd34d", // yellow-300
                            borderRadius: "25px 225px 25px 225px / 225px 25px 225px 25px", // Subtle shape shift
                            transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 25
                            }
                        },
                        tap: {
                            scale: 0.95,
                            rotate: -1
                        }
                    }}
                />

                {/* 3. The Content */}
                <div className="relative z-10 px-8 py-3 flex items-center gap-3">
                    <span className="font-sketch font-bold text-xl tracking-wider text-black">
                        BUILD CV
                    </span>

                    {/* Simple Tool Tip Animation */}
                    <motion.div
                        variants={{
                            hover: {
                                y: -2,
                                rotate: 15,
                                transition: { type: "spring", stiffness: 300 }
                            }
                        }}
                    >
                        <PenTool size={20} className="text-black stroke-[3]" />
                    </motion.div>
                </div>
            </motion.button>
        </Link>
    );
}
