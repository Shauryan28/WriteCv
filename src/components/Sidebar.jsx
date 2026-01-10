import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Sidebar({ steps, currentStep, setCurrentStep, error, generateCV, loading }) {

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

                {/* Rubber Stamp Print Button */}
                <div className="mt-8">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => generateCV('pdf')}
                            disabled={loading}
                            className="stamp-btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? 'Wait...' : 'PDF'}
                        </button>
                        <button
                            type="button"
                            onClick={() => generateCV('docx')}
                            disabled={loading}
                            className="stamp-btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            style={{ transform: 'rotate(1deg)', backgroundColor: '#e2e8f0' }}
                        >
                            {loading ? 'Wait...' : 'WORD'}
                        </button>
                    </div>

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
