import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import saveBtnImg from '../assets/enterButton.jpg';
import './GuestPage.css';

// firebase.js의 db 가져오기
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function GuestPage() {
  // 닉네임 및 본문 상태 관리
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  
  // 방명록 히스토리 리스트 (파이어베이스 연동)
  const [historyList, setHistoryList] = useState([]);

  // 1. 실시간 데이터 불러오기 (onSnapshot)
  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistoryList(list);
    }, (error) => {
      console.error("데이터 실시간 로드 에러:", error);
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => unsubscribe();
  }, []);

  // 2. 방명록 저장 처리 (async 추가)
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!nickname.trim() || !comment.trim()) {
      alert('닉네임과 본문을 모두 입력해주세요!');
      return;
    }

    try {
      // 'guestbook' 컬렉션에 새 문서 추가 (파이어베이스가 컬렉션을 자동 생성해줍니다)
      await addDoc(collection(db, 'guestbook'), {
        nickname: nickname,
        comment: comment,
        createdAt: serverTimestamp(), // 서버 시간 기록
      });

      // 입력창 초기화
      setNickname('');
      setComment('');
      alert('✅ 방명록이 등록되었습니다.');
    } catch (error) {
      console.error('방명록 저장 실패: ', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="guest-page-container relative w-screen min-h-screen">
      <div className="guest-content-wrapper py-10">
        
        {/* History 영역 (방명록 목록) */}
        <div className="guest-card-box guest-history-section">
          <h2 className="w-full text-center font-bold text-gray-800 text-[clamp(12px,1.2vw,18px)] mb-2 shrink-0">
            방명록 목록
          </h2>

          <div className="guest-history-list">
            {historyList.length > 0 ? (
              historyList.map((item) => (
                <div key={item.id} className="guest-history-item">
                  <div className="guest-history-nickname">{item.nickname}</div>
                  <div className="guest-history-comment">{item.comment}</div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[13px]">
                첫 방명록을 남겨보세요!
              </div>
            )}
          </div>
        </div>

        {/* Write 영역 (방명록 작성) */}
        <div className="guest-card-box guest-write-section">
          <h2 className="w-full text-center font-bold text-gray-800 text-[clamp(12px,1.2vw,18px)] mb-2 shrink-0">
            방명록 작성하기
          </h2>

          <form onSubmit={handleSave} className="guest-form">
            <input
              type="text"
              value={nickname}
              maxLength={10}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (최대 10자)"
              className="guest-input-single text-gray-800 placeholder:text-gray-400"
            />

            <textarea
              value={comment}
              maxLength={100}
              onChange={(e) => setComment(e.target.value)}
              placeholder="하고싶은 한 마디 ! (최대 100자)"
              className="guest-input-multi text-gray-800 placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="h-[36px] w-auto max-w-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 active:scale-95 mt-1"
            >
              <img 
                src={saveBtnImg} 
                alt="저장하기" 
                className="h-full w-auto object-contain aspect-[180/72] rounded-[10px]"
              />
            </button>
          </form>
        </div>

      </div>

      {/* 우측 하단 뒤로가기 버튼 */}
      <BackButton />
    </div>
  );
}