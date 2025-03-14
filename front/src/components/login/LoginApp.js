import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import MemberInfoPage from './MemberInfoPage';

function LoginApp() {
    return (
        <>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/member-info" element={<MemberInfoPage />} />
                </Routes>
            </div>
        </>
    );
}

export default LoginApp;
