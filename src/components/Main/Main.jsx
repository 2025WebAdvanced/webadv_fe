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
        .then(res => {
          if (!res.ok)
            throw new Error(res.statusText);
          return res.json();
        })
        .then(res => {
          setUser({
            id: res.data.id,
            username: res.data.username,
            univ: res.data.univ,
          });
        })
        .catch(err => {
          console.log(err);
          reissueToken();
        })
  }

  return (
    <div>
      <Header
          user={user}
          setUser={setUser}
          getUserDetail={getUserDetail}
      />
      <Outlet
          user={user}
          getUserDetail={getUserDetail}
      />
    </div>
  );
}