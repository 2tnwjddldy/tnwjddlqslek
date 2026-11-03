import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import BugReport from './BugReport';
import BackButton from '../components/BackButton';
import './IssueNotePage.css';

export default function IssueNotePage() {
  const [activeTab, setActiveTab] = useState('issues'); // 'issues' | 'updates'
  const [issues, setIssues] = useState([]);
  const [updateNotes, setUpdateNotes] = useState([]);
  
  // 📌 [변경] 여러 개를 동시에 열 수 있도록 배열 상태로 관리
  const [expandedIds, setExpandedIds] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  // Firestore 실시간 데이터 구독
  useEffect(() => {
    const qIssues = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    const unsubIssues = onSnapshot(qIssues, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIssues(list);
    });

    const qUpdates = query(collection(db, 'updateNotes'), orderBy('createdAt', 'desc'));
    const unsubUpdates = onSnapshot(qUpdates, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUpdateNotes(list);
    });

    return () => {
      unsubIssues();
      unsubUpdates();
    };
  }, []);

  // 📌 [변경] 아코디언 토글 함수 (이미 있으면 제거, 없으면 추가 -> 여러 개 동시 오픈 가능)
  const toggleAccordion = (id) => {
    setExpandedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 코멘트 입력값 변경 핸들러
  const handleCommentChange = (issueId, value) => {
    setCommentInputs((prev) => ({ ...prev, [issueId]: value }));
  };

  // 코멘트 등록 핸들러
  const handleAddComment = async (issueId) => {
    const text = commentInputs[issueId];
    if (!text || !text.trim()) {
      alert('코멘트 내용을 입력해 주세요.');
      return;
    }

    try {
      const issueRef = doc(db, 'issues', issueId);
      const newComment = {
        text: text.trim(),
      };

      await updateDoc(issueRef, {
        comments: arrayUnion(newComment)
      });

      setCommentInputs((prev) => ({ ...prev, [issueId]: '' }));
    } catch (error) {
      console.error('코멘트 등록 실패:', error);
      alert('코멘트 등록 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status = 'To Do') => {
    switch (status) {
      case 'Doing':
        return <span className="status-badge status-doing">doing</span>;
      case 'Fixed':
        return <span className="status-badge status-fixed">fixed</span>;
      case 'Done':
        return <span className="status-badge status-done">done</span>;
      case 'To Do':
      default:
        return <span className="status-badge status-todo">to do</span>;
    }
  };

  const getCategoryBadge = (category = 'New') => {
    const cat = category.toUpperCase();
    switch (cat) {
      case 'FIX':
      case 'BUG FIX':
        return <span className="category-badge cat-fix">Fix</span>;
      case 'UX':
      case 'UI/UX':
        return <span className="category-badge cat-ux">UI/UX</span>;
      case 'REFACTOR':
        return <span className="category-badge cat-refactor">Refactor</span>;
      case 'NEW':
      default:
        return <span className="category-badge cat-new">New</span>;
    }
  };

  return (
    <div className="issue-note-container">
      {/* 상단 헤더 */}
      <header className="issue-note-header">
        <div className="header-left">
          <h1 className="header-title">📋 Issue & Release Note</h1>
          <p className="header-subtitle">사이트의 이슈 추적 및 업데이트 기록 현황입니다.</p>
        </div>
        <button className="bug-report-btn" onClick={() => setIsModalOpen(true)}>
          이슈 등록
        </button>
      </header>

      {/* 탭 네비게이션 */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => { setActiveTab('issues'); setExpandedIds([]); }}
        >
          등록된 이슈 ({issues.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => { setActiveTab('updates'); setExpandedIds([]); }}
        >
          업데이트 노트 ({updateNotes.length})
        </button>
      </div>

      {/* 아코디언 리스트 뷰어 */}
      <main className="accordion-list">
        {activeTab === 'issues' ? (
          issues.length === 0 ? (
            <div className="empty-state">등록된 이슈가 없습니다.</div>
          ) : (
            issues.map((issue) => {
              const isOpen = expandedIds.includes(issue.id); // 📌 현재 항목이 열려있는지 확인

              return (
                <div key={issue.id} className="accordion-item">
                  <div className="accordion-header" onClick={() => toggleAccordion(issue.id)}>
                    <div className="header-info">
                      <span className="item-icon">🐞</span>
                      <span className="item-title">{issue.title}</span>
                    </div>
                    <div className="header-right">
                      {getStatusBadge(issue.status)}
                      <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▼</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="accordion-content">
                      <div className="detail-row">
                        <strong>[재현 절차]</strong>
                        <p className="whitespace-pre-wrap">{issue.steps || '-'}</p>
                      </div>
                      <div className="detail-row">
                        <strong>[기대 결과]</strong>
                        <p>{issue.expected || '-'}</p>
                      </div>
                      <div className="detail-row">
                        <strong>[재현 결과]</strong>
                        <p>{issue.actual || '-'}</p>
                      </div>
                      {issue.note && (
                        <div className="detail-row">
                          <strong>[비고]</strong>
                          <p>{issue.note}</p>
                        </div>
                      )}
                      {issue.status === 'Fixed' && issue.fixedAt && (
                        <div className="detail-row">
                          <strong>[해결 일시]</strong>
                          <p className="text-emerald-600 font-semibold">{issue.fixedAt}</p>
                        </div>
                      )}
                      {issue.fileUrl && (
                        <div className="detail-row">
                          <strong>[첨부파일]</strong>
                          <a href={issue.fileUrl} target="_blank" rel="noreferrer" className="file-link">
                            첨부 파일/이미지 보기 ↗
                          </a>
                        </div>
                      )}

                      {/* 개발자 코멘트 섹션 */}
                      <div className="comment-section">
                        <h4 className="comment-heading">[코멘트]</h4>
                        
                        {/* 📌 이슈 상태가 'To Do' 또는 'Doing'일 때만 입력 폼 노출 (기본값 포함) */}
                        {(issue.status === 'To Do' || issue.status === 'Doing' || !issue.status) && (
                          <div className="comment-input-box">
                            <input
                              type="text"
                              placeholder="수정 내용이나 코멘트를 입력하세요."
                              value={commentInputs[issue.id] || ''}
                              onChange={(e) => handleCommentChange(issue.id, e.target.value)}
                              className="comment-input"
                            />
                            <button 
                              className="comment-submit-btn"
                              onClick={() => handleAddComment(issue.id)}
                            >
                              등록
                            </button>
                          </div>
                        )}

                        {/* 📌 등록된 코멘트가 있을 때만 목록 영역을 노출합니다 */}
                        {issue.comments && issue.comments.length > 0 && (
                          <div className="comment-list">
                            {[...issue.comments]
                              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                              .map((comment, index) => (
                                <div key={index} className="comment-item">
                                  <p className="comment-text">{comment.text}</p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : (
          updateNotes.length === 0 ? (
            <div className="empty-state">등록된 업데이트 노트가 없습니다.</div>
          ) : (
            updateNotes.map((note) => {
              const isOpen = expandedIds.includes(note.id);

              return (
                <div key={note.id} className="accordion-item">
                  <div className="accordion-header" onClick={() => toggleAccordion(note.id)}>
                    <div className="header-info">
                      <span className="item-icon">📢</span>
                      <span className="item-title">{note.title}</span>
                      {note.version && <span className="version-tag">{note.version}</span>}
                    </div>
                    <div className="header-right">
                      {getCategoryBadge(note.category)}
                      <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▼</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="accordion-content">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </div>
                  )}
                </div>
              );
            })
          )
        )}
      </main>

      {/* 버그 제보 팝업 모달 */}
      {isModalOpen && <BugReport onClose={() => setIsModalOpen(false)} />}

      <BackButton />
    </div>
  );
}