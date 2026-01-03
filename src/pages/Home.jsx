import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, PenTool, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="relative min-h-screen pt-32 pb-20 overflow-hidden font-body text-slate-900">

            {/* Decorative Background Elements */}
            <div className="absolute top-40 right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            {/* Hero Section */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 mb-32 flex flex-col items-center md:items-start text-center md:text-left">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="max-w-4xl"
                >
                    <div className="inline-block mb-8 relative group cursor-pointer hover:rotate-2 transition-transform">
                        {/* Sticky Note Badge */}
                        <div className="absolute inset-0 bg-yellow-300 transform -rotate-3 border-2 border-black shadow-sm" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-yellow-400" style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}></div>
                        <span className="relative z-10 px-6 py-2 font-black font-sketch text-lg tracking-wide uppercase block transform rotate-1">
                            Version 1.0 Live! <Sparkles className="inline ml-1 mb-1" size={16} />
                        </span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black font-sketch tracking-tighter mb-8 leading-[0.9] text-gray-900 transform -rotate-1">
                        Build your CV <br />
                        <span className="relative inline-block px-2 mt-2">
                            <span className="absolute inset-0 bg-blue-400/30 transform -rotate-2 -z-10 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-blue-400" />
                            <span className="text-blue-900">the fun way.</span>
                        </span>
                    </h1>

                    <p className="text-2xl md:text-3xl text-slate-700 mb-12 max-w-2xl leading-relaxed font-bold transform rotate-1">
                        ATS-friendly? <span className="text-green-600">Check.</span> Professional? <span className="text-green-600">Check.</span> Boring? <span className="text-red-500 line-through decoration-4 decoration-black">Never.</span>
                        <br />
                        <span className="text-lg mt-4 block text-slate-500 font-normal font-sans-clean italic">Just type & print. No hidden text boxes.</span>
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <Link to="/build" className="btn-doodle btn-doodle-primary px-10 py-5 text-2xl group relative">
                            Start Building <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 border border-black shadow-sm rounded-sm">FREE!</span>
                        </Link>
                        <p className="text-lg text-slate-500 font-bold font-sketch rotate-2">
                            * No sign up needed!
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
                <div className="grid md:grid-cols-3 gap-12">
                    <FeatureCard
                        icon={<Zap size={32} />}
                        title="Lightning Fast"
                        desc="Fill in the blanks and get a PDF. Focus on content, not margins."
                        delay={0.1}
                        color="bg-yellow-100"
                        rotate="-rotate-1"
                    />
                    <FeatureCard
                        icon={<CheckCircle size={32} />}
                        title="ATS Optimized"
                        desc="Clean structure that those robot screeners absolutely love."
                        delay={0.2}
                        color="bg-green-100"
                        rotate="rotate-2"
                    />
                    <FeatureCard
                        icon={<PenTool size={32} />}
                        title="Pixel Perfect"
                        desc="Crisp typography and alignment. Looks hand-crafted, prints pro."
                        delay={0.3}
                        color="bg-purple-100"
                        rotate="-rotate-1"
                    />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc, delay, color, rotate }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring", stiffness: 50 }}
            className={`doodle-card p-8 group flex flex-col items-center text-center transform ${rotate} hover:rotate-0 hover:scale-105 hover:z-10`}
        >
            <div className={`w-20 h-20 ${color} border-2 border-black rounded-[50px_20px_60px_30px/30px_60px_20px_50px] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300`}>
                {icon}
            </div>
            <h3 className="text-2xl font-black font-sketch mb-4 decoration-wavy decoration-2 underline-offset-4 group-hover:underline">{title}</h3>
            <p className="text-slate-800 leading-relaxed text-lg font-medium">{desc}</p>
        </motion.div>
    );
}
