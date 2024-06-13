import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import RealEstateDashboard from './RealEstateDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<RealEstateDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
