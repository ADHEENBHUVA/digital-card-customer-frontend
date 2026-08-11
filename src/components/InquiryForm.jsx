import React, { useState } from 'react';

const InquiryForm = () => {
    const [formData, setFormData] = useState({
        name: '', mobile: '', email: '', subject: '', message: ''
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setStatus('Success! Your inquiry has been submitted.');
                setFormData({ name: '', mobile: '', email: '', subject: '', message: '' });
            } else {
                setStatus('Error submitting inquiry.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Error submitting inquiry.');
        }
    };

    return (
        <div className="w-full mt-8 p-6 bg-white glass rounded-3xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text" name="name" placeholder="Name" required
                    value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
                <input
                    type="tel" name="mobile" placeholder="Mobile Number" required
                    value={formData.mobile} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
                <input
                    type="email" name="email" placeholder="Email Address" required
                    value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
                <input
                    type="text" name="subject" placeholder="Subject" required
                    value={formData.subject} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
                <textarea
                    name="message" placeholder="Message" required rows="4"
                    value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none"
                ></textarea>

                <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-md transform transition active:scale-95">
                    Submit Inquiry
                </button>
                {status && <p className="text-center text-sm font-medium mt-2 text-indigo-600">{status}</p>}
            </form>
        </div>
    );
};

export default InquiryForm;
