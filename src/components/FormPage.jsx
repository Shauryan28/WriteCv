import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function FormPage({ step, data, onChange, onAdd, onRemove }) {

    // Sub-renderers based on step ID
    const renderFields = () => {
        switch (step.id) {
            case 'personal':
                return (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 gap-8">
                            <InputGroup label="They call me..." value={data.name} onChange={(v) => onChange('personal', 'name', v)} placeholder="Type your full name here" />
                            <InputGroup label="Ring me at..." value={data.phone} onChange={(v) => onChange('personal', 'phone', v)} placeholder="+1 (555) 123-4567" />
                            <InputGroup label="Send mail to..." value={data.email} onChange={(v) => onChange('personal', 'email', v)} placeholder="you@example.com" />
                            <InputGroup label="Find me online at..." value={data.linkedin} onChange={(v) => onChange('personal', 'linkedin', v)} placeholder="linkedin.com/in/you" />

                            <div className="pt-4">
                                <label className="block text-xl font-bold font-hand text-gray-500 mb-2">The short version (Summary)...</label>
                                <textarea
                                    value={data.summary}
                                    onChange={(e) => onChange('personal', 'summary', e.target.value)}
                                    className="w-full bg-transparent border-2 border-dashed border-gray-300 rounded-lg p-4 font-hand text-lg focus:border-ink focus:outline-none min-h-[150px] leading-relaxed"
                                    placeholder="Tell usage a bit about yourself..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'experience':
            case 'projects':
            case 'education':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-hand text-gray-500 italic text-lg">
                                Add your {step.title.toLowerCase()} entries below.
                            </p>
                            <button onClick={onAdd} className="bg-highlighter text-ink font-bold font-hand px-4 py-1 rounded-full border border-black shadow-sm hover:scale-105 transition-transform flex items-center gap-1">
                                <Plus size={16} /> Add New
                            </button>
                        </div>

                        {data.length === 0 && (
                            <div className="border-4 border-dotted border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-hand text-2xl rotate-1">
                                Nothing here yet... <br /> <span className="text-sm">Click the yellow button!</span>
                            </div>
                        )}

                        {data.map((item, index) => (
                            <div key={index} className="relative group border-b-2 border-dotted border-gray-300 pb-8 mb-8 last:border-0">
                                <button
                                    onClick={() => onRemove(index)}
                                    className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-2"
                                    title="Delete Entry"
                                >
                                    <Trash2 size={20} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {step.fields.map(field => (
                                        <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <InputGroup
                                                label={getLabelForField(field.name)}
                                                value={item[field.name]}
                                                onChange={(v) => onChange(step.id, field.name, v, index)}
                                                placeholder={`Enter ${field.name}...`}
                                                isTextArea={field.type === 'textarea'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'skills':
                return (
                    <div className="animate-in fade-in duration-300">
                        <label className="block text-xl font-bold font-hand text-gray-500 mb-4">What are you good at? (Comma separated)</label>
                        <textarea
                            value={data || ''}
                            onChange={(e) => onChange('skills', null, e.target.value)}
                            className="w-full bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-white border-2 border-black rounded-md p-6 font-hand text-xl leading-10 shadow-lg min-h-[300px] focus:outline-none transform -rotate-1"
                            placeholder="e.g. React, Node.js, Juggling, Rocket Science..."
                        />
                    </div>
                );

            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="w-full max-w-4xl">
            {/* The Notebook Page Container - now glassmorphic via CSS */}
            <div className="wobbly-box min-h-[600px] relative p-8 md:pl-20 md:pr-12 md:py-12">

                {/* Binding Holes */}
                <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly py-8 z-10 hidden md:flex">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-900 shadow-inner border border-gray-700"></div>
                    ))}
                </div>

                <h1 className="text-4xl font-black font-sketch mb-2 border-b-4 border-black/10 pb-4 inline-block transform -rotate-1">
                    {step.title}
                </h1>

                <div className="mt-8">
                    {renderFields()}
                </div>

            </div>
        </div>
    );
}

// Helper Components
function InputGroup({ label, value, onChange, placeholder, isTextArea }) {
    return (
        <div className="group">
            <label className="block text-lg font-bold font-hand text-gray-500 group-focus-within:text-ink transition-colors">
                {label}
            </label>
            {isTextArea ? (
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="input-conversational min-h-[100px] resize-y"
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="input-conversational"
                    placeholder={placeholder}
                />
            )}
        </div>
    );
}

function getLabelForField(fieldName) {
    const labels = {
        role: "I worked as a...",
        company: "At this cool place...",
        dates: "When did this happen?",
        details: "What did you actually do?",
        degree: "I learned about...",
        school: "At this institution...",
        year: "Class of...",
        name: "Project Name",
        description: "What did you build?",
    };
    return labels[fieldName] || fieldName;
}
