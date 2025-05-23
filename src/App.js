import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import WritePost from './components/WritePost/WritePost';
import Post from './components/Post';
import Login from './components/Login';
import Register from './components/Register/Register';
import List from './components/List/List';
import NotFound from './components/NotFound/NotFound';

import './App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Main />}>
            <Route path='/board' element={<List />} />
            <Route path='/board/write' element={<WritePost />} />
            <Route path='/board/*' element={<Post />} />
          </Route>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
