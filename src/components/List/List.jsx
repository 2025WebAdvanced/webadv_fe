import React, { useState, useEffect } from "react";
import "./List.css";

export default function List() {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);

  // 데이터 상태
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 탭 변경시 페이지 초기화 및 데이터 fetch
  useEffect(() => {
    setPage(1);
    setLoading(true);

    let url = "";
    if (activeTab === 0) url = "/api/posts";
    else if (activeTab === 1) url = "/api/my-posts";
    else if (activeTab === 2) url = "/api/my-comments";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (activeTab === 0) setPosts(data);
        else if (activeTab === 1) setMyPosts(data);
        else if (activeTab === 2) setMyComments(data);
      })
      .catch(() => {
        if (activeTab === 0) setPosts([]);
        else if (activeTab === 1) setMyPosts([]);
        else if (activeTab === 2) setMyComments([]);
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  // 한 페이지에 5개씩
  const postsPerPage = 5;
  const getPageData = (data) =>
    data.slice((page - 1) * postsPerPage, page * postsPerPage);
  const getPageCount = (data) =>
    Math.ceil(data.length / postsPerPage) || 1;

  const renderPosts = (data) => (
    <div className="list-table">
      <div className="list-header">
        <div>작성자</div>
        <div className="title">제목</div>
        <div>날짜</div>
        <div>조회</div>
        <div>댓글</div>
      </div>
      {loading ? (
        <div className="list-empty">로딩 중...</div>
      ) : getPageData(data).length > 0 ? (
        getPageData(data).map((post) => (
          <div className="list-row" key={post.id}>
            <div>{post.author}</div>
            <div className="title">{post.title}</div>
            <div>{post.date}</div>
            <div>{post.views}</div>
            <div>{post.comments}</div>
          </div>
        ))
      ) : (
        <div className="list-empty">게시글이 없습니다.</div>
      )}
      <Pagination
        page={page}
        setPage={setPage}
        pageCount={getPageCount(data)}
      />
    </div>
  );

  const renderMyComments = () => (
    <div className="list-table">
      <div className="list-header">
        <div>글쓴이</div>
        <div className="title">글제목</div>
        <div>날짜</div>
        <div>조회</div>
        <div>댓글</div>
      </div>
      {loading ? (
        <div className="list-empty">로딩 중...</div>
      ) : getPageData(myComments).length > 0 ? (
        getPageData(myComments).map((item, idx) => (
          <div className="list-row comment-row" key={idx}>
            <div>{item.post.author}</div>
            <div className="title">{item.post.title}</div>
            <div>{item.post.date}</div>
            <div>{item.post.views}</div>
            <div>{item.post.comments}</div>
            <div className="my-comment">
              <span className="my-comment-label">내 댓글</span>
              <span className="my-comment-text">{item.comment.text}</span>
              <span className="my-comment-date">{item.comment.date}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="list-empty">작성한 댓글이 없습니다.</div>
      )}
      <Pagination
        page={page}
        setPage={setPage}
        pageCount={getPageCount(myComments)}
      />
    </div>
  );

  const handleTabClick = (idx) => {
    setActiveTab(idx);
  };

  return (
    <div className="list-wrap">
      <div className="list-tabs">
        <button
          className={activeTab === 0 ? "active" : ""}
          onClick={() => handleTabClick(0)}
        >
          자유게시판
        </button>
        <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => handleTabClick(1)}
        >
          내가 쓴 글
        </button>
        <button
          className={activeTab === 2 ? "active" : ""}
          onClick={() => handleTabClick(2)}
        >
          내가 쓴 댓글
        </button>
      </div>
      <div className="list-content">
        {activeTab === 0 && renderPosts(posts)}
        {activeTab === 1 && renderPosts(myPosts)}
        {activeTab === 2 && renderMyComments()}
      </div>
    </div>
  );
}

// 페이지네이션 컴포넌트
function Pagination({ page, setPage, pageCount }) {
  if (pageCount <= 1) return null;
  const pages = [];
  for (let i = 1; i <= pageCount; i++) pages.push(i);
  return (
    <div className="pagination">
      <button onClick={() => setPage(1)} disabled={page === 1}>&lt;&lt;</button>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>&lt;</button>
      {pages.map((p) => (
        <button
          key={p}
          className={page === p ? "active" : ""}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}
      <button onClick={() => setPage(page + 1)} disabled={page === pageCount}>&gt;</button>
      <button onClick={() => setPage(pageCount)} disabled={page === pageCount}>&gt;&gt;</button>
    </div>
  );
}
