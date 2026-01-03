import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/95 backdrop-blur-3xl p-8 md:p-16 rounded-3xl border-2 border-black/10 shadow-xl relative overflow-hidden text-gray-800"
            >
                {/* Background decorative blob inside the card */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                <div className="relative z-10">
                    <span className="inline-block bg-black text-white px-4 py-1 font-sketch font-bold text-sm tracking-wide uppercase mb-6 transform -rotate-1 rounded-sm shadow-md">
                        The Origin Story
                    </span>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 font-sketch tracking-tight leading-[0.9]">
                        Why does this <span className="text-blue-600 underline decoration-wavy decoration-4 underline-offset-4">exist?</span>
                    </h1>

                    <div className="prose prose-lg md:prose-xl font-sketch text-slate-800 space-y-8 leading-relaxed">
                        <p>
                            Let's be honest. Building a resume is roughly as enjoyable as stepping on a Lego brick.
                            Barefoot. In the dark.
                        </p>

                        <p>
                            I'm <span className="inline-block bg-yellow-200 px-2 transform -rotate-1 border-b-2 border-black font-bold">Shaurya Nandecha</span>,
                            and I built this because I hit my breaking point.
                        </p>

                        <p>
                            Picture this: You spend 3 hours fighting with Microsoft Word. You move one bullet point
                            a millimeter to the right, and suddenly your entire career history is on Page 3,
                            your profile picture has vanished into the void, and your cat is judging you.
                        </p>

                        <div className="bg-white/40 p-6 rounded-2xl border-l-4 border-black italic shadow-inner">
                            "Why is there a blank page specifically for my hobbies? I only have one hobby:
                            Trying to fix this margins!"
                        </div>

                        <p>
                            Then there's LaTeX. Ah, yes. Creating a document by writing code.
                            Because nothing says "I'm ready for this Marketing role" like debugging a syntax error
                            on line 402 just to make your name bold.
                        </p>

                        <p>
                            <span className="font-black text-4xl block mt-8 mb-2 text-black transform -rotate-1">Enough is enough.</span>
                        </p>

                        <p>
                            Write CV is the answer. It's the "I just want a job, not a degree in graphic design" tool.
                            You type. We format. You get hired.
                        </p>

                        <p>
                            No floating images. No margin meltdowns. Just a clean, professional PDF that makes you look
                            like you have your life together. (Even if you're currently eating cereal for dinner).
                        </p>

                        <div className="mt-12 pt-8 border-t-2 border-dashed border-black/10 text-center">
                            <p className="text-sm font-bold opacity-50 font-sans tracking-widest uppercase">
                                Built with caffeine and spite by Shaurya Nandecha.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
