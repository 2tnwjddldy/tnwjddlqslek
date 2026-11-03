import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainPage';
import ProfilePage from './pages/profilePage';
import ExperPage from './pages/ExperPage';
import GuestPage from './pages/GuestPage';
import IssueNotePage from './pages/IssueNotePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/experience" element={<ExperPage />} />
        <Route path="/guestbook" element={<GuestPage />} />
        <Route path="/issuenote" element={<IssueNotePage />} />
      </Routes>
    </Router>
  );
}

