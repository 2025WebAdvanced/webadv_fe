import React, { useEffect, useRef, useState } from 'react';
import './Post.css';
import { useNavigate, useParams } from "react-router-dom";
import { sqlDateToRelativeTimeString } from "../../global/SQLDateFormatter";

const Post = () => {
  const navigate = useNavigate();
  const textRef = useRef();
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken') || null,
      },
    })
        .then(res => res.json())
        .then(res => {
          if (res.code === 1009) {
            setPost(res.data);
            setEditTitle(res.data.title);
            setEditContent(res.data.content);
          } else if (res.code === 4040)
            navigate('/notFound');
          else
            throw new Error(res.code);
        })
        .catch(async (err) => {
          setPost({
            title: '',
            content: '',
            createdAt: '',
            username: '',
            isAuthor: false,
            comments: [],
          });
          alert('오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        });
  }, [postId]);

  // 댓글 작성
  const handleCommentSubmit = () => {
    const commentContent = newComment.trim();
    if (!commentContent) {
      setNewComment('');
      return;
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/comment`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken'),
      },
      body:JSON.stringify({
        postId: postId,
        content: commentContent,
      }),
    })
        .then(res => res.json())
        .then(res => {
          if (res.message === '토큰이 없습니다.')
            alert('댓글을 작성하려면 로그인하세요.');
          else {
            setPost({
              ...post,
              comments: [ ...post.comments, { ...res.data, isAuthor: true } ],
            });
            setNewComment('');
          }
        });
  };

  // 수정 버튼 클릭
  const handleEditClick = () => {
      post.isAuthor ? (setEditMode(true)) : (alert('수정 권한이 없습니다.'));
  };

  // 삭제 버튼 클릭
  const handleDelete = (targetId) => {
    if (!targetId && post.isAuthor) {
      if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        fetch(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('accessToken'),
          }
        })
            .then(res => res.json())
            .then(res => {
              navigate('/board');
            })
      }
    } else if (targetId) {
      if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
        fetch(`${process.env.REACT_APP_SERVER_URL}/comment/${targetId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('accessToken'),
          }
        })
            .then(res => res.json())
            .then(res => {
              if (res.code === 3003)
                setPost({ ...post, comments: post.comments.filter((c) => c.id !== targetId) });
              else
                alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            })
      }
    } else {
      alert('삭제 권한이 없습니다.');
    }
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken'),
      },
      body:JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    })
        .then(res => res.json())
        .then(res => {
          if (res.code === 2002) {
            setPost({
              ...post,
              title: editTitle,
              content: editContent,
              updatedAt: '',
            });
          } else if (res.code === 4003)
            alert('본인의 게시글만 수정할 수 있습니다.');
          setEditMode(false);
        })

  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditMode(false);
  };

  return (
    <div className="post-container">
        <div>
          {/* 게시글 헤더 */}
          <div className="post-header">
            <div className="user-info">
              <h3 className="user-id">{post?.username || '사용자'}</h3>
              <p className="university">경성대학교</p>
            </div>
            <div className="title-section">
              <div className="title-label">제목</div>
              { editMode ? (
                  <>
                    <input
                        className="post-title edit-title-input"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder="제목"
                        maxLength={50}
                    />
                  </>
                ) : (
                  <h2 className="post-title">{post?.title || '제목 없음'}</h2>
                )
              }
              <div className="edit-underline" style={{width: editMode ? "100%" : 0}}></div>
            </div>
            { !editMode &&
              <div className={`post-date ${editMode && 'disabled'}`}>
                <div>{post?.createdAt ? sqlDateToRelativeTimeString(post.createdAt) : '날짜 정보 없음'}</div>
                {post?.updatedAt !== post?.createdAt && <div>최종 수정: {sqlDateToRelativeTimeString(post.updatedAt) || '지금'}</div>}
              </div>
            }
          </div>
          <hr className="divider" />
          {/* 게시글 본문 */}
          { editMode ? (
              <textarea
                ref={textRef}
                className="edit-content-input"
                value={editContent}
                onChange={e => {
                  setEditContent(e.target.value);
                  textRef.current.style.height = textRef.current.scrollHeight - 30 + 'px';
                }}
                placeholder="내용을 입력하세요."
                rows={10}
              />
            ) : (
              <div className="post-content">
                <p>{post?.content || '내용이 없습니다.'}</p>
              </div>
            )
          }
          {/* 액션 버튼 */}
          { post?.isAuthor && editMode ? (
              <div className="action-buttons">
                <button className="save-btn" onClick={handleSave}>저장</button>
                <button className="cancel-btn" onClick={handleCancel}>취소</button>
              </div>
            ) : (
              <div className="action-buttons">
                <button className="edit-button" onClick={handleEditClick}>
                  <img src="/fix.png" alt="수정" />
                </button>
                <button className="edit-button" onClick={() => handleDelete()}>
                  <img src="/delete.png" alt="삭제" />
                </button>
              </div>
            )
          }
          {/* 댓글 영역 */}
            <div className={`comment-section ${editMode && 'disabled'}`}>
              <div className="comment-header">
                <h4>댓글</h4>
                <span className="comment-count">{post.comments?.length}</span>
              </div>
              <hr/>
              <div className="comment-list">
                {post.comments?.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-item-container">
                        <div className="comment-content-container">
                          <div className="comment-author">{comment.username}</div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                        {comment.isAuthor &&
                            <div className="comment-buttons">
                              <button className="edit-button" onClick={() => handleDelete(comment.id)}>
                                <img src="/delete.png" alt="삭제"/>
                              </button>
                            </div>
                        }
                      </div>
                      <div className="comment-date">{sqlDateToRelativeTimeString(comment.createdAt)}</div>
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
    </div>
  );
};

export default Post;
