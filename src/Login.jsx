//Login.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import app from "./firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import useLoginStore from "./useLoginStore";

const Login = () => {
  const { isLogined, logined, logouted } = useLoginStore();
  let [nickName, setNickName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let pwRef = useRef();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const nickNameChangeHandle = (e) => setNickName(e.target.value);
  const emailChangeHandle = (e) => setEmail(e.target.value);
  const passwordChangeHandle = (e) => setPassword(e.target.value);

  const signUpHandle = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("비밀번호의 길이는 6자리 이상 사용해야 합니다.");
      pwRef.current.focus();
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: nickName });
        alert("회원가입이 완료되었습니다.");
        setNickName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => console.log(error));
  };

  const signInHandle = (e) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        logined(user.displayName);
        alert("로그인하였습니다.");
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => console.log("에러 발생 :", error));
  };

  const logOutHandle = () => {
    signOut(auth)
      .then(() => {
        logouted();
        alert("로그아웃이 완료되었습니다.");
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="login-page">
      <h1 style={{ color: 'purple', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>Log in/Sign up</h1>
      <form className="login-form" style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label htmlFor="nickName" style={{ display: 'block', fontSize: '1rem', color: '#333', marginBottom: '0.5rem' }}>Nick Name</label>
          <input
            type="text"
            id="nickName"
            value={nickName}
            onChange={nickNameChangeHandle}
            placeholder="회원가입시에만 입력"
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label htmlFor="email" style={{ display: 'block', fontSize: '1rem', color: '#333', marginBottom: '0.5rem' }}>E-mail</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={emailChangeHandle}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label htmlFor="password" style={{ display: 'block', fontSize: '1rem', color: '#333', marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            id="password"
            ref={pwRef}
            value={password}
            onChange={passwordChangeHandle}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
          />
        </div>
        <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isLogined ? (
            <button
              type="button"
              onClick={logOutHandle}
              style={{ flex: 1, marginRight: '0.5rem', padding: '0.5rem', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              로그아웃
            </button>
          ) : (
            <button
              type="button"
              onClick={signInHandle}
              style={{ flex: 1, marginRight: '0.5rem', padding: '0.5rem', backgroundColor: '#6200ea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              로그인
            </button>
          )}
          <button
            type="button"
            id="register"
            onClick={signUpHandle}
            style={{ flex: 1, marginLeft: '0.5rem', padding: '0.5rem', backgroundColor: '#6200ea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;