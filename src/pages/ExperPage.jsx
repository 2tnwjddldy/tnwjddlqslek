import React, { useState, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import './ExperPage.css';

// 프로젝트 및 로고/스킬 이미지 임포트
import baeminImg from '../assets/baeminImg.png';
import woongjinImg from '../assets/woongjinImg.png';
import sktImg from '../assets/sktImg.png';
import sbiImg from '../assets/sbiImg.png';
import logoIcon from '../assets/icon copy.png';
import skillsImg from '../assets/skillsImg.jpg'; 

export default function ExperPage() {
  const [windows, setWindows] = useState({
    projects: { isOpen: false, zIndex: 1, x: 40, y: 40, width: 320, height: 260 },
    skills: { isOpen: false, zIndex: 1, x: 60, y: 70, width: 340, height: 320 },
    'about-qa': { isOpen: false, zIndex: 1, x: 50, y: 50, width: 350, height: 340 },
    baemin: { isOpen: false, zIndex: 1, x: 80, y: 90, width: 340, height: 320 },
    bankware: { isOpen: false, zIndex: 1, x: 90, y: 110, width: 340, height: 320 },
    woongjin: { isOpen: false, zIndex: 1, x: 100, y: 130, width: 340, height: 320 },
    skt: { isOpen: false, zIndex: 1, x: 110, y: 150, width: 340, height: 320 },
  });

  const [maxZIndex, setMaxZIndex] = useState(10);
  const containerRef = useRef(null);

  const windowsRef = useRef(windows);
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  const draggingRef = useRef(null);
  const relPosRef = useRef({ x: 0, y: 0 });

  // 팝업 포커싱 (가장 위로)
  const bringToFront = (key) => {
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [key]: { ...w[key], zIndex: nextZ },
      }));
      return nextZ;
    });
  };

  // 팝업 열기 (컨테이너 영역 안에서 안전하게 노출)
  const openWindow = (key) => {
    bringToFront(key);
    setWindows((w) => {
      const win = w[key];
      const container = containerRef.current;
      const cWidth = container ? container.clientWidth : window.innerWidth;
      const cHeight = container ? container.clientHeight : window.innerHeight;

      const safeWidth = Math.min(win.width, cWidth - 20);
      const safeHeight = Math.min(win.height, cHeight - 20);
      const safeX = Math.max(10, Math.min(win.x, cWidth - safeWidth - 10));
      const safeY = Math.max(10, Math.min(win.y, cHeight - safeHeight - 10));

      return {
        ...w,
        [key]: {
          ...win,
          isOpen: true,
          x: safeX,
          y: safeY,
          width: safeWidth,
          height: safeHeight,
        },
      };
    });
  };

  const closeWindow = (key) => {
    setWindows((w) => ({
      ...w,
      [key]: { ...w[key], isOpen: false },
    }));
  };

  // 드래그 시작 (컨테이너 내부 좌표 기준 상대 계산)
  const handleMouseDown = (e, key) => {
    if (e.target.tagName === 'BUTTON' || window.innerWidth <= 768) return;
    e.preventDefault();
    bringToFront(key);

    draggingRef.current = key;
    const currentWin = windowsRef.current[key];
    const container = containerRef.current;
    const rect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    relPosRef.current = {
      x: clientX - currentWin.x,
      y: clientY - currentWin.y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 드래그 이동 (컨테이너 영역 바깥으로 못 나가게 제한)
  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;
    const key = draggingRef.current;
    const currentWin = windowsRef.current[key];
    const container = containerRef.current;
    const rect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    let newX = clientX - relPosRef.current.x;
    let newY = clientY - relPosRef.current.y;

    const cWidth = container ? container.clientWidth : window.innerWidth;
    const cHeight = container ? container.clientHeight : window.innerHeight;

    const maxX = cWidth - currentWin.width;
    const maxY = cHeight - currentWin.height;

    newX = Math.max(0, Math.min(newX, Math.max(0, maxX)));
    newY = Math.max(0, Math.min(newY, Math.max(0, maxY)));

    setWindows((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        x: newX,
        y: newY,
      },
    }));
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={containerRef} className="exper-page-container">
      
      {/* ==================== 바탕화면 아이콘 그리드 ==================== */}
      <div className="desktop-grid">
        <div className="desktop-icon-item" onClick={() => openWindow('projects')}>
          <span className="desktop-emoji-icon">📂</span>
          <span className="desktop-icon-label">Projects</span>
        </div>

        <div className="desktop-icon-item" onClick={() => openWindow('skills')}>
          <img src={skillsImg || logoIcon} alt="Skills" className="desktop-icon-img rounded-[10px]" />
          <span className="desktop-icon-label">Skills</span>
        </div>

        <div className="desktop-icon-item" onClick={() => openWindow('about-qa')}>
          <img src={logoIcon} alt="Web Logo" className="desktop-icon-img" />
          <span className="desktop-icon-label">About QA</span>
        </div>
      </div>

      {/* ==================== [Projects] 팝업 ==================== */}
      {windows.projects.isOpen && (
        <div 
          className="desktop-window"
          style={{ 
            left: `${windows.projects.x}px`, 
            top: `${windows.projects.y}px`,
            width: `${windows.projects.width}px`,
            height: `${windows.projects.height}px`,
            zIndex: windows.projects.zIndex 
          }}
          onMouseDown={() => bringToFront('projects')}
        >
          <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, 'projects')}>
            <span>📂 Projects (경력 및 수행 업무)</span>
            <button className="window-close-btn" onClick={() => closeWindow('projects')}>X</button>
          </div>
          <div className="window-body folder-contents-grid">
            <div className="desktop-icon-item" onClick={() => openWindow('baemin')}>
              <img src={baeminImg} alt="우아한형제들" className="desktop-icon-img rounded-md" />
              <span className="desktop-icon-label text-gray-800">우아한형제들</span>
            </div>
            <div className="desktop-icon-item" onClick={() => openWindow('bankware')}>
              <img src={sbiImg} alt="SBI저축은행" className="desktop-icon-img rounded-md" />
              <span className="desktop-icon-label text-gray-800">뱅크웨어글로벌</span>
            </div>
            <div className="desktop-icon-item" onClick={() => openWindow('woongjin')}>
              <img src={woongjinImg} alt="웅진씽크빅" className="desktop-icon-img rounded-md" />
              <span className="desktop-icon-label text-gray-800">웅진씽크빅</span>
            </div>
            <div className="desktop-icon-item" onClick={() => openWindow('skt')}>
              <img src={sktImg} alt="SKT" className="desktop-icon-img rounded-md" />
              <span className="desktop-icon-label text-gray-800">SKT Open API</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== [Skills] 팝업 ==================== */}
      {windows.skills.isOpen && (
        <div 
          className="desktop-window"
          style={{ 
            left: `${windows.skills.x}px`, 
            top: `${windows.skills.y}px`,
            width: `${windows.skills.width}px`,
            height: `${windows.skills.height}px`,
            zIndex: windows.skills.zIndex 
          }}
          onMouseDown={() => bringToFront('skills')}
        >
          <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, 'skills')}>
            <span>📁 Skills & Tools</span>
            <button className="window-close-btn" onClick={() => closeWindow('skills')}>X</button>
          </div>
          <div className="window-body space-y-4">
            <div className="skills-section-container">
              <div className="skills-category-group">
                <div className="skills-category-title">🎯 결함 관리 시스템</div>
                <div className="skills-horizontal-scroll">
                  <div className="skill-badge-item">🎯 Jira</div>
                </div>
              </div>
              <div className="skills-category-group">
                <div className="skills-category-title">📮 API</div>
                <div className="skills-horizontal-scroll">
                  <div className="skill-badge-item">📮 Postman</div>
                </div>
              </div>
              <div className="skills-category-group">
                <div className="skills-category-title">💬 소통수단</div>
                <div className="skills-horizontal-scroll">
                  <div className="skill-badge-item">💬 Slack</div>
                  <div className="skill-badge-item">📧 Email</div>
                </div>
              </div>
              <div className="skills-category-group">
                <div className="skills-category-title">🛠️ 기타 도구</div>
                <div className="skills-horizontal-scroll">
                  <div className="skill-badge-item">📘 Confluence</div>
                  <div className="skill-badge-item">🔍 Charles</div>
                  <div className="skill-badge-item">💻 Visual Studio Code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== [Project 1] 우아한형제들 ==================== */}
      {windows.baemin.isOpen && (
        <div 
          className="desktop-window"
          style={{ 
            left: `${windows.baemin.x}px`, 
            top: `${windows.baemin.y}px`,
            width: `${windows.baemin.width}px`,
            height: `${windows.baemin.height}px`,
            zIndex: windows.baemin.zIndex 
          }}
          onMouseDown={() => bringToFront('baemin')}
        >
          <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, 'baemin')}>
            <span>배달의민족 (우아한형제들)</span>
            <button className="window-close-btn" onClick={() => closeWindow('baemin')}>X</button>
          </div>
          <div className="window-body space-y-3 text-xs leading-relaxed">
            <p><strong>수행 기간:</strong> 2026.04 ~ 수행 중 (6개월)</p>
            <p><strong>담당 업무:</strong><br />
            - 결제·선물하기·쿠폰 과제 참여 및 테스트 설계·수행<br />
            - Postman 활용 API 테스트 시나리오 작성 및 검증</p>
            <p><strong>성과 및 기여:</strong><br />
            - 6개월간 16개 프로젝트 투입, 유효 이슈 88건 발굴 및 개선 주도<br />
            - 쿠폰 과제 기반 Full TC 생성 참여 및 지면·상태별 상세 케이스 구축</p>
          </div>
        </div>
      )}

      {/* ==================== [Project 2] 뱅크웨어글로벌 ==================== */}
      {windows.bankware.isOpen && (
        <div 
          className="desktop-window"
          style={{ 
            left: `${windows.bankware.x}px`, 
            top: `${windows.bankware.y}px`,
            width: `${windows.bankware.width}px`,
            height: `${windows.bankware.height}px`,
            zIndex: windows.bankware.zIndex 
          }}
          onMouseDown={() => bringToFront('bankware')}
        >
          <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, 'bankware')}>
            <span>뱅크웨어글로벌 (SBI저축은행)</span>
            <button className="window-close-btn" onClick={() => closeWindow('bankware')}>X</button>
          </div>
          <div className="window-body space-y-3 text-xs leading-relaxed">
            <p><strong>수행 기간:</strong> 2026.01 ~ 2026.03 (2개월)</p>
            <p><strong>담당 업무:</strong><br />
            - 사이다뱅크 앱·모바일웹·PC웹 기획서 기반 요구사항 분석<br />
            - 조건별 이체 및 상품 가입 등 금융 보안 정책 검증 테스트 수행<br />
            - 1~3차 통합 테스트 진행 및 차수별 결함 관리</p>
            <p><strong>성과 및 기여:</strong><br />
            - 높은 결함 발견율을 인정받아 1차 단기 계약에서 2~3차 통합 테스트까지 연장 계약 체결<br />
            - 방대한 TC와 촉박한 일정 속에서도 철저한 일정 관리로 기한 내 완수</p>
          </div>
        </div>
      )}

      {/* ==================== [Project 3] 웅진씽크빅 ==================== */}
      {windows.woongjin.isOpen && (
        <div 
          className="desktop-window"
          style={{ 
            left: `${windows.woongjin.x}px`, 
            top: `${windows.woongjin.y}px`,
            width: `${windows.woongjin.width}px`,
            height: `${windows.woongjin.height}px`,
            zIndex: windows.woongjin.zIndex 
          }}
          onMouseDown={() => bringToFront('woongjin')}
        >
          <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, 'woongjin')}>
            <span>웅진씽크빅 (북클럽&스마트올)</span>
            <button className="window-close-btn" onClick={() => closeWindow('woongjin')}>X</button>
          </div>
          <div className="window-body space-y-3 text-xs leading-relaxed">
            <p><strong>수행 기간:</strong> 2024.07 ~ 2025.12 (1년 5개월)</p>
            <p><strong>담당 업무:</strong><br />
            - 165개 패밀리 앱 잦은 업데이트 주기에 맞춘 타임박싱 및 탐색적 테스트 수행<br />
            - 대규모 학습 콘텐츠 개편(2회), 신규 기능(2~3회), 단말 추가(1회) 대응<br />
            - 기획서가 미비한 노후 앱의 레거시 동작 분석 및 Full TC 구축</p>
            <p><strong>성과 및 기여:</strong><br />
            - 패밀리 앱 검증 소요 시간 측정, 결과 보고 등 리딩 역할 수행<br />
            - 주요 50개 앱 중 37개에 대한 약 6,500개의 테스트 케이스 작성 및 자산화</p>
          </div>
        </div>
      )}

      {/* ==================== [Project 4] SKT ==================== */}
      {windows.skt.isOpen && (
        <div 
          className="desktop-window"
          style={{ 
            left: `${windows.skt.x}px`, 
            top: `${windows.skt.y}px`,
            width: `${windows.skt.width}px`,
            height: `${windows.skt.height}px`,
            zIndex: windows.skt.zIndex 
          }}
          onMouseDown={() => bringToFront('skt')}
        >
          <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, 'skt')}>
            <span>SKT (SKT Open API)</span>
            <button className="window-close-btn" onClick={() => closeWindow('skt')}>X</button>
          </div>
          <div className="window-body space-y-3 text-xs leading-relaxed">
            <p><strong>수행 기간:</strong> 2024.03 ~ 2024.07 (3개월)</p>
            <p><strong>담당 업무:</strong><br />
            - 사용자 및 관리자 사이트 상호작용 검증용 TC 작성 및 테스트 수행<br />
            - API 사용량별 요금 책정, 초과 시 차단 로직, 사이트 미리보기 용량 초과 검증</p>
          </div>
        </div>
      )}

      {/* ==================== [About QA] ==================== */}
      {windows['about-qa'].isOpen && (
        <div 
          className="desktop-window"
          style={{ 
            left: `${windows['about-qa'].x}px`, 
            top: `${windows['about-qa'].y}px`,
            width: `${windows['about-qa'].width}px`,
            height: `${windows['about-qa'].height}px`,
            zIndex: windows['about-qa'].zIndex 
          }}
          onMouseDown={() => bringToFront('about-qa')}
        >
          <div className="window-titlebar" onMouseDown={(e) => handleMouseDown(e, 'about-qa')}>
            <span>💡 사이트 제작 과정과 QA 관점의 회고</span>
            <button className="window-close-btn" onClick={() => closeWindow('about-qa')}>X</button>
          </div>
          <div className="window-body space-y-3 text-xs leading-relaxed">
            <p><strong>1. 기획 및 요구사항 분석 (Requirement Analysis)</strong><br />
            - 모바일과 PC 환경 모두에서 자연스러운 사용자 경험을 주기 위해 뷰포트별 레이아웃 분리 전략을 세우고 개발을 시작했습니다.</p>
            <p><strong>2. UI/UX 및 반응형 검증 과정에서의 노력</strong><br />
            - 스타일 코드를 분리하는 과정에서 발생한 가로 깨짐 현상과 768px 경계 구간의 레이아웃 어긋남을 직접 테스트하며 크로스 브라우징 정합성을 맞추는 데 집중했습니다.</p>
            <p><strong>3. 예외 처리 및 배운 점 (Error Handling)</strong><br />
            - 새로고침 시 데이터 유실 문제나 외부 API 연동 시 발생할 수 있는 402 에러 등의 리스크를 마주하며, 로컬스토리지 방어 코드와 예외 처리가 얼마나 중요한지 몸소 체감했습니다. QA 관점에서 사소한 예외 케이스까지 고려하는 시야를 넓힐 수 있었습니다.</p>
          </div>
        </div>
      )}

      <BackButton />
    </div>
  );
}