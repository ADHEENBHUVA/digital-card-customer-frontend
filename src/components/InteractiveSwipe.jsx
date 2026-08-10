import React, { useState } from 'react';

const InteractiveSwipe = ({ buttons }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    if (!buttons || buttons.length === 0) return null;

    const minSwipeDistance = 40;

    const onTouchStart = (e) => {
        setTouchEndX(null); // Reset
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const distance = touchStartX - touchEndX;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) === buttons.length ? 0 : prev + 1);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1) < 0 ? buttons.length - 1 : prev - 1);
    };

    const renderNodes = () => {
        return buttons.map((btn, idx) => {
            let positionStr = 'hidden';

            // Circular distance calculation
            const distance = (idx - currentIndex + buttons.length) % buttons.length;

            if (distance === 0) positionStr = 'center';
            else if (distance === 1) positionStr = 'right';
            else if (distance === buttons.length - 1) positionStr = 'left';

            const isCenter = positionStr === 'center';

            let containerStyles = "flex flex-col items-center justify-center transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] absolute -translate-x-1/2 -translate-y-1/2 ";

            // Adjust vertical trajectory to create a semi-circle arch
            if (isCenter) {
                containerStyles += " left-1/2 top-[35%] scale-110 z-30 opacity-100 cursor-pointer";
            } else if (positionStr === 'left') {
                containerStyles += " left-[18%] top-[65%] scale-75 z-10 opacity-60 cursor-pointer";
            } else if (positionStr === 'right') {
                containerStyles += " left-[82%] top-[65%] scale-75 z-10 opacity-60 cursor-pointer";
            } else {
                containerStyles += " left-1/2 top-[100%] scale-0 opacity-0 -z-10 pointer-events-none";
            }

            const handleNodeClick = (e) => {
                if (isCenter) {
                    if (btn.onClick) btn.onClick(e);
                    else if (btn.url) window.open(btn.url, btn.target || '_blank');
                } else if (positionStr === 'right') {
                    handleNext();
                } else if (positionStr === 'left') {
                    handlePrev();
                }
            };

            return (
                <div key={btn.name} className={containerStyles} onClick={handleNodeClick}>
                    <div className={`relative rounded-full flex items-center justify-center text-white ${isCenter ? 'w-[72px] h-[72px] shadow-[0_15px_35px_rgba(0,0,0,0.15)]' : 'w-[56px] h-[56px] shadow-[0_5px_15px_rgba(0,0,0,0.1)]'} ${btn.bgClass || 'bg-[#3b82f6]'} transition-all duration-500`}>
                        {btn.iconSrc ? (
                            <img src={btn.iconSrc} alt={btn.name} className={`${isCenter ? 'w-[38px] h-[38px] scale-105' : 'w-[28px] h-[28px]'} object-contain drop-shadow-sm z-10 relative transition-all duration-500`} />
                        ) : (
                            <div className="relative z-10 drop-shadow-sm transition-all duration-500">{React.cloneElement(btn.icon, { size: isCenter ? 30 : 24 })}</div>
                        )}
                    </div>
                    <span className={`mt-5 font-bold tracking-wider uppercase text-[#1a2b4c] whitespace-nowrap transition-all duration-500 ${isCenter ? 'text-[14px] opacity-100 drop-shadow-sm' : 'text-[11px] opacity-0 relative top-6'}`}>
                        {btn.name}
                    </span>
                </div>
            );
        });
    };

    return (
        <div className="w-full flex-grow bg-slate-50 pt-8 pb-12 relative flex flex-col items-center border-b border-slate-200">

            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-6">Swipe for Actions</h3>

            <div
                className="w-full max-w-[420px] h-[160px] relative overflow-visible bg-transparent select-none touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Render ALL nodes to allow seamless CSS transitions when classes shift */}
                {renderNodes()}
            </div>

        </div>
    );
};

export default InteractiveSwipe;
