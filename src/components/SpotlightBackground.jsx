import React, { useEffect, useState } from 'react';
import { useMotionValue, useSpring, motion, useMotionTemplate } from 'framer-motion';

export default function SpotlightBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [randomRotation] = useState(() => Array(100).fill(0).map(() => Math.random() * 40 - 20));

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Words related to career/resumes
    const baseWords = [
        "HIRED", "SUCCESS", "CAREER", "RESUME", "GROWTH", "SKILLS",
        "INTERVIEW", "OFFER", "SALARY", "PROMOTION", "LEADERSHIP", "STARTUP",
        "AMBITION", "FOCUS", "WIN", "DREAM", "BUILD", "CREATE",
        "FUTURE", "DESIGN", "TECH", "MANAGER", "CEO", "FOUNDER",
        "PASSION", "WORK", "TEAM", "GOALS", "IMPACT", "VALUE",
        "CV", "JOB", "APPLY", "RECRUITER", "LINKEDIN", "NETWORK",
        "TALENT", "EXPERIENCE", "EDUCATION", "PROJECTS", "REFERENCES",
        "PORTFOLIO", "ACHIEVEMENT", "CERTIFICATION", "AWARD", "PUBLICATION",
        "VOLUNTEER", "LANGUAGE", "INTEREST", "HOBBY", "SOFT SKILLS",
        "HARD SKILLS", "CODING", "PROGRAMMING", "DEVELOPMENT", "ENGINEERING",
        "MARKETING", "SALES", "FINANCE", "OPS", "HR", "ADMIN"
    ];

    // Create a really large array to fill screen densely
    const words = Array(40).fill(baseWords).flat();
    const maskImage = useMotionTemplate`radial-gradient(circle 200px at ${springX}px ${springY}px, black, transparent 95%)`;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-slate-50">
            {/* Colorful Animated Blobs for Glassmorphism Context */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300 mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-300 mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-300 mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

            {/* Grid removed as requested */}

            {/* The Word Wall */}
            <motion.div
                className="absolute inset-0 flex flex-wrap content-center justify-center overflow-hidden opacity-10"
                style={{
                    maskImage,
                    WebkitMaskImage: maskImage
                }}
            >
                {words.map((word, i) => (
                    <span
                        key={i}
                        className="font-sketch font-bold text-black m-2 select-none text-xs md:text-sm"
                        style={{
                            transform: `rotate(${randomRotation[i % randomRotation.length]}deg)`,
                        }}
                    >
                        {word}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
