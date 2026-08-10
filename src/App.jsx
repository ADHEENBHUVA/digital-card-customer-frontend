import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/vishal" replace />} />
                <Route path="/:slug" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
