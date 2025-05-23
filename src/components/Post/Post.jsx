import React, { useState } from 'react';
import './Post.css';

const Post = ({ post = {} }) => {
  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: 'currentUser',
      content: newComment,
      date: new Date().toLocaleDateString('ko-KR')
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="post-container">
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
        <button className="edit-button">
          <img src="/fix.png" alt="수정" />
        </button>
        <button className="edit-button">
          <img src="/delete.png" alt="삭제" />
        </button>
      </div>
      
      {/* 댓글 섹션 */}
      <div className="comment-section">
        <div className="comment-header">
          <h4>댓글</h4>
          <span className="comment-count">{comments.length}</span>
        </div>
        <hr></hr>
        {/* 댓글 목록 */}
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-author">{comment.author}</div>
              <p className="comment-content">{comment.content}</p>
              <div className="comment-date">{comment.date}</div>
            </div>
          ))}
        </div>

        {/* 댓글 작성 영역 */}
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
  );
};

export default Post;
