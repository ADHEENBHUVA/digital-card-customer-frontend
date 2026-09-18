import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const PublicNfcCard = lazy(() => import('./pages/PublicNfcCard'));

function App() {
    return (
        <Router>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] text-slate-500 font-medium">Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Navigate to="/vishal" replace />} />
                    <Route path="/card/:token" element={<PublicNfcCard />} />
                    <Route path="/:slug" element={<LandingPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
