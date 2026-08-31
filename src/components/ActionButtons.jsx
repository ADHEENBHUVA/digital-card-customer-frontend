import React, { useState } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaQrcode, FaShareAlt } from 'react-icons/fa';
import QRCode from 'react-qr-code';

const ActionButtons = () => {
    const [showQR, setShowQR] = useState(false);
    const currentUrl = window.location.href;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Appifly Infotech Digital Card',
                    text: 'Check out my digital business card!',
                    url: currentUrl,
                });
            } catch (err) {
                console.error('Error sharing', err);
            }
        } else {
            alert('Your browser does not support Web Share API');
        }
    };

    const actionButtons = [
        { name: 'Call', icon: <FaPhoneAlt />, target: 'tel:+1234567890', bg: 'bg-blue-500' },
        { name: 'WhatsApp', icon: <FaWhatsapp />, target: 'https://wa.me/1234567890', bg: 'bg-green-500' },
        { name: 'Email', icon: <FaEnvelope />, target: 'https://mail.google.com/mail/?view=cm&fs=1&to=contact@appifly.com&su=Inquiry', bg: 'bg-red-500' },
        { name: 'Website', icon: <FaGlobe />, target: 'https://www.appifly.com', bg: 'bg-indigo-500' },
        { name: 'Google Map', icon: <FaMapMarkerAlt />, target: 'https://maps.google.com/?q=Appifly+Infotech', bg: 'bg-orange-500' },
    ];

    return (
        <div className="w-full flex-col flex gap-6 mt-4 z-10 relative">
            <div className="grid grid-cols-4 gap-4 px-2">
                {actionButtons.map((btn, index) => (
                    <a
                        key={index}
                        href={btn.target}
                        target={btn.target.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${btn.bg} text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-active:scale-95`}>
                            <span className="text-xl">{btn.icon}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{btn.name}</span>
                    </a>
                ))}

                {/* QR Code Toggle Button */}
                <div onClick={() => setShowQR(true)} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-active:scale-95">
                        <span className="text-xl"><FaQrcode /></span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">QR Code</span>
                </div>

                {/* Share Button */}
                <div onClick={handleShare} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-active:scale-95">
                        <span className="text-xl"><FaShareAlt /></span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Share</span>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowQR(false)}>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 relative mx-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
                        <h2 className="text-2xl font-bold text-slate-800">Scan QR Code</h2>
                        <p className="text-sm text-slate-500 text-center mb-2">Scan this code with any camera app to open this digital card.</p>
                        <div className="p-4 bg-white border-2 border-slate-100 rounded-xl shadow-inner">
                            <QRCode value={currentUrl} size={200} level="H" />
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-2">Appifly Infotech</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionButtons;
