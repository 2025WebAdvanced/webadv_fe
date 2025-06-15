import React, { useState, useEffect } from "react";
import "./List.css";

export default function List() {
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);

  // 데이터 상태
  const [posts, setPosts] = useState({});
  const [myPosts, setMyPosts] = useState({});
  const [myComments, setMyComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 게시글 목록 조회
    fetch(`${process.env.REACT_APP_SERVER_URL}/post/list?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      });
  }, [page]);

  const dateParser = (date) => {
    let year = parseInt(date.substring(0, 4));
    let month = parseInt(date.substring(5, 7)) - 1;
    let day = parseInt(date.substring(8, 10));
    let hour = parseInt(date.substring(11, 13)) + 9;  // 한국 시간 GMT+9
    let minute = parseInt(date.substring(14, 16));
    let second = parseInt(date.substring(17, 19));

    const parsedDate = new Date(year, month, day, hour, minute, second);
    const now = new Date();
    const diffTime = now.getTime() - parsedDate.getTime();

    if (diffTime / 1000 <= 60)
      return `${Math.floor(diffTime / 1000)}초 전`;
    else if (diffTime / (1000 * 60) <= 60)
      return `${Math.floor(diffTime / (1000 * 60))}분 전`;
    else if (diffTime / (1000 * 60 * 60) <= 24)
      return `${Math.floor(diffTime / (1000 * 60 * 60))}시간 전`;
    else if (parsedDate.getFullYear() === now.getFullYear()) {
      return `${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일`;
    } else {
      return `${parsedDate.getFullYear()}.${parsedDate.getMonth() + 1}.${parsedDate.getDate()}`;
    }
  }

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
      ) : data.totalPosts ? (
        data.posts.map((post) => (
          <div className="list-row" key={post.id}>
            <div>{post.username}</div>
            <div className="title">{post.title}</div>
            <div className="date">{dateParser(post.createdAt)}</div>
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
        pageCount={data.totalPages}
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
      ) : myComments.data ? (
        myComments.data.map((item, idx) => (
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
        pageCount={myComments.totalPages}
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
