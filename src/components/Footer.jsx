import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    const socials = [
        { icon: <FaFacebookF />, url: 'https://facebook.com', bg: 'bg-blue-600' },
        { icon: <FaInstagram />, url: 'https://instagram.com', bg: 'bg-pink-600' },
        { icon: <FaYoutube />, url: 'https://youtube.com', bg: 'bg-red-600' },
        { icon: <FaLinkedinIn />, url: 'https://linkedin.com', bg: 'bg-blue-700' },
    ];

    return (
        <footer className="w-full mt-8 bg-slate-800 text-white rounded-t-[40px] px-6 py-10 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-6 text-center text-slate-200">
                Unlock New Possibilities : Get Your Digital Card Now!
            </h3>

            <div className="flex gap-4 mb-8">
                {socials.map((social, idx) => (
                    <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full ${social.bg} flex items-center justify-center text-xl shadow-lg transform transition hover:scale-110 active:scale-95`}
                    >
                        {social.icon}
                    </a>
                ))}
            </div>

            <div className="w-full h-px bg-slate-700 mb-6"></div>

            <p className="text-xs text-slate-400 text-center mb-1">
                &copy; {new Date().getFullYear()} All Rights Reserved.
            </p>
            <p className="text-xs font-semibold text-slate-300 text-center uppercase tracking-wider">
                Developed By : Appifly Infotech
            </p>
        </footer>
    );
};

export default Footer;
