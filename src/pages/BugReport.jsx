import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './BugReport.css';

export default function BugReport({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    steps: '',
    expected: '',
    actual: '',
    note: '',
    fileUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('이슈 제목을 입력해 주세요.');
      return;
    }

    setLoading(true);

    try {
      // Firebase Firestore 'issues' 컬렉션에 문서 추가 (초기 상태: 'To Do')
      await addDoc(collection(db, 'issues'), {
        ...formData,
        status: 'To Do',
        createdAt: serverTimestamp(),
      });

      alert('이슈가 등록되었습니다!');
      onClose();
    } catch (error) {
      console.error('버그 제보 등록 실패:', error);
      alert('제보 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="desktop-window bug-modal-window">
        {/* Titlebar */}
        <div className="window-titlebar">
          <span>이슈 내용 작성</span>
          <button className="window-close-btn" onClick={onClose}>X</button>
        </div>

        {/* Form Body */}
        <form className="window-body modal-form space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 작성해주세요"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">재현절차</label>
            <textarea
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="1. 순서대로&#10;2. 재현절차를&#10;3. 작성해주세요"
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="form-label">기대결과</label>
              <input
                type="text"
                name="expected"
                value={formData.expected}
                onChange={handleChange}
                placeholder="어떻게 동작되었으면 하나요?"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">재현결과</label>
              <input
                type="text"
                name="actual"
                value={formData.actual}
                onChange={handleChange}
                placeholder="현재는 어떻게 동작되나요?"
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">비고</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="특이사항이나 추가 설명"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">이미지/파일 링크 (선택사항)</label>
            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/... 또는 이미지 URL"
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}