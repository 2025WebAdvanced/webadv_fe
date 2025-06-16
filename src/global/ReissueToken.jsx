export default async function ReissueToken(next) {

  fetch(`${process.env.REACT_APP_SERVER_URL}/auth/reissue`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem('refreshToken'),
    }
  })
      .then(res => {
        if (res.status === 401)
          throw new Error(res.statusText);
        else
          res.json();
      })
      .then(res => {
        if (res.code === 1004) {
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          next && next();
        } else {
          throw new Error(res.message);
        }
      })
      .catch( err => {
        console.log(err);
        alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
}