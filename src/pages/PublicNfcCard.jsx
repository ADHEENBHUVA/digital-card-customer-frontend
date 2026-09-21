import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { FaPhoneAlt, FaWhatsapp, FaGlobe, FaShareAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter, FaTelegramPlane, FaMapMarkerAlt, FaEnvelope, FaQrcode, FaAddressBook, FaRegCommentDots } from 'react-icons/fa';
import BusinessHero from '../components/BusinessHero';
import DynamicGrid from '../components/DynamicGrid';
import InteractiveSwipe from '../components/InteractiveSwipe';
import { handleQRShare } from '../utils/qrShare';

const SocialIcon = ({ icon: Icon, iconSrc, label, color, iconColor = 'text-white', href, target, onClick }) => {
    const innerContent = (
        <div className="flex flex-col items-center justify-center group w-[68px]">
            <div className={`w-[54px] h-[54px] ${color} ${iconColor} rounded-[16px] flex items-center justify-center shadow-[0_10px_16px_-6px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 relative`}>
                {iconSrc ? (
                    <img src={iconSrc} alt={label} className="w-[28px] h-[28px] object-contain relative z-10" />
                ) : (
                    <Icon size={26} className="relative z-10" />
                )}
            </div>
            <span className="text-[12px] mt-2 font-bold text-[#334155] text-center tracking-tight">{label}</span>
        </div>
    );

    if (href) {
        return (
            <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="flex flex-col items-center gap-1 group">
                {innerContent}
            </a>
        );
    }

    return (
        <button onClick={onClick} className="flex flex-col items-center gap-1 group">
            {innerContent}
        </button>
    );
};

