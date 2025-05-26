import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Post.css";

export default function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);

  // 🪙 토큰 가져오기
  const getToken = () => localStorage.getItem("token");

  // 📦 게시글 불러오기
  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8080/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error("게시글을 불러오는 데 실패했어요!");
      const data = await res.json();
      setPost(data);
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // 📌 마운트 시 게시글 정보 불러오기
  // useEffect(() => {
  //   fetchPost();
  // }, [postId]);

  // 📝 댓글 작성
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "currentUser",
      content: newComment,
      date: new Date().toLocaleDateString("ko-KR"),
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  // ✏️ 수정 버튼
  const handleEdit = () => {
    navigate(`/edit/${postId}`);
  };

  // ❌ 삭제 버튼
  const handleDelete = async () => {
    <button className="edit-button" onClick={handleEdit}>
      <img src="/fix.png" alt="수정" />
    </button>

    if (!window.confirm("정말 삭제하시겠어요? 🥺")) return;

    try {
      const res = await fetch(`http://localhost:8080/post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error("삭제 실패!");

      alert("삭제되었습니다!");
      navigate("/board");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <div className="error-message">❌ {error}</div>;
  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="post-container">
      {/* 🧑‍🎓 게시글 헤더 */}
      <div className="post-header">
        <div className="user-info">
          <h3 className="user-id">{post.author || "사용자"}</h3>
          <p className="university">경성대학교</p>
        </div>

        <div className="title-section">
          <span className="title-label">제목</span>
          <h2 className="post-title">{post.title}</h2>
        </div>

        <div className="post-date">
          {new Date(post.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).replace(/\. /g, ".").replace(/\.$/, "")}
        </div>
      </div>

      <hr className="divider" />

      {/* 📄 본문 */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* 🛠️ 수정/삭제 */}
      <div className="action-buttons">
        <button className="edit-button" onClick={handleEdit}>
          <img src="/fix.png" alt="수정" />
        </button>
        <button className="edit-button" onClick={handleDelete}>
          <img src="/delete.png" alt="삭제" />
        </button>
      </div>

      {/* 💬 댓글 */}
      <div className="comment-section">
        <div className="comment-header">
          <h4>댓글</h4>
          <span className="comment-count">{comments.length}</span>
        </div>
        <hr />

        <div className="comment-list">
          {comments.map((comment) => (
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
  );
}
