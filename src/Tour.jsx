//Tours.jsx
import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./firebaseConfig";
import "./App.css";
import {
    getStorage,    ref,    uploadBytesResumable,
    getDownloadURL, } from "firebase/storage";
import useLoginStore from "./useLoginStore";
 const Tour = () => {
    //Tour 컴포넌트
    const db = getFirestore(app); //파이어스토어 데이터베이스 연결
    const storage = getStorage(app); //이미지 저장을 위한 스토리지 연결

    const isLogined = useLoginStore((state) => state.isLogined);
    //console.log("db : ", db);
    let [location1, setLocation1] = useState("");
    let [title, setTitle] = useState("");
    let [date1, setDate1] = useState("");
    let [comment, setComment] = useState("");
    let [image, setImage] = useState(null); //업로드할 파일 객체
    const locHandle = (e) => {
        //여행지 위치 등록 정보
        //e.preventDefault();
        setLocation1(e.target.value);
    };
    const dateHandle = (e) => {
        //e.preventDefault();
        setDate1(e.target.value);
    };
    const commentHandle = (e) => {
        //e.preventDefault();
        setComment(e.target.value);
    };
    const handleReset = () => {
        //초기화
        setLocation1("");
        setTitle("");
        setDate1("");
        setComment("");
        setImage(null);
    };
    //이미지를 포함한 데이터 저장
    const storeHandle = async (e) => {
        e.preventDefault();
        if (!isLogined) {
            alert("로그인을 해야 업로드가 가능합니다.");
            return;
        }
        if (image == null) return;

        const storageRef = ref(storage, `images/${image.name}`);
        let photoURL = null;
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress tracking (optional)
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    photoURL = downloadURL;
                    addDoc(collection(db, "tourMemo"), {
                        location: location1,
                        title,
                        date: date1,
                        comment,
                        photoURL,
                    });

                    handleReset();
                    alert("한 건의 여행 추억을 등록하였습니다.");
                });
            }
        );
    };

    return (
        <div className="tour-page">
            <h1 style={{ color: 'purple', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>Write</h1>
            <p className="page-subtitle" style={{ fontSize: "16px", textAlign: "center" }}>(로그인 상태에서만 가능함)</p>
            <form className="tour-form" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="form-group">
                    <label htmlFor="여행지">여 행 지 : 정확한 주소를 입력해주세요!</label>
                    <input
                        type="text"
                        id="여행지"
                        onChange={locHandle}
                        value={location1}
                        className="form-input"
                        style={{ lineHeight: "1.6em" }}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="title">제 목</label>
                    <input
                        type="text"
                        id="title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-input"
                        style={{ lineHeight: "1.6em" }}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">날 짜</label>
                    <input
                        type="date"
                        id="date"
                        onChange={dateHandle}
                        value={date1}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="평가">한 줄 평</label>
                    <textarea
                        id="평가"
                        onChange={commentHandle}
                        value={comment}
                        className="form-textarea"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="file">사 진 첨 부</label>
                    <input
                        type="file"
                        id="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="form-input"
                    />
                </div>
                <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        type="submit"
                        onClick={storeHandle}
                        className="btn btn-primary"
                        style={{ color: "white", backgroundColor: "blue", flex: 1, marginRight: '0.5rem' }}
                    >
                        저장소에 저장하기
                    </button>
                    <input
                        type="reset"
                        value="초기화"
                        onClick={handleReset}
                        className="btn btn-secondary"
                        style={{ flex: 1, marginLeft: '0.5rem' }}
                    />
                </div>
            </form>
        </div>
    );
};
export default Tour;