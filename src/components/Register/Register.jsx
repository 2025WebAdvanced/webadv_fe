import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

// 타이머 컴포넌트
function Timer({ count }) {
  const min = String(Math.floor(count / 60)).padStart(2, '0');
  const sec = String(count % 60).padStart(2, '0');
  return <div className="timer">{min}:{sec}</div>;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    univ: "",
    password: "",
    confirmPassword: "",
    emailCode: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    univ: "",
    password: "",
    confirm: ""
  });

  // 이메일 인증 관련 상태
  const [isGetCode, setIsGetCode] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const [count, setCount] = useState(300);
  const [isChecked, setIsChecked] = useState(false);

  // 타이머 효과
  React.useEffect(() => {
    if (isTimer && count > 0 && !isChecked) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTimer, count, isChecked]);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 이메일 인증코드 입력 핸들러
  const handleEmailCode = (e) => {
    setFormData(prev => ({ ...prev, emailCode: e.target.value }));
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

  // 닉네임 검증
  const validateUsername = () => {
    if (formData.username.length < 2 || formData.username.length > 25) {
      setErrors(prev => ({ ...prev, username: "2~25자로 입력해주세요" }));
      return false;
    }
    setErrors(prev => ({ ...prev, username: "" }));
    return true;
  }

  // 대학교 검증
  const validateUniv = () => {
    if (formData.univ.length <= 0 || !formData.univ.endsWith('대학교')) {
      setErrors(prev => ({ ...prev, univ: "'대학교'로 끝나야 합니다." }));
      return false;
    }
    setErrors(prev => ({ ...prev, univ: "" }));
    return true;
  }

  // 비밀번호 검증
  const validatePassword = () => {
    if (formData.password.length < 8 || formData.password.length > 15) {
      setErrors(prev => ({ ...prev, password: "8~15자리로 입력해주세요" }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: "" }));
    return true;
  };

  // 이메일 인증코드 발송
  const handleSendCode = async () => {
    if (!validateEmail()) return;
    // 실제 이메일 인증코드 발송 API 호출 필요
    setIsGetCode(true);
    setIsTimer(true);
    setCount(300);
    setIsChecked(false);
    alert("인증코드가 이메일로 발송되었습니다.");
  };

  // 인증코드 확인
  const onValidCode = async (e) => {
    e.preventDefault();
    // 실제 인증코드 확인 API 호출 필요
    // 예시: 성공시
    if (formData.emailCode === "1234") { // 실제로는 서버 검증 필요
      setIsChecked(true);
      setIsTimer(false);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증번호가 일치 하지 않습니다.");
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail() || !validateUniv() || !validateUsername() || !validatePassword()) return;
    if (!isChecked) {
      alert("이메일 인증을 완료해 주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirm: "비밀번호가 일치하지 않습니다" }));
      return;
    } else {
      setErrors(prev => ({ ...prev, confirm: "" }));
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.message.includes("이메일")) {
          setErrors(prev => ({ ...prev, email: data.message }));
        }
        throw new Error(data.message);
      }
      
      alert("회원가입에 성공하였습니다! 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 오류:", err);
    }
  };

  return (
    <div className="register-container">
      <h2>게시판 회원가입</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* 이메일 입력란 + 확인 버튼 */}
        <div className="input-group email-group">
          <label>이메일</label>
          <div className="email-row">
            <input
              type="email"
              name="email"
              placeholder="example@board.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={validateEmail}
              className={errors.email ? 'error' : ''}
              disabled={isChecked}
            />
            <button
              type="button"
              className="email-check-btn"
              onClick={handleSendCode}
              disabled={isChecked}
            >
              확인
            </button>
          </div>
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        {/* 인증코드 입력란 */}
        {isGetCode && (
          <div className="input-group code-group">
            <label>인증코드</label>
            <div className="code-row">
              <input
                name="emailCode"
                value={formData.emailCode}
                className="codeInput"
                placeholder="인증코드 4자리를 입력해주세요"
                onChange={handleEmailCode}
                disabled={isChecked}
                maxLength={4}
              />
              {isTimer && !isChecked ? (
                <Timer count={count} setCount={setCount} />
              ) : null}
              <button
                className="codeCheckBtn"
                onClick={onValidCode}
                disabled={isChecked || !(formData.emailCode && formData.emailCode.length >= 4)}
                type="button"
              >
                확인
              </button>
            </div>
          </div>
        )}

        <div className="input-group">
          <label>닉네임</label>
          <input 
            type="text"
            name="username"
            placeholder="닉네임"
            value={formData.username}
            onChange={handleChange}
            onBlur={validateUsername}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-msg">{errors.username}</span>}
        </div>
        <div className="input-group">
          <label>대학교</label>
          <input 
            type="text"
            name="univ"
            placeholder="경성대학교"
            value={formData.univ}
            onChange={handleChange}
            onBlur={validateUniv}
            className={errors.univ ? 'error' : ''}
          />
          {errors.univ && <span className="error-msg">{errors.univ}</span>}
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
  );
}
