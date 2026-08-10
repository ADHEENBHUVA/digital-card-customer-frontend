import React from 'react';

// Math generator for exact rows specified in instructions
const getGridRows = (items) => {
    const len = items.length;
    if (len <= 4) return [items];
    if (len === 5) return [items.slice(0, 3), items.slice(3, 5)];
    if (len === 6) return [items.slice(0, 3), items.slice(3, 6)];
    if (len === 7) return [items.slice(0, 4), items.slice(4, 7)];
    if (len === 8) return [items.slice(0, 4), items.slice(4, 8)];

    // For > 8, automatically layout in chunks of 4 or 3 trying to balance.
    // Simplest logic: rows of 4 until the end.
    let rows = [];
    for (let i = 0; i < len; i += 4) {
        rows.push(items.slice(i, i + 4));
    }
    return rows;
};

const DynamicGrid = ({ buttons }) => {
    const rows = getGridRows(buttons);

    return (
        <div className="w-full flex flex-col items-center gap-y-6 pt-4 pb-8 px-2 z-10 bg-white relative rounded-t-[30px] -mt-5 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 mt-2 mb-2 uppercase">Connect With Me</h3>
            {rows.map((rowItems, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-x-3 w-full max-w-sm px-4">
                    {rowItems.map((btn, index) => {
                        const content = (
                            <div className="flex flex-col items-center cursor-pointer group w-full">
                                <div className={`relative w-[56px] h-[56px] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] ${btn.bgClass || 'bg-[#3b82f6]'} transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] active:scale-95 overflow-hidden`}>
                                    {btn.iconSrc ? (
                                        <img src={btn.iconSrc} alt={btn.name} className="w-[32px] h-[32px] object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110 relative z-10" />
                                    ) : (
                                        <div className="relative z-10 drop-shadow-sm">{btn.icon}</div>
                                    )}
                                </div>
                                <span className="text-[12px] mt-3 font-semibold tracking-wide text-slate-700 text-center leading-tight whitespace-nowrap transition-colors group-hover:text-blue-600">{btn.name}</span>
                            </div>
                        );

                        if (btn.onClick) {
                            return <button key={btn.id || index} type="button" onClick={btn.onClick} className="focus:outline-none flex-1 flex justify-center">{content}</button>;
                        }
                        return <a key={btn.id || index} href={btn.url || btn.action} target={btn.target || '_blank'} rel="noopener noreferrer" className="flex-1 flex justify-center">{content}</a>;
                    })}
                </div>
            ))}
        </div>
    );
};

export default DynamicGrid;
