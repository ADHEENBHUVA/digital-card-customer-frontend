import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaGlobe, FaShareAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter, FaTelegramPlane, FaMapMarkerAlt, FaEnvelope, FaQrcode, FaAddressBook, FaRegCommentDots } from 'react-icons/fa';
import BusinessHero from '../components/BusinessHero';
import DynamicGrid from '../components/DynamicGrid';
import InteractiveSwipe from '../components/InteractiveSwipe';

const PublicNfcCard = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showInquiry, setShowInquiry] = useState(false);
    const [inquiryData, setInquiryData] = useState({ name: '', mobile: '', email: '', subject: '', message: '' });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.get('preview');
        const queryParams = isPreview ? `?preview=true&_t=${Date.now()}` : `?_t=${Date.now()}`;

        fetch(`${import.meta.env.VITE_API_URL}/api/public/card/nfc/${token}${queryParams}`, {
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
    }, [token]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] text-slate-800">Loading...</div>;
    }

    if (!data || data.code) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] font-sans px-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-slate-100 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-12">
                        <FaQrcode size={28} className="-rotate-12" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">NFC Notice</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">{data?.message || 'Access Denied or Digital Card Not Found'}</p>
                </div>
            </div>
        );
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
        if (url.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${url}`;
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

    const themeColor = design.primaryColor || '#3b82f6';

    const getContrastColor = (hexcolor) => {
        if (!hexcolor) return 'dark';
        let hex = hexcolor.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(x => x + x).join('');
        }
        if (hex.length !== 6) return 'dark';
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 2), 16);
        const b = parseInt(hex.substring(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128 ? 'light-bg' : 'dark-bg';
    };

    const isLightBg = getContrastColor(footer.backgroundColor || themeColor) === 'light-bg';
    const activeFooterBg = footer.backgroundColor || themeColor;

    return (
        <div style={{ '--theme-color': themeColor, '--footer-bg': activeFooterBg, '--footer-border': `${activeFooterBg}90` }} className="min-h-screen bg-gradient-to-br from-[#eef2f6] to-[#e4e9f0] flex justify-center font-sans overflow-x-hidden">
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
                    { name: 'Call', icon: <FaPhoneAlt size={22} />, bgClass: 'bg-gradient-to-tr from-[#34C759] to-[#30d158]', url: contact.phone ? `tel:${formatPhoneURL(contact.phone)}` : '', condition: !!contact.phone },
                    { name: 'WhatsApp', icon: <FaWhatsapp size={26} />, bgClass: 'bg-gradient-to-tr from-[#25D366] to-[#43d879]', url: contact.whatsapp ? `https://wa.me/${formatWhatsAppURL(contact.whatsapp)}` : '', condition: !!contact.whatsapp },
                    { name: 'Location', iconSrc: 'https://img.icons8.com/color/96/google-maps-new.png', bgClass: 'bg-white', url: contact.maps || contact.googleMap, condition: !!(contact.maps || contact.googleMap) },
                    { name: 'Website', icon: <FaGlobe size={24} />, bgClass: 'bg-gradient-to-tr from-[#1976D2] to-[#42A5F5]', url: contact.website, condition: !!contact.website },

                    { name: 'Email', icon: <FaEnvelope size={24} />, bgClass: 'bg-gradient-to-tr from-[#0A84FF] to-[#369cff]', url: contact.email ? `mailto:${contact.email}` : '', condition: !!contact.email },

                    { name: 'Facebook', icon: <FaFacebookF size={22} />, bgClass: 'bg-gradient-to-tr from-[#1877F2] to-[#3b5998]', url: socialLinks.facebook, condition: !!socialLinks.facebook },
                    { name: 'Instagram', icon: <FaInstagram size={22} />, bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', url: socialLinks.instagram, condition: !!socialLinks.instagram },
                    { name: 'LinkedIn', icon: <FaLinkedinIn size={22} />, bgClass: 'bg-gradient-to-tr from-[#0077b5] to-[#005582]', url: socialLinks.linkedin, condition: !!socialLinks.linkedin },
                    { name: 'YouTube', icon: <FaYoutube size={22} />, bgClass: 'bg-gradient-to-tr from-[#FF0000] to-[#c4302b]', url: socialLinks.youtube, condition: !!socialLinks.youtube },
                    { name: 'Twitter', icon: <FaTwitter size={22} />, bgClass: 'bg-gradient-to-tr from-[#1DA1F2] to-[#1a91da]', url: socialLinks.twitter, condition: !!socialLinks.twitter },
                    { name: 'Telegram', icon: <FaTelegramPlane size={22} />, bgClass: 'bg-gradient-to-tr from-[#0088cc] to-[#0077b5]', url: socialLinks.telegram, condition: !!socialLinks.telegram },

                    { name: 'QrCode', icon: <FaQrcode size={24} />, bgClass: 'bg-gradient-to-tr from-[#8a2be2] to-[#9c42ed]', onClick: () => setShowQR(true), condition: true },
                    { name: 'Save Contact', icon: <FaAddressBook size={24} />, bgClass: 'bg-gradient-to-tr from-[#009688] to-[#26a69a]', onClick: generateVCard, condition: true },
                    { name: 'Share', icon: <FaShareAlt size={22} />, bgClass: 'bg-gradient-to-tr from-[#FF9500] to-[#ffa733]', onClick: handleShare, condition: true }
                ].filter(btn => btn.condition)} />

                {/* --- Interactive Swipe Carousel (Placed precisely above Footer as per request) --- */}
                <InteractiveSwipe buttons={[
                    { name: 'Profile', iconSrc: 'https://img.icons8.com/3d-fluency/94/user-male-circle.png', onClick: () => setShowProfile(true), condition: true },
                    { name: 'Call', icon: <FaPhoneAlt size={22} />, bgClass: 'bg-gradient-to-tr from-[#e53935] to-[#ff5252]', url: contact.phone ? `tel:${formatPhoneURL(contact.phone)}` : '', condition: !!contact.phone },
                    { name: 'WhatsApp', icon: <FaWhatsapp size={26} />, bgClass: 'bg-gradient-to-tr from-[#128C7E] to-[#25D366]', url: contact.whatsapp ? `https://wa.me/${formatWhatsAppURL(contact.whatsapp)}` : '', condition: !!contact.whatsapp },
                    { name: 'Email', iconSrc: 'https://img.icons8.com/3d-fluency/94/mail.png', url: contact.email ? `mailto:${contact.email}` : '', condition: !!contact.email },
                    { name: 'Website', icon: <FaGlobe size={24} />, bgClass: 'bg-gradient-to-tr from-[#1976D2] to-[#42A5F5]', url: contact.website, condition: !!contact.website },
                    { name: 'Inquiry', iconSrc: 'https://img.icons8.com/3d-fluency/94/comments.png', url: contact.inquiry, condition: !!contact.inquiry }
                ].filter(btn => btn.condition)} />

                {/* Footer and Social Overlay */}
                <div className="relative mt-auto w-full flex flex-col items-center">
                    {/* Premium Dynamic Theme Footer */}
                    <div className="bg-[var(--footer-bg)] border-t-[var(--footer-border)] text-center py-3 px-4 z-10 w-full relative mt-auto shadow-inner border-t">
                        <p className={`text-[12px] ${isLightBg ? 'text-slate-800' : 'text-white/90'} font-medium tracking-wide`}>
                            {footer.copyright || `© 2026 ${footer.businessName || hero.company || 'Appifly Infotech'}. All Rights Reserved.`}
                        </p>
                        <p className={`mt-1 text-[11px] ${isLightBg ? 'text-slate-700' : 'text-white/70'} font-normal tracking-wide`}>
                            Developed by <span className={`font-bold ${isLightBg ? 'text-slate-900' : 'text-white'} shadow-sm`}>Appifly Infotech</span>
                        </p>
                    </div>
                </div>

                {/* Premium Profile Modal Overlay */}
                {showProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setShowProfile(false)}>
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>

                        <div className="w-full max-w-[420px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col relative z-20 animate-in zoom-in-95 duration-300 ease-out max-h-[92vh]" onClick={e => e.stopPropagation()}>

                            {/* Floating Avatar & Details */}
                            <div className="relative w-full flex flex-col items-center pt-8 shrink-0 z-10 px-6">
                                {/* Profile Picture Outline */}
                                <div className="relative p-1.5 bg-slate-50 rounded-[2.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100">
                                    <img src={getMediaUrl(hero.photo || hero.logo || 'https://via.placeholder.com/150')} alt="Profile" className="w-[108px] h-[108px] rounded-[1.8rem] object-cover" />
                                </div>

                                {/* Info correctly aligned below the image */}
                                <h3 className="text-[24px] font-black text-slate-800 text-center mt-4 tracking-tight flex items-center justify-center gap-1.5">
                                    {hero.name}
                                    <img src="https://img.icons8.com/color/48/verified-badge.png" alt="Verified" className="w-[22px] h-[22px] drop-shadow-sm" />
                                </h3>

                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className="text-[12px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-xl border" style={{ color: themeColor, borderColor: `color-mix(in srgb, ${themeColor} 20%, transparent)`, backgroundColor: `color-mix(in srgb, ${themeColor} 8%, transparent)` }}>
                                        {hero.designation || 'Profile'}
                                    </span>
                                </div>

                                {hero.company && (
                                    <p className="text-[15px] text-slate-500 font-bold mt-2.5 tracking-wide flex items-center gap-1.5"><FaGlobe size={13} className="opacity-70" /> {hero.company}</p>
                                )}
                            </div>

                            <div className="px-6 pt-6 pb-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">

                                {(mainSection.about || hero.tagline) && (
                                    <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                            <FaGlobe size={64} style={{ color: themeColor }} />
                                        </div>
                                        <h4 className="text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: themeColor }}><FaGlobe size={11} /> Company Details</h4>
                                        <p className="text-[13px] text-slate-600 leading-relaxed font-semibold relative z-10">{mainSection.about || hero.tagline}</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    {contact.phone && (
                                        <a href={`tel:${formatPhoneURL(contact.phone)}`} className="group flex items-center gap-4 bg-slate-50 hover:bg-white p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex justify-center items-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                <img src="https://img.icons8.com/3d-fluency/94/phone.png" className="w-6 h-6 object-contain drop-shadow-md" alt="phone" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mobile Number</p>
                                                <p className="text-[15px] font-extrabold text-slate-800 truncate">{contact.phone}</p>
                                            </div>
                                        </a>
                                    )}

                                    {contact.email && (
                                        <a href={`mailto:${contact.email}`} className="group flex items-center gap-4 bg-slate-50 hover:bg-white p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-red-500 flex justify-center items-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                <img src="https://img.icons8.com/3d-fluency/94/mail.png" className="w-6 h-6 object-contain drop-shadow-md" alt="email" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                                <p className="text-[15px] font-extrabold text-slate-800 truncate">{contact.email}</p>
                                            </div>
                                        </a>
                                    )}

                                    {contact.website && (
                                        <a href={contact.website} target="_blank" rel="noreferrer" className="group flex items-center gap-4 bg-slate-50 hover:bg-white p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex justify-center items-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                <FaGlobe className="text-white drop-shadow-md" size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Website</p>
                                                <p className="text-[15px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 truncate">{contact.website}</p>
                                            </div>
                                        </a>
                                    )}

                                    {(hero.address || contact.address) && (
                                        <div className="group flex items-center gap-4 bg-slate-50 hover:bg-white p-3 rounded-2xl border border-slate-100 transition-all duration-300">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex justify-center items-center shadow-inner">
                                                <img src="https://img.icons8.com/3d-fluency/94/home.png" className="w-6 h-6 object-contain drop-shadow-md" alt="address" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                                                <p className="text-[14px] font-bold text-slate-700 leading-tight whitespace-pre-wrap">{hero.address || contact.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {(contact.maps || contact.googleMap) && (
                                        <a href={contact.maps || contact.googleMap || '#'} target="_blank" rel="noreferrer" className="group flex items-center gap-4 bg-slate-50 hover:bg-white p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex justify-center items-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                <img src="https://img.icons8.com/3d-fluency/94/map-marker.png" className="w-6 h-6 object-contain drop-shadow-md" alt="location" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Google Maps</p>
                                                <p className="text-[14px] font-bold text-slate-700 line-clamp-2 leading-tight">View Location on Map</p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 bg-white border-t border-slate-100 flex gap-3 shrink-0 rounded-b-[32px]">
                                <button onClick={() => setShowProfile(false)} className="px-6 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-black tracking-wide rounded-2xl transition-all shadow-sm focus:outline-none active:scale-95 text-[14px]">
                                    Close
                                </button>
                                <button onClick={generateVCard} style={{ background: `linear-gradient(135deg, ${themeColor}ee, ${themeColor})` }} className="flex-1 py-4 text-white font-black tracking-wide rounded-2xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all active:scale-95 text-[15px] flex items-center justify-center gap-2.5">
                                    <svg className="w-5 h-5 fill-current opacity-90" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg> Save Info
                                </button>
                            </div>
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
                                {data.qrCodeUrl && <img src={`${import.meta.env.VITE_API_URL}${data.qrCodeUrl}`} alt="QR Code" className="w-[200px] h-[200px] object-contain" />}
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

export default PublicNfcCard;
