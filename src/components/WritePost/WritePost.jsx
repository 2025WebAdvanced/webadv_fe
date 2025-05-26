import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WritePost.css";

export default function WritePost(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = () => {
    fetch('http://localhost:8080/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'title': title,
        'content': content,
        'userId': 1,
      }),
    }).then(res => res.json())
      .then(res => navigate(`/post/${res.postId}`));
  };

  return (
    <div className="write-post-container">
      <div className="write-post-content-section">
        <h2>자유게시판에 글 작성</h2>

        <div className="write-post-title-section">
          <input
            type="text"
            className="write-post-title-input"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={handleTitleChange}
          />
          <button 
            className="write-post-submit-btn" 
            onClick={handleSubmit}
          >
            게시
          </button>
        </div>

        <textarea
          className="write-post-content-input"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}
