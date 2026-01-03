import React, { useState } from 'react';
import { FileText, Github, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="absolute inset-x-0 top-0 h-24 bg-white/90 backdrop-blur-sm border-b-2 border-black mask-image-rough z-[-1]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}></div>

            <div className="max-w-6xl mx-auto flex items-center justify-between relative">
                <Link to="/" className="flex items-center gap-2 group animate-wiggle">
                    <div className="bg-black text-white p-2 rounded-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] transform -rotate-3">
                        <FileText size={24} />
                    </div>
                    <span className="font-sketch font-bold text-3xl tracking-wide rotate-1">Write CV.</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6 text-lg font-bold font-sketch text-gray-800">
                        <Link to="/" className="hover:underline decoration-wavy decoration-2 underline-offset-4 hover:text-black transition-all rotate-1">
                            Home
                        </Link>
                        <Link to="/about" className="hover:underline decoration-wavy decoration-2 underline-offset-4 hover:text-black transition-all -rotate-1">
                            About
                        </Link>
                        <a href="https://github.com/Shauryan28/WriteCv" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-black transition-colors rotate-1 hover:scale-110">
                            <Github size={20} /> GitHub
                        </a>
                    </div>

                    <Link to="/build" className="btn-doodle btn-doodle-primary text-xl py-2 px-6 rotate-2 hover:-rotate-1">
                        Build CV
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none bg-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b-4 border-black p-6 shadow-xl md:hidden flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                    <Link to="/" className="text-xl font-bold font-sketch border-2 border-black p-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-yellow-100 transform -rotate-1" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/about" className="text-xl font-bold font-sketch border-2 border-black p-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-blue-100 transform rotate-1" onClick={() => setIsMenuOpen(false)}>
                        About
                    </Link>
                    <Link to="/build" className="btn-doodle btn-doodle-primary w-full text-center justify-center transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                        Start Building
                    </Link>
                </div>
            )}
        </nav>
    );
}
