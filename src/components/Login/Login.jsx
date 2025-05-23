// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({
    id: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  // 로그인 요청 처리
  const loginUser = async (credentials) => {
    try {
      // 실제 API 호출로 대체 (예시)
      const response = await fetch('http://your-api-url/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('로그인에 실패했습니다');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 입력값 검증
      if (!credentials.id || !credentials.password) {
        setError('아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }

      // 로그인 요청
      const data = await loginUser(credentials);
      
      // 토큰 저장
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 로그인 성공 시 메인 페이지로 이동
      navigate('/main');
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">게시판</h2>
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="text"
              name="id"
              value={credentials.id}
              onChange={handleChange}
              placeholder="id"
              className="login-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="password"
              className="login-input"
            />
          </div>
          
          <button type="submit" className="login-button">
            로그인
          </button>
          
          <div className="register-link">
            <a href="/register">회원가입</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
