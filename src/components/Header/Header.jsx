import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaEdit, FaHome } from "react-icons/fa";
import './Header.css';

export default function Header(props) {

  const navigate = useNavigate();

  const linkHandler = (src) => {
    navigate(src);
  }

  const redirectHandler = (src) => {
    window.open(src)
  }

  return (
    <div className="headerContainer">
      <div className="profileContainer">
        <div className="userContainer">
          <div className="bold16">{props.isLogggedIn ? props.username : '익명의 사용자'}</div>
          <div className="r12">{props.isLogggedIn ? props.univ : '로그인하세요'}</div>
        </div>
        <div className="buttonContainer">
          <button className="linkButton" onClick={() => linkHandler('/login')}>로그인</button>
          <Link to='/register' className="linkText r12">회원가입</Link>
        </div>
      </div>
      <div className="iconsContainer">
        <FaHome 
          size={32}
          onClick={() => linkHandler('/board')}
        />
        <FaEdit 
          size={32}
          onClick={() => linkHandler('/board/write')}
        />
        <FaGithub 
          size={32}
          onClick={() => redirectHandler('https://github.com/2025WebAdvanced/webadv_fe')}
        />
      </div>
    </div>
  );
}