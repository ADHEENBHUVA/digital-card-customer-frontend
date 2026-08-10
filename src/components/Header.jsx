import React from 'react';

const Header = () => {
    return (
        <div className="w-full relative shadow-md rounded-b-3xl overflow-hidden glass bg-gradient-to-br from-blue-50 to-indigo-100 pb-8">
            {/* Cover Image Placeholder */}
            <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative rounded-b-[40px] shadow-sm">
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-b-[40px]"></div>
            </div>

            {/* Profile Image & Brand Block */}
            <div className="flex flex-col items-center mt-[-60px] relative z-10 px-4">
                {/* Placeholder for Profile Logo/Avatar */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
                    <span className="text-4xl text-gray-400 font-bold">logo</span>
                </div>

                {/* Heading / Owner Name */}
                <h1 className="mt-4 text-3xl font-extrabold text-slate-800 tracking-tight text-center">
                    Appifly Infotech
                </h1>

                <p className="mt-2 text-sm font-medium text-slate-500 tracking-wide uppercase">
                    Designing Page
                </p>
            </div>
        </div>
    );
};

export default Header;
