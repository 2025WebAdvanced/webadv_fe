import React, { useState } from 'react';
import './Profile.css';

export default function Profile() {
  const [mode, setMode] = useState('view'); // 'view', 'edit', 'password'
  const [profile, setProfile] = useState({
    email: 'example@board.com',
    nickname: '닉네임',
    school: '대학교',
  });
  const [editProfile, setEditProfile] = useState(profile);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [pwError, setPwError] = useState('');

  // 프로필 수정 완료
  const handleEditComplete = (e) => {
    e.preventDefault();
    setProfile(editProfile);
    setMode('view');
  };

  // 비밀번호 변경 완료
  const handlePasswordComplete = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPwError('모든 항목을 입력하세요.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setPwError('');
    setMode('edit');
    setPasswordForm({ current: '', next: '', confirm: '' });
    // 실제 비밀번호 변경 로직 필요
  };

  // 회원 탈퇴
  const handleWithdraw = () => {
    if (window.confirm('정말로 회원을 탈퇴하시겠습니까?')) {
      // 실제 회원 탈퇴 로직 필요
      alert('회원 탈퇴가 완료되었습니다.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        {mode === 'view' && (
          <>
            <h2 className="profile-title">프로필</h2>
            <table className="profile-table">
              <tbody>
                <tr>
                  <td className="profile-label">이메일</td>
                  <td className="profile-value">{profile.email}</td>
                </tr>
                <tr>
                  <td className="profile-label">닉네임</td>
                  <td className="profile-value">{profile.nickname}</td>
                </tr>
                <tr>
                  <td className="profile-label">학교</td>
                  <td className="profile-value">{profile.school}</td>
                </tr>
              </tbody>
            </table>
            <button className="profile-btn-main" onClick={() => { setEditProfile(profile); setMode('edit'); }}>
              수정
            </button>
          </>
        )}

        {mode === 'edit' && (
          <>
            <h2 className="profile-title">프로필</h2>
            <form className="profile-edit-form" onSubmit={handleEditComplete}>
              <label className="profile-edit-label">
                <span>이메일</span>
                <input
                  className="profile-input"
                  type="email"
                  value={editProfile.email}
                  disabled
                  readOnly
                />
              </label>
              <label className="profile-edit-label">
                <span>닉네임</span>
                <input
                  className="profile-input"
                  type="text"
                  value={editProfile.nickname}
                  onChange={e => setEditProfile({ ...editProfile, nickname: e.target.value })}
                />
              </label>
              <label className="profile-edit-label">
                <span>학교</span>
                <input
                  className="profile-input"
                  type="text"
                  value={editProfile.school}
                  onChange={e => setEditProfile({ ...editProfile, school: e.target.value })}
                />
              </label>
              <button
                type="button"
                className="profile-btn-sub"
                onClick={() => setMode('password')}
              >
                비밀번호 변경
              </button>
              <button
                type="button"
                className="profile-link-danger"
                onClick={handleWithdraw}
              >
                회원 탈퇴
              </button>
              <div className="profile-btn-row">
                <button type="submit" className="profile-btn-complete">완료</button>
                <button
                  type="button"
                  className="profile-btn-cancel"
                  onClick={() => setMode('view')}
                >
                  취소
                </button>
              </div>
            </form>
          </>
        )}

        {mode === 'password' && (
          <>
            <h2 className="profile-title">비밀번호 변경</h2>
            <form className="profile-edit-form" onSubmit={handlePasswordComplete}>
              <label className="profile-edit-label">
                <span>현재 비밀번호</span>
                <input
                  className="profile-input"
                  type="password"
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="현재 비밀번호"
                />
              </label>
              <label className="profile-edit-label">
                <span>새 비밀번호</span>
                <input
                  className="profile-input"
                  type="password"
                  value={passwordForm.next}
                  onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })}
                  placeholder="새 비밀번호"
                />
              </label>
              <label className="profile-edit-label">
                <span>새 비밀번호 확인</span>
                <input
                  className="profile-input"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  placeholder="새 비밀번호 확인"
                />
              </label>
              {pwError && <div className="profile-error">{pwError}</div>}
              <div className="profile-btn-row">
                <button type="submit" className="profile-btn-complete">완료</button>
                <button
                  type="button"
                  className="profile-btn-cancel"
                  onClick={() => { setPwError(''); setMode('edit'); }}
                >
                  취소
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
