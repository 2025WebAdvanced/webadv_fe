import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1><FaExclamationTriangle /> Not Found</h1>
      <p>요청한 페이지를 <strong>찾을 수 없습니다.</strong></p>
      <p>잘못된 url이거나, 삭제된 게시글일 수 있습니다.</p>
      <br />
      <hr />
      <Link to={'/board'}>메인 화면으로 돌아가기</Link>
    </div>
  );
}