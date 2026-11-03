import React from 'react';
import { useNavigate } from 'react-router-dom';
import './mainPage.css';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <main 
      className="main-page-container relative w-full h-screen bg-cover bg-center flex items-center justify-center p-4"
    >
      {/* 3개 버튼 세로 그룹 (MainButton) */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[320px]">
        {/* 1. Profile 버튼 */}
        <button
          onClick={() => navigate('/profile')}
          className="w-full h-[64px] rounded-2xl bg-white/30 
                     text-gray-900 font-bold text-lg backdrop-blur-md 
                     hover:bg-white/50 active:scale-95 transition-all shadow-lg"
        >
          Profile
        </button>

        {/* 2. Experience 버튼 */}
        <button
          onClick={() => navigate('/experience')}
          className="w-full h-[64px] rounded-2xl bg-white/30
                     text-gray-900 font-bold text-lg backdrop-blur-md 
                     hover:bg-white/50 active:scale-95 transition-all shadow-lg"
        >
          Experience
        </button>

        {/* 3. GuestBook 버튼 */}
        <button
          onClick={() => navigate('/guestbook')}
          className="w-full h-[64px] rounded-2xl bg-white/30 
                     text-gray-900 font-bold text-lg backdrop-blur-md 
                     hover:bg-white/50 active:scale-95 transition-all shadow-lg"
        >
          GuestBook
        </button>

        {/* 4. Issue & Note 버튼 */}
        <button
          onClick={() => navigate('/issuenote')}
          className="w-full h-[64px] rounded-2xl bg-white/30
                     text-gray-900 font-bold text-lg backdrop-blur-md 
                     hover:bg-white/50 active:scale-95 transition-all shadow-lg"
        >
          Issue & Release Note
        </button>

      </div>
    </main>
  );
}