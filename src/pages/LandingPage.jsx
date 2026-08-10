import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaGlobe, FaShareAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter, FaTelegramPlane } from 'react-icons/fa';
import BusinessHero from '../components/BusinessHero';
import DynamicGrid from '../components/DynamicGrid';
import InteractiveSwipe from '../components/InteractiveSwipe';

const LandingPage = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showInquiry, setShowInquiry] = useState(false);
    const [inquiryData, setInquiryData] = useState({ name: '', mobile: '', email: '', subject: '', message: '' });

    useEffect(() => {
        fetch(`http://localhost:5000/api/public/profile/${slug}?_t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        })
            .then(res => res.json())
            .then(info => {
                setData(info);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading || !data || data.message === 'Digital Card not found') {
        return <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] text-slate-800">{loading ? 'Loading...' : 'Digital Card Not Found'}</div>;
    }

    // Strict extraction of strictly isolated DigitalCard fields
    const hero = data.hero || {};
    const mainSection = data.mainSection || {};
    const contact = data.contact || {};
    const socialLinks = data.socialLinks || {};
    const footer = data.footer || {};
    const design = data.design || {};

    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
        return url;
    };

    const formatWhatsAppURL = (phone) => {
        if (!phone) return '';
        let cleaned = phone.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+') && cleaned.length > 0) {
            cleaned = '+91' + cleaned;
        }
        return cleaned.replace('+', '');
    };

    const formatPhoneURL = (phone) => {
        if (!phone) return '';
        let cleaned = phone.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+') && cleaned.length > 0) {
            cleaned = '+91' + cleaned;
        }
        return cleaned;
    };

    const generateVCard = () => {
        if (!data) return;
        const phone = formatPhoneURL(contact.phone);
        const email = contact.email || '';
        const website = contact.website || '';
        const companyName = hero.company || '';

        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${hero.name || 'Contact'}\nORG:${companyName}\nTEL;TYPE=WORK,VOICE:${phone}\nEMAIL;TYPE=PREF,INTERNET:${email}\nURL:${website}\nEND:VCARD`;
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${hero.name || 'Contact'}.vcf`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: hero.name || 'Digital Business Card',
                    text: mainSection.about || hero.description || '',
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            alert('Web Share not supported on this browser.');
        }
    };

    const openPopup = (name) => alert(`Opened ${name}`);

    const handleInquirySubmit = (e) => {
        e.preventDefault();
        alert('Thank you! Your inquiry has been sent successfully.');
        setShowInquiry(false);
        setInquiryData({ name: '', mobile: '', email: '', subject: '', message: '' });
    };

    const themeColor = design.primaryColor || '#3b82f6';

    return (
        <div style={{ '--theme-color': themeColor }} className="min-h-screen bg-gradient-to-br from-[#eef2f6] to-[#e4e9f0] flex justify-center font-sans overflow-x-hidden">
            <div className="w-full max-w-[420px] sm:max-w-[600px] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.08)] relative flex flex-col min-h-screen items-center">

                {/* Import the new BusinessHero component here and pass strictly hero config */}
                <BusinessHero hero={hero} />

                {/* About Section */}
                {mainSection.about && (
                    <div className="w-full px-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="bg-white/60 backdrop-blur-sm shadow-sm border border-white/80 rounded-2xl p-5 text-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">About</h3>
                            <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-line">
                                {mainSection.about}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Action Buttons Grid */}
                <DynamicGrid buttons={[
                    { name: 'Call', icon: <FaPhoneAlt size={22} />, bgClass: 'bg-gradient-to-tr from-[#e53935] to-[#ff5252]', url: contact.phone ? `tel:${formatPhoneURL(contact.phone)}` : '', condition: !!contact.phone },
                    { name: 'WhatsApp', icon: <FaWhatsapp size={26} />, bgClass: 'bg-gradient-to-tr from-[#128C7E] to-[#25D366]', url: contact.whatsapp ? `https://wa.me/${formatWhatsAppURL(contact.whatsapp)}` : '', condition: !!contact.whatsapp },
                    { name: 'Location', iconSrc: 'https://img.icons8.com/3d-fluency/94/map-marker.png', url: contact.maps || contact.googleMap, condition: !!(contact.maps || contact.googleMap) },
                    { name: 'Website', icon: <FaGlobe size={24} />, bgClass: 'bg-gradient-to-tr from-[#1976D2] to-[#42A5F5]', url: contact.website, condition: !!contact.website },

                    { name: 'Email', iconSrc: 'https://img.icons8.com/3d-fluency/94/mail.png', url: contact.email ? `mailto:${contact.email}` : '', condition: !!contact.email },

                    { name: 'Facebook', icon: <FaFacebookF size={22} />, bgClass: 'bg-gradient-to-tr from-[#1877F2] to-[#3b5998]', url: socialLinks.facebook, condition: !!socialLinks.facebook },
                    { name: 'Instagram', icon: <FaInstagram size={22} />, bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', url: socialLinks.instagram, condition: !!socialLinks.instagram },
                    { name: 'LinkedIn', icon: <FaLinkedinIn size={22} />, bgClass: 'bg-gradient-to-tr from-[#0077b5] to-[#005582]', url: socialLinks.linkedin, condition: !!socialLinks.linkedin },
                    { name: 'YouTube', icon: <FaYoutube size={22} />, bgClass: 'bg-gradient-to-tr from-[#FF0000] to-[#c4302b]', url: socialLinks.youtube, condition: !!socialLinks.youtube },
                    { name: 'Twitter', icon: <FaTwitter size={22} />, bgClass: 'bg-gradient-to-tr from-[#1DA1F2] to-[#1a91da]', url: socialLinks.twitter, condition: !!socialLinks.twitter },
                    { name: 'Telegram', icon: <FaTelegramPlane size={22} />, bgClass: 'bg-gradient-to-tr from-[#0088cc] to-[#0077b5]', url: socialLinks.telegram, condition: !!socialLinks.telegram },

                    { name: 'Profile', iconSrc: 'https://img.icons8.com/3d-fluency/94/user-male-circle.png', onClick: () => setShowProfile(true), condition: true },
                    { name: 'Inquiry', iconSrc: 'https://img.icons8.com/3d-fluency/94/comments.png', onClick: () => setShowInquiry(true), condition: true },
                    { name: 'QrCode', iconSrc: 'https://img.icons8.com/3d-fluency/94/qr-code.png', onClick: () => setShowQR(true), condition: true },
                    { name: 'Save Contact', iconSrc: 'https://img.icons8.com/3d-fluency/94/address-book.png', onClick: generateVCard, condition: true },
                    { name: 'Share', icon: <FaShareAlt size={22} />, bgClass: 'bg-gradient-to-tr from-[#3b82f6] to-[#2563eb]', onClick: handleShare, condition: true }
                ].filter(btn => btn.condition)} />

                {/* --- Interactive Swipe Carousel (Placed precisely above Footer as per request) --- */}
                <InteractiveSwipe buttons={[
                    { name: 'Profile', iconSrc: 'https://img.icons8.com/3d-fluency/94/user-male-circle.png', onClick: () => setShowProfile(true), condition: true },
                    { name: 'Call', icon: <FaPhoneAlt size={22} />, bgClass: 'bg-gradient-to-tr from-[#e53935] to-[#ff5252]', url: contact.phone ? `tel:${formatPhoneURL(contact.phone)}` : '', condition: !!contact.phone },
                    { name: 'WhatsApp', icon: <FaWhatsapp size={26} />, bgClass: 'bg-gradient-to-tr from-[#128C7E] to-[#25D366]', url: contact.whatsapp ? `https://wa.me/${formatWhatsAppURL(contact.whatsapp)}` : '', condition: !!contact.whatsapp },
                    { name: 'Email', iconSrc: 'https://img.icons8.com/3d-fluency/94/mail.png', url: contact.email ? `mailto:${contact.email}` : '', condition: !!contact.email },
                    { name: 'Website', icon: <FaGlobe size={24} />, bgClass: 'bg-gradient-to-tr from-[#1976D2] to-[#42A5F5]', url: contact.website, condition: !!contact.website },
                    { name: 'Inquiry', iconSrc: 'https://img.icons8.com/3d-fluency/94/comments.png', onClick: () => setShowInquiry(true), condition: true }
                ].filter(btn => btn.condition)} />

                {/* Footer and Social Overlay */}
                <div className="relative mt-auto w-full flex flex-col items-center">
                    {/* Premium Dynamic Theme Footer */}
                    <div style={{ backgroundColor: themeColor, borderColor: `${themeColor}90` }} className="text-center py-3 px-4 z-10 w-full relative border-t mt-auto shadow-inner">
                        <p className="text-[12px] text-white/90 font-medium tracking-wide">
                            {footer.copyright || `© 2026 ${footer.businessName || hero.company || 'Appifly Infotech'}. All Rights Reserved.`}
                        </p>
                        <p className="mt-1 text-[11px] text-white/70 font-normal tracking-wide">
                            Developed by <span className="font-bold text-white shadow-sm">Appifly Infotech</span>
                        </p>
                    </div>
                </div>

                {/* Profile Modal Overlay */}
                {showProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4" onClick={() => setShowProfile(false)}>
                        <div className="bg-white rounded-3xl p-8 max-w-[360px] w-full flex flex-col items-center shadow-2xl transform transition-all relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 w-full h-24" style={{ backgroundColor: themeColor, opacity: 0.1 }}></div>
                            <img src={getMediaUrl(hero.photo || hero.logo || 'https://via.placeholder.com/150')} alt="Profile" className="w-[100px] h-[100px] rounded-full object-cover shadow-lg border-4 border-white relative z-10 -mt-2 mb-4" />
                            <h3 className="text-2xl font-bold text-slate-800 text-center">{hero.name}</h3>
                            <p style={{ color: themeColor }} className="text-sm font-semibold tracking-wide uppercase mb-1">{hero.designation}</p>
                            <p className="text-sm text-slate-500 mb-6 font-medium">{hero.company}</p>

                            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 text-center">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">About Profile</h4>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{mainSection.about || hero.tagline || 'No profile description available.'}</p>
                            </div>

                            <button onClick={() => setShowProfile(false)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                                Close Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* Inquiry Modal Overlay */}
                {showInquiry && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4" onClick={() => setShowInquiry(false)}>
                        <div className="bg-white rounded-[24px] max-w-[400px] w-full flex flex-col shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div style={{ backgroundColor: themeColor }} className="py-5 px-6 text-white shrink-0">
                                <h3 className="text-xl font-bold tracking-tight">Send an Inquiry</h3>
                                <p className="text-sm text-white/80 mt-1">We will get back to you shortly.</p>
                            </div>
                            <style>{`
                                .theme-focus:focus {
                                    border-color: var(--theme-color) !important;
                                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-color) 20%, transparent) !important;
                                }
                            `}</style>
                            <form onSubmit={handleInquirySubmit} className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name <span className="text-red-500">*</span></label>
                                    <input required type="text" value={inquiryData.name} onChange={e => setInquiryData({ ...inquiryData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all theme-focus" placeholder="John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile <span className="text-red-500">*</span></label>
                                        <input required type="tel" value={inquiryData.mobile} onChange={e => setInquiryData({ ...inquiryData, mobile: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all theme-focus" placeholder="+1..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                                        <input type="email" value={inquiryData.email} onChange={e => setInquiryData({ ...inquiryData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all theme-focus" placeholder="@" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                                    <input type="text" value={inquiryData.subject} onChange={e => setInquiryData({ ...inquiryData, subject: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all theme-focus" placeholder="What is this regarding?" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Message</label>
                                    <textarea value={inquiryData.message} onChange={e => setInquiryData({ ...inquiryData, message: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all resize-y min-h-[100px] theme-focus" placeholder="Your message here..."></textarea>
                                </div>
                                <div className="flex items-center gap-3 mt-2 shrink-0">
                                    <button type="button" onClick={() => setShowInquiry(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">Cancel</button>
                                    <button type="submit" style={{ backgroundColor: themeColor }} className="flex-[2] py-3.5 text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all transform hover:-translate-y-0.5">Submit Inquiry</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* QR Code Modal Overlay */}
                {showQR && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowQR(false)}>
                        <div className="bg-white rounded-3xl p-8 max-w-[320px] w-full flex flex-col items-center shadow-2xl transform transition-all scale-100 opacity-100" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Scan QR Code</h3>
                            <p className="text-sm text-slate-500 mb-6 text-center">Share this card instantly by scanning the code below</p>

                            <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-6">
                                {data.qrCodeUrl && <img src={`http://localhost:5000${data.qrCodeUrl}`} alt="QR Code" className="w-[200px] h-[200px] object-contain" />}
                            </div>

                            <button onClick={() => setShowQR(false)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