const PublicNfcCard = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showInquiry, setShowInquiry] = useState(false);
    const [inquiryData, setInquiryData] = useState({ name: '', mobile: '', email: '', subject: '', message: '' });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.get('preview');
        const queryParams = isPreview ? `?preview=true` : ``; // Removed Date.now() to allow browser caching
        
        // INSTANT LOAD: Check localStorage for cached data
        const cachedData = localStorage.getItem(`nfc_card_${token}`);
        if (cachedData) {
            try {
                setData(JSON.parse(cachedData));
            } catch(e) {}
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/public/card/nfc/${token}${queryParams}`)
            .then(res => res.json())
            .then(info => {
                if(info && !info.message) {
                    localStorage.setItem(`nfc_card_${token}`, JSON.stringify(info)); // Save to cache
                }
                setData(info);
            })
            .catch(err => {
                console.error(err);
            });
    }, [token]);

    if (!data) {
        return <div className="min-h-screen bg-gradient-to-br from-[#eef2f6] to-[#e4e9f0]"></div>;
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
        <div style={{ '--theme-color': themeColor, '--footer-bg': activeFooterBg, '--footer-border': `${activeFooterBg}90` }} className="min-h-screen sm:min-h-0 sm:py-10 bg-gradient-to-br from-[#eef2f6] to-[#e4e9f0] flex justify-center font-sans overflow-x-hidden">
            <div className="w-full max-w-[420px] bg-white sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800 shadow-[0_15px_50px_rgba(0,0,0,0.15)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.2)] relative flex flex-col min-h-screen sm:min-h-[auto] sm:overflow-hidden items-center">

                {/* Import the new BusinessHero component here and pass strictly hero config */}
                <BusinessHero hero={hero} />

                {/* About Section */}
                {mainSection.about && (
                    <div className="w-full px-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="bg-white/60 backdrop-blur-sm shadow-sm border border-white/80 rounded-2xl p-5 text-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">About</h3>
                            <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-line break-words">
                                {mainSection.about}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Action Buttons Grid */}
                <div className="w-full px-2 py-4">
                    <div className="flex flex-wrap justify-center gap-y-7">
                        {(() => {
                            const actionButtons = [
                                contact.phone && <SocialIcon icon={FaPhoneAlt} label="Call" color="bg-gradient-to-b from-[#5be169] to-[#2fd341]" href={`tel:${formatPhoneURL(contact.phone)}`} target="_top" />,
                                contact.whatsapp && <SocialIcon icon={FaWhatsapp} label="WhatsApp" color="bg-gradient-to-b from-[#5ce177] to-[#24cc54]" href={`https://wa.me/${formatWhatsAppURL(contact.whatsapp)}`} target="_top" />,
                                (contact.maps || contact.googleMap) && <SocialIcon iconSrc="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" label="Location" color="bg-white" href={contact.maps || contact.googleMap} target="_top" />,
                                contact.website && <SocialIcon icon={FaGlobe} label="Website" color="bg-gradient-to-b from-[#42a2f4] to-[#1e76d7]" href={contact.website} target="_top" />,
                                contact.email && <SocialIcon icon={FaEnvelope} label="Email" color="bg-gradient-to-b from-[#42a2f4] to-[#1e76d7]" href={`mailto:${contact.email}`} target="_top" />,
                                socialLinks.facebook && <SocialIcon icon={FaFacebookF} label="Facebook" color="bg-gradient-to-b from-[#4970c6] to-[#2b4c9b]" href={socialLinks.facebook} target="_top" />,
                                socialLinks.instagram && <SocialIcon icon={FaInstagram} label="Instagram" color="bg-gradient-to-tr from-[#ffdf8a] via-[#f73752] to-[#c726a4]" href={socialLinks.instagram} target="_top" />,
                                socialLinks.linkedin && <SocialIcon icon={FaLinkedinIn} label="LinkedIn" color="bg-gradient-to-b from-[#0a81ba] to-[#046594]" href={socialLinks.linkedin} target="_top" />,
                                socialLinks.youtube && <SocialIcon icon={FaYoutube} label="YouTube" color="bg-gradient-to-b from-[#f93737] to-[#d61313]" href={socialLinks.youtube} target="_top" />,
                                socialLinks.twitter && <SocialIcon icon={FaTwitter} label="Twitter" color="bg-gradient-to-b from-[#45b7f7] to-[#1796df]" href={socialLinks.twitter} target="_top" />,
                                socialLinks.telegram && <SocialIcon icon={FaTelegramPlane} label="Telegram" color="bg-gradient-to-b from-[#1b9fe3] to-[#0d7ebd]" href={socialLinks.telegram} target="_top" />,
                                <SocialIcon icon={FaQrcode} label="QrCode" color="bg-gradient-to-b from-[#bc62f6] to-[#9132d4]" onClick={() => setShowQR(true)} />,
                                <SocialIcon icon={FaAddressBook} label="Save Contact" color="bg-gradient-to-b from-[#1dbba4] to-[#0e9682]" onClick={generateVCard} />,
                                <SocialIcon icon={FaShareAlt} label="Share" color="bg-gradient-to-b from-[#ffb43c] to-[#f48a10]" onClick={handleShare} />
                            ].filter(Boolean);

                            const total = actionButtons.length;
                            const remainder = total % 4;

                            return actionButtons.map((btn, idx) => {
                                const isLastRow = remainder !== 0 && idx >= total - remainder;
                                let widthClass = "w-[25%]";
                                if (isLastRow) {
                                    if (remainder === 1) widthClass = "w-full";
                                    if (remainder === 2) widthClass = "w-[50%]";
                                    if (remainder === 3) widthClass = "w-[33.33%]";
                                }
                                return (
                                    <div key={idx} className={`${widthClass} flex justify-center`}>
                                        {btn}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* --- Interactive Swipe Carousel (Placed precisely above Footer as per request) --- */}
                <InteractiveSwipe buttons={[
                    { name: 'Profile', iconSrc: 'https://img.icons8.com/3d-fluency/94/user-male-circle.png', onClick: () => setShowProfile(true), condition: true },
                    { name: 'Call', icon: <FaPhoneAlt size={22} />, bgClass: 'bg-gradient-to-b from-[#5be169] to-[#2fd341]', url: contact.phone ? `tel:${formatPhoneURL(contact.phone)}` : '', condition: !!contact.phone },
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
                          <div className="w-full max-w-[420px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col relative z-20 animate-in zoom-in-95 duration-300 ease-out max-h-[92vh] font-sans" onClick={e => e.stopPropagation()}>
                              
                              {/* Floating Avatar & Details */}
                              <div className="relative w-full flex flex-col items-center pt-8 shrink-0 z-10 px-6">
                                  {/* Profile Picture Outline */}
                                  <div className="relative p-1.5 bg-slate-50 rounded-[2.2rem] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100">
                                      <img src={getMediaUrl(hero.photo || hero.logo || 'https://via.placeholder.com/150')} alt="Profile" className="w-[108px] h-[108px] rounded-[1.8rem] object-cover" />
                                  </div>

                                  {/* Info correctly aligned below the image */}
                                  <h3 className="text-[22px] font-bold text-slate-800 text-center mt-5 tracking-tight flex items-center justify-center gap-1.5">
                                      {hero.name}
                                      <img src="https://img.icons8.com/color/48/verified-badge.png" alt="Verified" className="w-[20px] h-[20px] drop-shadow-sm" />
                                  </h3>

                                  <div className="flex items-center justify-center gap-2 mt-2">
                                      <span className="text-[12px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border" style={{ color: themeColor, borderColor: `color-mix(in srgb, ${themeColor} 20%, transparent)`, backgroundColor: `color-mix(in srgb, ${themeColor} 8%, transparent)` }}>
                                          {hero.designation || 'Profile'}
                                      </span>
                                  </div>

                                  {hero.company && (
                                      <p className="text-[14px] text-slate-500 font-medium mt-2.5 tracking-wide flex items-center gap-1.5"><FaGlobe size={13} className="opacity-70" /> {hero.company}</p>
                                  )}
                              </div>

                              <div className="px-6 pt-6 pb-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">

                                  {(mainSection.about || hero.tagline) && (
                                      <div className="bg-slate-50/80 rounded-[20px] p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                          <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                              <FaGlobe size={64} style={{ color: themeColor }} />
                                          </div>
                                          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: themeColor }}><FaGlobe size={11} /> Company Details</h4>
                                          <p className="text-[13px] text-slate-600 leading-relaxed font-medium relative z-10 break-words">{mainSection.about || hero.tagline}</p>
                                      </div>
                                  )}

                                  <div className="flex flex-col gap-4">
                                      {contact.phone && (
                                          <a href={`tel:${formatPhoneURL(contact.phone)}`} className="group flex items-center gap-4 bg-white p-3.5 rounded-[20px] shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] border border-slate-50 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex justify-center items-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                                  <img src="https://img.icons8.com/3d-fluency/94/phone.png" className="w-6 h-6 object-contain drop-shadow-md" alt="phone" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Mobile Number</p>
                                                  <p className="text-[15px] font-bold text-slate-800 truncate">{contact.phone}</p>
                                              </div>
                                          </a>
                                      )}

                                      {contact.email && (
                                          <a href={`mailto:${contact.email}`} className="group flex items-center gap-4 bg-white p-3.5 rounded-[20px] shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] border border-slate-50 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-red-500 flex justify-center items-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-300">
                                                  <img src="https://img.icons8.com/3d-fluency/94/mail.png" className="w-6 h-6 object-contain drop-shadow-md" alt="email" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                                  <p className="text-[15px] font-bold text-slate-800 truncate">{contact.email}</p>
                                              </div>
                                          </a>
                                      )}

                                      {contact.website && (
                                          <a href={contact.website} target="_top" rel="noreferrer" className="group flex items-center gap-4 bg-white p-3.5 rounded-[20px] shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] border border-slate-50 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex justify-center items-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                                                  <FaGlobe className="text-white drop-shadow-md" size={18} />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Website</p>
                                                  <p className="text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 truncate">{contact.website}</p>
                                              </div>
                                          </a>
                                      )}

                                      {(hero.address || contact.address) && (
                                          <div className="group flex items-center gap-4 bg-white p-3.5 rounded-[20px] shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] border border-slate-50 transition-all duration-300">
                                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex justify-center items-center shadow-md shadow-orange-500/20">
                                                  <img src="https://img.icons8.com/3d-fluency/94/home.png" className="w-6 h-6 object-contain drop-shadow-md" alt="address" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                                                  <p className="text-[14px] font-bold text-slate-700 leading-tight whitespace-pre-wrap">{hero.address || contact.address}</p>
                                              </div>
                                          </div>
                                      )}

                                      {(contact.maps || contact.googleMap) && (
                                          <a href={contact.maps || contact.googleMap || '#'} target="_top" rel="noreferrer" className="group flex items-center gap-4 bg-white p-3.5 rounded-[20px] shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] border border-slate-50 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex justify-center items-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
                                                  <img src="https://img.icons8.com/3d-fluency/94/map-marker.png" className="w-6 h-6 object-contain drop-shadow-md" alt="location" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Google Maps</p>
                                                  <p className="text-[14px] font-bold text-slate-700 line-clamp-2 leading-tight">View Location on Map</p>
                                              </div>
                                          </a>
                                      )}
                                  </div>
                              </div>

                              <div className="p-5 bg-white border-t border-slate-100 flex gap-3 shrink-0 rounded-b-[32px]">
                                  <button onClick={() => setShowProfile(false)} className="px-6 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold tracking-wide rounded-[20px] transition-all shadow-sm focus:outline-none active:scale-95 text-[14px]">
                                      Close
                                  </button>
                                  <button onClick={generateVCard} style={{ background: `linear-gradient(135deg, ${themeColor}ee, ${themeColor})` }} className="flex-1 py-4 text-white font-bold tracking-wide rounded-[20px] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.4)] hover:brightness-110 transition-all active:scale-95 text-[15px] flex items-center justify-center gap-2.5">
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

                            <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-6 flex justify-center items-center">
                                <QRCode id="qr-code-svg" value={window.location.href} size={200} bgColor="#ffffff" fgColor="#000000" />
                            </div>

                            <div className="flex w-full gap-3">
                                <button onClick={() => handleQRShare(window.location.href)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-500/20 active:scale-[0.98]">
                                    Share
                                </button>
                                <button onClick={() => setShowQR(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors active:scale-[0.98]">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicNfcCard;
