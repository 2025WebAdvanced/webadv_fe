// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginUser = async () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
        .then(res => {
          if (!res.ok)
            throw new Error(res.statusText);
          return res.json();
        })
        .then(res => {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
            navigate(-1);
        })
        .catch((err) => {
          const errorMsg = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
          setError(errorMsg);
          console.error('로그인 에러:', err.statusMessage);
        });
  };
  const handleClick = () => {
    setError('');

    if (!email || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    loginUser();
  };

  return (
    <div className="login-container">
      <h2 className="login-title">게시판 로그인</h2>
      <div className="login-form-wrapper">
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="id"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          className="login-input"
        />
        
        <button className="login-button" onClick={handleClick}>
          로그인
        </button>
        <div className='register-link'><a href="/register">회원가입</a></div>
      </div>
    </div>
  );
}
