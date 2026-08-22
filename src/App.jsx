import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PublicNfcCard from './pages/PublicNfcCard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/vishal" replace />} />
                <Route path="/card/:token" element={<PublicNfcCard />} />
                <Route path="/:slug" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
