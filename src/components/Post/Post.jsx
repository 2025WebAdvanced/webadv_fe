import React, { useState } from 'react';
import './Post.css';

const Post = ({ post = {}, currentUser }) => {
  // 댓글 상태
  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  // 수정 모드/권한
  const [isEditMode, setIsEditMode] = useState(false);
  const [showNoPermission, setShowNoPermission] = useState(false);
  // 수정 입력값
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editContent, setEditContent] = useState(post.content || '');
  // 삭제 상태
  const [isDeleted, setIsDeleted] = useState(false);

  // 댓글 작성
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      author: currentUser || 'currentUser',
      content: newComment,
      date: new Date().toLocaleDateString('ko-KR')
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  // 수정 버튼 클릭
  const handleEditClick = () => {
    if (currentUser === post.author) {
      setIsEditMode(true);
    } else {
      setShowNoPermission(true);
    }
  };

  // 삭제 버튼 클릭
  const handleDelete = () => {
    if (currentUser === post.author) {
      if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        setIsDeleted(true);
      }
    } else {
      alert('삭제 권한이 없습니다.');
    }
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    setIsEditMode(false);
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    setEditTitle(post.title || '');
    setEditContent(post.content || '');
    setIsEditMode(false);
  };

  // 권한 없음 모달 닫기
  const handleCloseNoPermission = () => {
    setShowNoPermission(false);
  };

  // 삭제된 경우
  if (isDeleted) {
    return (
      <div className="post-container">
        <div className="deleted-message">
          이 게시글은 삭제되었습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="post-container">
      {/* 권한 없음 모달 */}
      {showNoPermission && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>수정 권한이 없습니다</p>
            <button onClick={handleCloseNoPermission}>확인</button>
          </div>
        </div>
      )}

      {/* 수정 모드 */}
      {isEditMode ? (
        <div className="edit-box">
          <h2 className="edit-page-title">자유게시판에 글 작성</h2>
          <div className="edit-row">
            <input
              className="edit-title-input"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="제목"
              maxLength={50}
            />
            <button className="save-btn" onClick={handleSave}>저장</button>
            <button className="cancel-btn" onClick={handleCancel}>취소</button>
          </div>
          <textarea
            className="edit-content-input"
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="내용을 입력하세요."
            rows={10}
          />
          
        </div>
      ) : (
        <div>
          {/* 게시글 헤더 */}
          <div className="post-header">
            <div className="user-info">
              <h3 className="user-id">{post?.author || '사용자'}</h3>
              <p className="university">경성대학교</p>
            </div>
            <div className="title-section">
              <span className="title-label">제목</span>
              <h2 className="post-title">{post?.title || '제목 없음'}</h2>
            </div>
            <div className="post-date">
              {post?.date ? new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\. /g, '.').replace(/\.$/, '') : '날짜 정보 없음'}
            </div>
          </div>
          <hr className="divider" />
          {/* 게시글 본문 */}
          <div className="post-content">
            <p>{post?.content || '내용이 없습니다.'}</p>
          </div>
          {/* 액션 버튼 */}
          <div className="action-buttons">
            <button className="edit-button" onClick={handleEditClick}>
              <img src="/fix.png" alt="수정" />
            </button>
            <button className="edit-button" onClick={handleDelete}>
              <img src="/delete.png" alt="삭제" />
            </button>
          </div>
          {/* 댓글 영역 */}
          <div className="comment-section">
            <div className="comment-header">
              <h4>댓글</h4>
              <span className="comment-count">{comments.length}</span>
            </div>
            <hr />
            <div className="comment-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-author">{comment.author}</div>
                  <p className="comment-content">{comment.content}</p>
                  <div className="comment-date">{comment.date}</div>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <input
                type="text"
                placeholder="댓글을 남겨보세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit}>작성</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
