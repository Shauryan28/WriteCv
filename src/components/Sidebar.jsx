import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Sidebar({ steps, currentStep, setCurrentStep, error, generateCV, onAnalyze, loading }) {
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!onAnalyze) return;
        setAnalyzing(true);
        setAnalysis(null);
        try {
            const result = await onAnalyze();
            setAnalysis(result);
        } catch (err) {
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0 space-y-8">
            {/* Sticky "Sticky Note" Navigation */}
            <div className="sticky top-24">
                <motion.div
                    className="wobbly-box bg-yellow-200/30 p-6 transform -rotate-1 relative z-10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                >
                    <h2 className="text-2xl font-bold font-sketch mb-1 text-ink">CHAPTERS</h2>
                    <div className="h-2 w-24 mb-6 bg-repeat-x opacity-60" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCA0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTAgM3E1LS41IDEwIDB0MTAgMCIvPjwvc3ZnPg==')" }}></div>

                    <ul className="space-y-4">
                        {steps.map((step, index) => (
                            <li key={step.id}>
                                <button
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-full text-left font-hand text-xl px-2 py-1 transition-all ${currentStep === index
                                        ? 'bg-highlighter -rotate-1 font-bold shadow-sm'
                                        : 'hover:translate-x-1 text-gray-600 hover:text-ink'
                                        }`}
                                >
                                    {index + 1}. {step.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Analysis / Report Card Section */}
                {analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, rotate: 2 }}
                        animate={{ opacity: 1, y: 0, rotate: 2 }}
                        className="mt-6 wobbly-box bg-white p-5 border-2 border-red-500/50 shadow-lg relative"
                    >
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md rotate-12 font-sketch">
                            {analysis.grade}
                        </div>
                        <h3 className="text-red-600 font-bold font-sketch text-lg mb-2 uppercase tracking-wide">Teacher's Notes</h3>

                        {analysis.strengths.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-bold text-green-700 uppercase mb-1">Great Job:</p>
                                <ul className="list-disc pl-4 text-sm font-hand text-green-800">
                                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        )}

                        {analysis.feedback.length > 0 ? (
                            <div>
                                <p className="text-xs font-bold text-red-700 uppercase mb-1">Needs Work:</p>
                                <ul className="list-disc pl-4 text-sm font-hand text-red-800">
                                    {analysis.feedback.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-sm font-hand text-green-700">Perfect! Ready to print.</p>
                        )}
                    </motion.div>
                )}

                {/* Actions */}
                <div className="mt-8 space-y-4">
                    <button
                        onClick={analyzeCV}
                        disabled={analyzing}
                        className="w-full py-3 px-4 bg-white border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-sketch text-lg uppercase tracking-wider flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {analyzing ? (
                            <span className="animate-pulse">Grading...</span>
                        ) : (
                            <>
                                <span>📝</span> Grade My Resume
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={generateCV}
                        disabled={loading}
                        className="stamp-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'INKING...' : 'PRINT PDF'}
                    </button>

                    {error && (
                        <div className="mt-4 p-2 bg-red-100 border border-red-500 text-red-700 text-sm font-hand rotate-1">
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
