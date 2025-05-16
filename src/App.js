import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import WritePost from './components/WritePost';
import Post from './components/Post';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/write' element={<WritePost />}></Route>
          <Route path='/post' element={<Post />}></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
