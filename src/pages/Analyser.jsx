import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function Analyser() {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    // Simulated Analysis (since we don't have a backend parser for PDFs yet, we analyze text)
    const analyzeText = () => {
        setAnalyzing(true);
        setTimeout(() => {
            const words = text.split(/\s+/).length;
            const actionVerbs = ['managed', 'led', 'developed', 'created', 'implemented', 'optimized', 'engineered', 'analyzed', 'designed'];
            const foundVerbs = actionVerbs.filter(v => text.toLowerCase().includes(v));

            let score = 60; // Base score
            const feedback = [];
            const strengths = [];

            // Scoring Logic
            if (words > 200) { score += 10; strengths.push("Good length (200+ words)."); }
            else { score -= 10; feedback.push("Too short. Aim for 400-600 words."); }

            if (foundVerbs.length >= 3) { score += 15; strengths.push(`Used strong verbs: ${foundVerbs.slice(0, 3).join(', ')}`); }
            else { score -= 10; feedback.push("Lack of action verbs. Use words like 'Led', 'Developed'."); }

            if (text.toLowerCase().includes('email') && text.toLowerCase().includes('@')) { score += 5; }
            else { feedback.push("Contact info might be missing."); }

            // Random "ATS" check simulation
            const atsKeywords = ['teamwork', 'communication', 'leadership', 'project', 'skills', 'experience'];
            const foundKeywords = atsKeywords.filter(k => text.toLowerCase().includes(k));
            if (foundKeywords.length > 3) { score += 10; strengths.push("Good use of standard keywords."); }

            setResult({
                score: Math.min(100, Math.max(0, score)),
                grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C',
                feedback,
                strengths,
                atsScore: Math.round(score * 0.9) // slightly stricter ATS score
            });
            setAnalyzing(false);
        }, 2000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            // In a real app, we'd upload this to get parsed.
            // For now, if it's a text file, we read it. If PDF, we mock "Read successful".
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (e) => setText(e.target.result);
                reader.readAsText(file);
            } else {
                // Mock text for PDFs since we can't parse client-side easily without libs
                setText("Uploaded resume content placeholder... (Real PDF parsing requires backend service).");
            }
        }
    };

    return (
        <div className="pt-28 pb-20 min-h-screen max-w-5xl mx-auto px-4 font-hand">

            {/* Header */}
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold font-sketch text-black mb-4"
                >
                    Resume <span className="text-emerald-600 decoration-wavy underline">Health Check</span>
                </motion.h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Is your resume ready for the robots? Upload your CV or paste the text to get an instant
                    <span className="font-bold text-black border-b-2 border-yellow-300 mx-1">ATS Score</span>
                    and actionable feedback.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <div className="mb-6">
                        <label className="block font-bold text-xl mb-2 font-sketch">Option 1: Upload File</label>
                        <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors relative cursor-pointer group">
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept=".txt,.pdf" />
                            <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-black mb-2 transition-colors" />
                            <p className="text-gray-500 font-bold group-hover:text-black">{fileName || "Drop your PDF or TXT here"}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-xl mb-2 font-sketch">Option 2: Paste Text</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-48 p-4 border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-sans text-sm resize-none"
                            placeholder="Paste your entire resume content here..."
                        ></textarea>
                    </div>

                    <button
                        onClick={analyzeText}
                        disabled={!text || analyzing}
                        className="w-full py-4 bg-emerald-500 text-white font-bold font-sketch text-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {analyzing ? 'SCANNING...' : 'ANALYZE MY RESUME'}
                    </button>
                </motion.div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Report Card */}
                    {result ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(200,0,0,1)] relative rotate-1"
                        >
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-4xl font-bold font-sketch shadow-lg rotate-12 border-4 border-white">
                                {result.grade}
                            </div>

                            <h2 className="text-2xl font-bold font-sketch text-red-700 mb-4 border-b-2 border-red-100 pb-2">TEACHER'S REPORT</h2>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                                    <span className="block text-gray-500 text-xs uppercase font-bold">Overall Score</span>
                                    <span className="text-3xl font-black text-black">{result.score}/100</span>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-center">
                                    <span className="block text-yellow-700 text-xs uppercase font-bold">ATS Friendly</span>
                                    <span className="text-3xl font-black text-yellow-600">{result.atsScore}%</span>
                                </div>
                            </div>

                            <div className="space-y-4 font-hand text-lg">
                                <div>
                                    <p className="flex items-center gap-2 font-bold text-green-700 mb-1">
                                        <CheckCircle size={18} /> Strengths
                                    </p>
                                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                                        {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <p className="flex items-center gap-2 font-bold text-red-700 mb-1">
                                        <AlertTriangle size={18} /> Improvements
                                    </p>
                                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                                        {result.feedback.map((f, i) => <li key={i}>{f}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 bg-gray-50/50"
                        >
                            <FileText size={64} className="mb-4 opacity-20" />
                            <p className="text-center font-sketch text-xl">Your results will appear here...</p>
                        </motion.div>
                    )}

                    {/* Professional Review CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-black text-white p-6 rounded-lg shadow-[8px_8px_0px_0px_#FCD34D] border-2 border-black transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FCD34D] transition-all cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-400 text-black p-3 rounded-full">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-sketch text-yellow-400 mb-1">Want a Human Review?</h3>
                                <p className="text-gray-300 text-sm mb-3">
                                    software can only do so much. Get your resume reviewed by a professional top-tier recruiter.
                                </p>
                                <button className="text-black bg-white px-4 py-2 font-bold font-sketch text-sm rounded shadow hover:bg-gray-200 transition-colors uppercase">
                                    Hire a Pro ($)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
