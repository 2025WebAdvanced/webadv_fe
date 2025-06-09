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

  const logoutHandler = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('accessToken'),
      },
      body: JSON.stringify({
        'refresh': localStorage.getItem('refreshToken'),
      }),
    })
        .then(res => {
          if (!res.ok)
            throw new Error(res.statusText);
          return res.json();
        })
        .then(res => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          props.setUser(null);
          navigate('/board');
        })
        .catch(err => console.log(err));
  }

  return (
    <div className="headerContainer">
      <div className="profileContainer">
        <div className="userContainer">
          <div className="bold16">{props.user?.username || "익명의 사용자"}</div>
          <div className="r12">{props.user?.univ || "로그인하세요"}</div>
        </div>
        { props.user ?
          <div>
            <button className="linkButton logoutButton" onClick={logoutHandler}>로그아웃</button>
          </div> :
          <div className="buttonContainer">
            <button className="linkButton" onClick={() => linkHandler('/login')}>로그인</button>
            <Link to='/register' className="linkText r12">회원가입</Link>
          </div>
        }
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