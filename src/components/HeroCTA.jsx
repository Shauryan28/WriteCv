import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroCTA() {
    return (
        <div className="relative inline-flex flex-col md:flex-row items-center gap-6 md:gap-12 mt-6">
            {/* 1. THE BIG BUTTON */}
            <Link to="/build" className="relative z-10 group outline-none">
                <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    initial="initial"
                    className="relative outline-none cursor-pointer"
                >
                    {/* Wobble Background */}
                    <motion.div
                        className="absolute inset-0 bg-yellow-400 border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        style={{
                            borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                        variants={{
                            initial: { rotate: -2 },
                            hover: {
                                rotate: 1,
                                scale: 1.05,
                                borderRadius: [
                                    "255px 15px 225px 15px / 15px 225px 15px 255px",
                                    "25px 225px 25px 225px / 225px 25px 225px 25px",
                                    "255px 15px 225px 15px / 15px 225px 15px 255px"
                                ],
                                transition: { duration: 0.3, repeat: Infinity, repeatType: "mirror" }
                            },
                            tap: { scale: 0.95, shadow: "none", x: 4, y: 4 }
                        }}
                    />

                    {/* Content */}
                    <div className="relative px-12 py-6 flex items-center gap-4">
                        <span className="font-sketch font-black text-3xl md:text-4xl tracking-wider text-black uppercase">
                            Start Building
                        </span>
                        <motion.div
                            variants={{
                                hover: { x: 5 }
                            }}
                        >
                            <ArrowRight size={32} className="text-black stroke-[3]" />
                        </motion.div>
                    </div>

                    {/* 'FREE' Badge */}
                    <motion.div
                        className="absolute -top-6 -right-4 bg-red-500 text-white font-bold font-sketch text-lg px-3 py-1 border-2 border-black shadow-sm rotate-12 z-20"
                        variants={{
                            hover: { rotate: [12, 0, 12], scale: 1.1 }
                        }}
                    >
                        FREE!
                    </motion.div>

                    {/* Extra glitter */}
                    <motion.div
                        className="absolute -left-4 -bottom-4 text-black"
                        variants={{
                            hover: { scale: [0, 1], rotate: 180, opacity: 1 }
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                    >
                        <Sparkles size={24} />
                    </motion.div>
                </motion.button>
            </Link>

            {/* 2. THE ANNOTATION (Arrow + Text) */}
            <div className="relative md:absolute md:left-full md:top-1/2 md:-translate-y-1/2 md:ml-8 flex items-center">

                {/* Desktop Arrow: Points Left to the button */}
                <div className="hidden md:block absolute -left-20 top-1/2 -translate-y-1/2 w-20 h-16 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                            d="M 70 10 Q 40 0 5 25"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                            markerEnd="url(#arrowhead_cta)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        />
                        <defs>
                            <marker id="arrowhead_cta" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                            </marker>
                        </defs>
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center gap-2"
                >
                    <span className="text-4xl hidden md:block" role="img" aria-label="pointing">👉</span>
                    <p className="font-sketch font-bold text-xl md:text-2xl text-slate-700 rotate-2 max-w-[200px] leading-tight">
                        No sign up needed! <br />
                        <span className="text-sm font-sans font-normal text-slate-500 not-italic">(Seriously)</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
