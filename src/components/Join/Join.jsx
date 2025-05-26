import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Join.css";

export default function Join() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirm: ""
  });

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 이메일 검증
  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!regex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "유효하지 않은 이메일 형식" }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: "" }));
    return true;
  };

  // 비밀번호 검증
  const validatePassword = () => {
    if (formData.password.length < 8 || formData.password.length > 15) {
      setErrors(prev => ({ ...prev, password: "8~15자리로 입력해주세요" }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: "" }));
    return true;
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail() | !validatePassword()) return;
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirm: "비밀번호가 일치하지 않습니다" }));
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/auth/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.message.includes("이메일")) {
          setErrors(prev => ({ ...prev, email: data.message }));
        }
        throw new Error(data.message);
      }
      
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 오류:", err);
    }
  };

  return (
    <div className="join-container">
      <div className="join-content">
        <h2 className="join-title">게시판</h2>

        <form className="join-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>아이디</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={validateEmail}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={validatePassword}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirm ? 'error' : ''}
            />
            {errors.confirm && <span className="error-msg">{errors.confirm}</span>}
          </div>

          <button type="submit" className="join-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
