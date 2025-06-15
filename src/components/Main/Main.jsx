import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from '../Header/Header'
import reissueToken from "../../global/reissueToken";

export default function Main() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (localStorage.getItem('accessToken'))
      getUserDetail();
  }, []);

  const getUserDetail = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/detail`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('accessToken'),
      },
    })
        .then(res => res.json())
        .then(res => {
          if (res.code === 1014)
            setUser({
              id: res.data.id,
              email: res.data.email,
              username: res.data.username,
              univ: res.data.univ,
            });
          else if (res.code === 4010)
            reissueToken(getUserDetail);
        });
  }

  return (
    <div>
      <Header
          user={user}
          setUser={setUser}
          getUserDetail={getUserDetail}
      />
      <Outlet context={{ user, setUser, getUserDetail }} />
    </div>
  );
}