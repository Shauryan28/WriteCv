import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import FormPage from '../components/FormPage';

const Steps = [
    {
        id: 'personal',
        title: 'Start Here',
        fields: [] // Handled custom in FormPage
    },
    {
        id: 'experience',
        title: 'Experience',
        fields: [
            { name: 'role', type: 'text' },
            { name: 'company', type: 'text' },
            { name: 'dates', type: 'text' },
            { name: 'details', type: 'textarea' }
        ]
    },
    {
        id: 'projects',
        title: 'Projects',
        fields: [
            { name: 'name', type: 'text' },
            { name: 'description', type: 'textarea' }
        ]
    },
    {
        id: 'education',
        title: 'Education',
        fields: [
            { name: 'school', type: 'text' },
            { name: 'degree', type: 'text' },
            { name: 'year', type: 'text' }
        ]
    },
    {
        id: 'skills',
        title: 'Skills',
        fields: [] // Handled custom in FormPage
    }
];

export default function Builder() {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        personal: { name: '', email: '', phone: '', linkedin: '', summary: '' },
        experience: [],
        projects: [],
        education: [],
        skills: ''
    });

    const handleChange = (section, field, value, index = null) => {
        if (index !== null) {
            // Array update
            const newArr = [...formData[section]];
            newArr[index][field] = value;
            setFormData(prev => ({ ...prev, [section]: newArr }));
        } else {
            // Direct object update
            setFormData(prev => ({
                ...prev,
                [section]: field ? { ...prev[section], [field]: value } : value // odd case for skills string
            }));
        }
    };

    const addItem = () => {
        const sectionId = Steps[currentStep].id;
        let template = {};
        if (sectionId === 'experience') template = { company: '', role: '', dates: '', details: '' };
        if (sectionId === 'projects') template = { name: '', description: '' };
        if (sectionId === 'education') template = { school: '', degree: '', year: '' };

        setFormData(prev => ({ ...prev, [sectionId]: [...prev[sectionId], template] }));
    };

    const removeItem = (index) => {
        const sectionId = Steps[currentStep].id;
        setFormData(prev => ({
            ...prev,
            [sectionId]: prev[sectionId].filter((_, i) => i !== index)
        }));
    };

    const generateCV = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${formData.personal.name || 'Resume'}.pdf`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            console.error('PDF generation error:', err);
            setError('Failed to generate PDF. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get correct data slice
    const getCurrentData = () => {
        const stepId = Steps[currentStep].id;
        return formData[stepId];
    };

    return (
        <div className="pt-24 pb-20 min-h-screen max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 font-hand">

            <Sidebar
                steps={Steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                error={error}
                generateCV={generateCV}
                loading={loading}
            />

            <main className="flex-1 min-w-0">
                <FormPage
                    step={Steps[currentStep]}
                    data={getCurrentData()}
                    onChange={handleChange}
                    onAdd={addItem}
                    onRemove={removeItem}
                />
            </main>

        </div >
    );
}
