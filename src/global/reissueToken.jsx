export default async function reissueToken(next) {
  fetch(`${process.env.REACT_APP_SERVER_URL}/auth/reissue`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem('refreshToken'),
    }
  })
    .then(res => res.json()) 
    .then(res => {
      if (res.status === 401) {
        alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return;
      }
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      next();
    })
}