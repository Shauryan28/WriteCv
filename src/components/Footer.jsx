import React from 'react';
import { Twitter, Github, Mail, Heart, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full pb-8 pt-12 relative font-body text-lg z-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="wobbly-box p-8 md:p-10 relative overflow-hidden group">

                    {/* Decorative stain/highlight */}
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 relative z-10">
                        {/* Brand Section */}
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <h3 className="font-sketch text-4xl font-bold transform -rotate-2">Write CV.</h3>
                            <p className="text-slate-600 font-bold opacity-80 text-center md:text-left max-w-xs">
                                The friendly, hand-drawn resume builder for humans. No robots allowed.
                            </p>
                            <div className="flex items-center gap-2 text-sm bg-black/5 px-3 py-1 rounded-full border border-black/10">
                                <span className="font-sketch">v1.0.0</span>
                                <span className="w-1 h-1 bg-black rounded-full"></span>
                                <span className="text-green-600 font-bold">Online</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col items-center md:items-center space-y-4">
                            <h4 className="font-sketch text-xl font-bold border-b-2 border-black/10 pb-1">Sitemap</h4>
                            <nav className="flex flex-col gap-2 text-center">
                                <Link to="/" className="hover:text-black hover:scale-105 hover:font-bold transition-all transform hover:-rotate-1">Home Page</Link>
                                <Link to="/build" className="hover:text-black hover:scale-105 hover:font-bold transition-all transform hover:rotate-1">Build Resume</Link>
                                <Link to="/about" className="hover:text-black hover:scale-105 hover:font-bold transition-all transform hover:-rotate-1">About Project</Link>
                            </nav>
                        </div>

                        {/* Connect & Creator */}
                        <div className="flex flex-col items-center md:items-end space-y-6">
                            <div className="flex gap-4">
                                <SocialLink href="#" icon={<Twitter size={20} />} label="Twitter" />
                                <SocialLink href="https://github.com/shaurya-nandecha" icon={<Github size={20} />} label="GitHub" />
                                <SocialLink href="mailto:shaurya@example.com" icon={<Mail size={20} />} label="Email" />
                            </div>

                            <div className="text-right flex flex-col items-center md:items-end gap-1">
                                <p className="flex items-center gap-2 font-bold text-slate-700">
                                    Made with <Heart size={16} className="text-red-500 fill-current animate-pulse" /> by Shaurya
                                </p>
                                <p className="text-slate-400 font-sketch text-sm transform rotate-1">
                                    &copy; {new Date().getFullYear()} Open Source.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center border-2 border-black rounded-full hover:bg-black hover:text-white transition-all transform hover:-rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1"
            aria-label={label}
        >
            {icon}
        </a>
    );
}
