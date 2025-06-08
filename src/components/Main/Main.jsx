import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from '../Header/Header'
import reissueToken from "../../global/reissueToken";


export default function Main() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/auth/detail`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('accessToken'),
        },
      })
        .then(res => res.json())
        .then(res => {
          if (res.code === 4010) {
            reissueToken(this);
          }
          setUser({
            id: res.data.userId,
            username: res.data.username,
            univ: res.data.univ,
          });
        });
    }
  }, []);

  return (
    <div>
      <Header user={user}/>
      <Outlet user={user}/>
    </div>
  );
}