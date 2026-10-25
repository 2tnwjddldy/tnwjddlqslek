import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import profileImg from '../assets/profileImg.jpg';
import './profilePage.css';

export default function ProfilePage() {
  // 토스트 팝업 상태
  const [showToast, setShowToast] = useState(false);
  
  // 탭 상태 관리 ('education' | 'career' | 'certificate')
  const [activeTab, setActiveTab] = useState('education');

  // 전화번호 복사 함수
  const handleCopyPhone = () => {
    navigator.clipboard.writeText('010-2448-3518');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // ✏️ [수정 포인트 1] 학력 데이터 직접 수정
  const educationData = [
    {
      type: '고등학교',
      period: '2018.03 ~ 2020.02',
      name: '덕원여자고등학교',
      major: '-',
    },
    {
      type: '대학교 (전문학사)',
      period: '2021.03 ~ 2025.02',
      name: '배화여자대학교',
      major: 'SW보안융합학과',
    },
    {
      type: '대학교 (학사)',
      period: '2025.03 ~ 2026.02',
      name: '배화여자대학교',
      major: '소프트웨어공학과(공학사)',
    },
  ];

  // ✏️ [수정 포인트 2] 경력 데이터 직접 수정
  const careerData = [
    {
      name: '(주)티벨',
      period: '2024.03 ~ 재직중 (2년 7개월)',
      role: 'QA 테스트',
      position: '사원',
    },
  ];

  // ✏️ [수정 포인트 3] 자격증 데이터 직접 수정
  const certificateData = [
    {
      name: 'ISTQB Certified Tester Foundation Level (CTFL)',
      issuer: 'KSTQB',
      date: '2026.04',
    },
  ];

  return (
    <div className="profile-bg-container relative w-screen h-screen overflow-hidden flex items-center justify-center">
      <div className="profile-page-container relative w-screen h-screen overflow-hidden flex items-center justify-center">
        
        {/* 📌 [전체 박스] overflow-y-auto로 설정되어 내용이 길어지면 전체 스크롤 생성 */}
        <div className="profile-card-box">
          
          {/* 1. 상단 프로필 기본 정보 영역 */}
          <div className="flex flex-col md:flex-row items-center w-full gap-4 pb-3 border-b border-gray-200 shrink-0">
            {/* 프로필 이미지 */}
            <div className="w-[110px] h-[140px] shrink-0 overflow-hidden rounded-[0.8vw] shadow-md">
              <img 
                src={profileImg} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* 인적사항 정보 */}
            <div className="flex flex-col items-start w-full text-gray-800 font-medium text-sm gap-1">
              <div className="text-[clamp(16px,1.5vw,22px)] font-bold text-gray-900">이수정 (Lee Soo Jung)</div>
              <div className="text-white text-[13px]">🎂 2002.03.14</div>
              
              <div 
                onClick={handleCopyPhone}
                title="클릭시 복사"
                className="text-white text-[13px] cursor-pointer hover:text-blue-600 hover:underline transition-colors"
              >
                📞 010-2448-3518
              </div>
              
              <a 
                href="mailto:2tnwjddldy@gmail.com"
                title="메일 보내기"
                className="text-white text-[13px] hover:text-blue-600 hover:underline transition-colors"
              >
                ✉️ 2tnwjddldy@gmail.com
              </a>
            </div>
          </div>

          {/* ✏️ [수정 포인트 4] 한줄 소개 문구 직접 수정 */}
          <div className="w-full text-white px-3 py-2 text-xs md:text-sm font-semibold text-center shrink-0">
            💡 집요한 문제 발견과 원활한 소통으로<br/>사용자가 신뢰하는 최선의 서비스 품질을 만들어갑니다.
          </div>

          {/* 2. 하단 탭 영역 */}
          <div className="w-full flex flex-col shrink-0">
            {/* 탭 버튼 헤더 */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('education')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold transition-all ${
                  activeTab === 'education' ? 'border-b-2 border-pink-200 text-pink-700 bg-white/20' : 'text-pink-200 hover:text-pink-700'
                }`}
              >
                학력사항
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold transition-all ${
                  activeTab === 'career' ? 'border-b-2 border-pink-200 text-pink-700 bg-white/20' : 'text-pink-200 hover:text-pink-700'
                }`}
              >
                경력사항
              </button>
              <button
                onClick={() => setActiveTab('certificate')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold transition-all ${
                  activeTab === 'certificate' ? 'border-b-2 border-pink-200 text-pink-700 bg-white/20' : 'text-pink-200 hover:text-pink-700'
                }`}
              >
                자격증
              </button>
            </div>

            {/* 탭 내용 (전체 박스가 스크롤되도록 여기서 스크롤을 제거함) */}
            <div className="py-3 space-y-3 text-xs md:text-sm">
              
              {/* 학력 탭 */}
              {activeTab === 'education' && (
                <div className="space-y-3">
                  {educationData.map((edu, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-pink-300 py-1">
                      <div className="font-bold text-white">{edu.name}</div>
                      <div className="text-gray-100 text-[11px]">{edu.type} | {edu.period}</div>
                      <div className="text-gray-100 text-xs mt-0.5">전공: {edu.major}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 경력 탭 */}
              {activeTab === 'career' && (
                <div className="space-y-3">
                  {careerData.map((car, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-pink-300 py-1">
                      <div className="font-bold text-white">{car.name}</div>
                      <div className="text-gray-100 text-[11px]">{car.period}</div>
                      <div className="text-gray-100 text-xs mt-0.5">직무: {car.role} / 직책: {car.position}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 자격증 탭 */}
              {activeTab === 'certificate' && (
                <div className="space-y-3">
                  {certificateData.map((cert, idx) => (
                    <div key={idx} className="bg-white/40 backdrop-blur-sm p-2.5 rounded-lg shadow-sm">
                      <div className="font-bold text-gray-800 text-xs md:text-sm">{cert.name}</div>
                      <div className="flex justify-between text-gray-600 text-[11px] mt-1">
                        <span>발행기관: {cert.issuer}</span>
                        <span>취득일: {cert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* 토스트 팝업 */}
        <div 
          className={`absolute bottom-[10vh] left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm text-white px-[1.5vw] py-[1vh] rounded-full text-[clamp(12px,1vw,16px)] shadow-xl transition-all duration-300 pointer-events-none z-50 ${
            showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          ✅ 복사 완료
        </div>

        <BackButton />
      </div>
    </div>
  );
}