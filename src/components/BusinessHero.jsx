import React from 'react';

const BusinessHero = ({ hero = {} }) => {
    // Helper to prefix local uploads with backend host
    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
        return url;
    };

    // Fallback gradient if no cover image is uploaded
    const fallbackBg = 'linear-gradient(135deg, #1e3a47 0%, #122630 50%, #0c181f 100%)';
    const bgStyle = hero.coverImage
        ? { backgroundImage: `url(${getMediaUrl(hero.coverImage)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: fallbackBg };

    return (
        <div className="relative w-full h-[35vh] min-h-[250px] max-h-[350px] shadow-inner flex flex-col justify-end z-0 items-center overflow-hidden">
            {/* Background Cover */}
            {(hero.coverType === 'video' && hero.coverVideo) ? (
                <video
                    src={getMediaUrl(hero.coverVideo)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            ) : (
                <div className="absolute inset-0 z-0" style={bgStyle}></div>
            )}

            {/* Glassmorphism Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#0c181f]/90 via-[#122830]/40 to-transparent z-10"></div>

            {/* Business Identity */}
            <div className="relative z-20 flex flex-col items-center pb-6 text-center w-full px-4">

                {/* Circular Glassmorphism Logo */}
                <div className="p-1 mb-4 rounded-full bg-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/30 transform transition-transform duration-300 hover:scale-105">
                    {hero.logo || hero.photo ? (
                        <img
                            src={getMediaUrl(hero.logo || hero.photo)}
                            alt="Business Logo"
                            className="w-[96px] h-[96px] rounded-full object-cover bg-white ring-2 ring-white/50"
                        />
                    ) : (
                        <div className="w-[96px] h-[96px] rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-4xl shadow-inner">
                            {hero.name?.[0] || 'A'}
                        </div>
                    )}
                </div>

                <h1 className="text-[26px] sm:text-[28px] font-bold text-white tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {hero.name}
                </h1>

                {hero.company && (
                    <p className="text-[#a4bcc7] font-medium mt-1 text-[15px] drop-shadow-md">
                        {hero.company}
                    </p>
                )}

                {hero.designation && (
                    <p className="mt-2 text-[12px] font-semibold text-[#e2eaf0] uppercase tracking-[0.15em] bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 shadow-sm inline-block">
                        {hero.designation}
                    </p>
                )}

            </div>
        </div>
    );
};

export default BusinessHero;
