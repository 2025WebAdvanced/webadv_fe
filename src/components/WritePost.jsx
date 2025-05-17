import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WritePost.css"; // CSS 파일 import

export default function WritePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId] = useState("byd1234");
  const navigate = useNavigate();

  // 입력 핸들러
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  // 게시 기능
  const handleSubmit = () => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push({
      id: Date.now(),
      title,
      content,
      author: userId,
      date: new Date().toISOString()
    });
    localStorage.setItem('posts', JSON.stringify(posts));
    navigate('/');
  };

  // 네비게이션 핸들러
  const handleLogout = () => navigate('/login');
  const goToMain = () => navigate('/');
  const goToPostList = () => navigate('/posts');
  const goToGithub = () => window.open('https://github.com', '_blank');

  return (
    <div className="write-post-container">
      {/* 헤더 섹션 */}
      <div className="header">
        <div className="user-section">
          <span className="user-id">{userId}</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
          
          <div className="nav-buttons">
            <button onClick={goToMain}>메인</button>
            <button onClick={goToPostList}>게시글 목록</button>
            <button onClick={goToGithub}>GitHub</button>
          </div>
        </div>
      </div>

      {/* 본문 섹션 */}
      <div className="post-content-section">
        <h2>자유게시판에 글 작성</h2>
        
        <div className="title-section">
          <input
            type="text"
            className="title-input"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={handleTitleChange}
          />
          <button className="submit-btn" onClick={handleSubmit}>게시</button>
        </div>
        
        <textarea
          className="content-input"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}
