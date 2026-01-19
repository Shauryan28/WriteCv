import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, ShieldCheck, TrendingUp, Award, Target } from 'lucide-react';
import axios from 'axios';

export default function Analyser() {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);


    const analyzeText = async () => {
        setAnalyzing(true);
        try {
            // Enhanced parsing logic
            const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

            // Extract sections based on common headers
            const sections = {
                experience: [],
                education: [],
                skills: [],
                projects: []
            };

            let currentSection = null;
            let currentEntry = { details: [] };

            lines.forEach(line => {
                const lowerLine = line.toLowerCase();

                // Detect section headers
                if (lowerLine.includes('experience') || lowerLine.includes('work history')) {
                    currentSection = 'experience';
                } else if (lowerLine.includes('education') || lowerLine.includes('academic')) {
                    currentSection = 'education';
                } else if (lowerLine.includes('skills') || lowerLine.includes('technologies')) {
                    currentSection = 'skills';
                } else if (lowerLine.includes('projects') || lowerLine.includes('portfolio')) {
                    currentSection = 'projects';
                } else if (currentSection === 'experience') {
                    // Try to detect new experience entry (usually has dates or company names)
                    if (line.match(/\d{4}/) || line.match(/^\w+\s+(Inc|Corp|LLC|Ltd|Company)/i)) {
                        if (currentEntry.details.length > 0) {
                            sections.experience.push({
                                company: currentEntry.company || 'Company',
                                role: currentEntry.role || 'Position',
                                dates: currentEntry.dates || '',
                                details: currentEntry.details.join('\n')
                            });
                        }
                        currentEntry = { company: line, details: [] };
                    } else {
                        currentEntry.details.push(line);
                    }
                } else if (currentSection === 'education') {
                    sections.education.push({ school: line, degree: 'Degree', year: '' });
                } else if (currentSection === 'skills') {
                    sections.skills.push(line);
                } else if (currentSection === 'projects') {
                    sections.projects.push({ name: line, description: '' });
                }
            });

            // Add last experience entry
            if (currentEntry.details.length > 0 && currentSection === 'experience') {
                sections.experience.push({
                    company: currentEntry.company || 'Company',
                    role: currentEntry.role || 'Position',
                    dates: '',
                    details: currentEntry.details.join('\n')
                });
            }

            // Build data structure
            const resumeData = {
                personal: {
                    name: lines[0] || 'Resume Analyzed',
                    email: text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || '',
                    phone: text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || '',
                    linkedin: text.match(/linkedin\.com\/in\/[\w-]+/)?.[0] ? 'https://' + text.match(/linkedin\.com\/in\/[\w-]+/)[0] : '',
                    location: text.match(/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/)?.[0] || '',
                    summary: lines.slice(1, 4).join(' ').substring(0, 200)
                },
                experience: sections.experience.length > 0 ? sections.experience :
                    (text.length > 200 ? [{ company: 'Extracted', role: 'Position', dates: '', details: text.substring(0, 500) }] : []),
                education: sections.education.slice(0, 3),
                projects: sections.projects.slice(0, 3),
                skills: sections.skills.length > 0 ? sections.skills.join(', ') : text.substring(0, 150)
            };

            const response = await axios.post('/api/analyze', resumeData);
            setResult(response.data);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (e) => setText(e.target.result);
                reader.readAsText(file);
            } else {
                setText("Uploaded resume content placeholder...");
            }
        }
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'bg-green-600';
        if (grade.startsWith('B')) return 'bg-yellow-500';
        if (grade.startsWith('C')) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="pt-28 pb-20 min-h-screen max-w-6xl mx-auto px-4 font-hand">

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
                    Get a comprehensive <span className="font-bold text-black border-b-2 border-yellow-300 mx-1">ATS Score</span>
                    with category breakdowns and actionable feedback.
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
                    {result ? (
                        <>
                            {/* Main Score Card */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
                            >
                                <div className={`absolute -top-4 -right-4 w-20 h-20 ${getGradeColor(result.grade)} text-white rounded-full flex items-center justify-center text-4xl font-bold font-sketch shadow-lg rotate-12 border-4 border-white`}>
                                    {result.grade}
                                </div>

                                <h2 className="text-2xl font-bold font-sketch text-black mb-4 border-b-2 border-gray-200 pb-2 flex items-center gap-2">
                                    <Award /> SCORE REPORT
                                </h2>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-black text-center transform -rotate-1">
                                        <span className="block text-gray-600 text-xs uppercase font-bold mb-1">Overall Score</span>
                                        <span className={`text-4xl font-black ${getScoreColor(result.score)}`}>{result.score}/100</span>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-black text-center transform rotate-1">
                                        <span className="block text-gray-600 text-xs uppercase font-bold mb-1">ATS Score</span>
                                        <span className={`text-4xl font-black ${getScoreColor(result.atsScore)}`}>{result.atsScore}%</span>
                                    </div>
                                </div>

                                {/* Category Breakdown */}
                                {result.categories && (
                                    <div className="mb-6">
                                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                            <Target size={20} /> Category Scores
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.values(result.categories).map((cat, idx) => (
                                                <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-300">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-gray-600">{cat.title}</span>
                                                        <span className={`text-lg font-black ${getScoreColor(cat.score)}`}>{cat.score}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${cat.score >= 85 ? 'bg-green-500' : cat.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${cat.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Statistics */}
                                {result.details && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                                        <h3 className="font-bold mb-2 flex items-center gap-2">
                                            <TrendingUp size={18} /> Quick Stats
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div><span className="font-bold">{result.details.totalWords}</span> words</div>
                                            <div><span className="font-bold">{result.details.actionVerbs}</span> action verbs</div>
                                            <div><span className="font-bold">{result.details.quantifiableResults}</span> metrics</div>
                                        </div>
                                    </div>
                                )}

                                {/* Strengths */}
                                {result.strengths && result.strengths.length > 0 && (
                                    <div className="mb-4">
                                        <p className="flex items-center gap-2 font-bold text-green-700 mb-2">
                                            <CheckCircle size={18} /> Strengths
                                        </p>
                                        <ul className="list-none pl-0 text-gray-700 text-sm space-y-1">
                                            {result.strengths.map((s, i) => <li key={i} className="pl-0">{s}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Warnings */}
                                {result.warnings && result.warnings.length > 0 && (
                                    <div className="mb-4">
                                        <p className="flex items-center gap-2 font-bold text-orange-600 mb-2">
                                            <AlertTriangle size={18} /> Warnings
                                        </p>
                                        <ul className="list-none pl-0 text-gray-700 text-sm space-y-1">
                                            {result.warnings.map((w, i) => <li key={i} className="pl-0">{w}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Improvements */}
                                {result.feedback && result.feedback.length > 0 && (
                                    <div>
                                        <p className="flex items-center gap-2 font-bold text-red-700 mb-2">
                                            <AlertTriangle size={18} /> Improvements Needed
                                        </p>
                                        <ul className="list-none pl-0 text-gray-700 text-sm space-y-1">
                                            {result.feedback.map((f, i) => <li key={i} className="pl-0">{f}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        </>
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
                                    Software can only do so much. Get your resume reviewed by a professional recruiter.
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
