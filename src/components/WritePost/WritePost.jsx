import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WritePost.css";
import reissueToken from "../../global/reissueToken";

export default function WritePost(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      alert("로그인한 사용자만 게시글을 작성할 수 있습니다. 로그인 후 이용해 주세요");
      navigate('/login');
    }
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('accessToken'),
      },
      body: JSON.stringify({
        'title': title,
        'content': content,
      }),
    }).then(res => res.json())
      .then(async (res) => {
        if (res.code === 4010)
          await reissueToken(handleSubmit);
        navigate(`/post/${res.postId}`);
      });
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
            tabIndex={1}
          />
          <button 
            className="write-post-submit-btn" 
            onClick={handleSubmit}
            tabIndex={3}
          >
            게시
          </button>
        </div>

        <textarea
          className="write-post-content-input"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={handleContentChange}
          tabIndex={2}
        />
      </div>
    </div>
  );
}
