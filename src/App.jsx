//App.jsx
//import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router";
import Home from "./Home";
import Photos from "./Photos";
import Tour from "./Tour";
import EditTrip from "./EditTrip";
import Login from "./Login";
import useLoginStore from "./useLoginStore";
//로그인상태및username 구독
function App() {
  //let [isLogined] = useRecoilState(loginAtom);
  //이 방식으로 상태값을 얻어서 사용할 수 있음
  // let isLogined = useRecoilValue(loginAtom);
  const isLogined = useLoginStore((state) => state.isLogined);
  const userName = useLoginStore((state) => state.userName);
  return (
    <BrowserRouter>
      <header className="app-header">
        <h1 className="header">Welcome to React & Firebase</h1>
      </header>
      <nav className="navi">
        <NavLink to="/" className="nav-item">Home</NavLink>
        <NavLink to="/photos" className="nav-item">Photos</NavLink>
        <NavLink to="/tour" className="nav-item">Write</NavLink>
        <NavLink to="/login" className="nav-item">Login</NavLink>
      </nav>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/editTrip/:docId" element={<EditTrip />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
export default App;