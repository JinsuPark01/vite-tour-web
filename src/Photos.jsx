// Photos.jsx
import React, { useState, useEffect } from "react";
import "./photos.css";
import app from "./firebaseConfig";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Link, useNavigate } from "react-router";
import useLoginStore from "./useLoginStore";

const Photos = () => {
  const db = getFirestore(app); //파이어스토어 데이터베이스 연결
  const storage = getStorage(app); //storage(이미지 저장)
  const navigate = useNavigate();
  const isLogined = useLoginStore((state) => state.isLogined);

  const [displayList, setDisplayList] = useState([]); //디스플레이할 객체들
  const [docId, setDocId] = useState(""); //문서 id(여행 에디팅(수정)시 사용
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    //   getData();
    const getData = async () => {
      //아래는 콜렉션의 모든 내용을 읽어들이는 구문
      const querySnapshot = await getDocs(collection(db, "tourMemo")); //콜렉션명:tourMemo

      setDisplayList([]); //초기화
      querySnapshot.forEach((doc) => {
        // doc.data()[실제 저장된 객체] is never undefined for query doc snapshots
        //doc.data().속성명 을 작성한 템플릿에 맵핑시켜서 완성하면 됨.

        console.log(doc.id, " => ", doc.data());
        setDocId((preId) => [...preId, doc.id]);
        let ob = doc.data(); //저장한 데이터 객체
        setDisplayList((arr) => [...arr, ob]);
      });
    };

    getData();
  }, []);
  const deleteHandle = async (docId, photoURL) => {
    //이미지 파일의 참조 주소를 얻음
    const photoImageRef = ref(storage, photoURL);
    // 이미지 파일 지우기(url인데 정상 동작하는지 확인...)
    deleteObject(photoImageRef)
      .then(() => {
        // File deleted successfully
        console.log("이미지 지우기가 성공하였습니다.");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log("이미지 지우기에 실패하였습니다.");
      });
    //database에서 제거하기
    await deleteDoc(doc(db, "tourMemo", docId));
    //제거 완료 후 경고창에 보여주기
    alert("데이터가 제거되었습니다.");
    navigate("/photos");
  };

  const filteredList = displayList.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="photos-page">
      <h1 style={{ color: 'purple', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>Photos</h1>
      <h1>여기는 추억의 사진들이 전시될 공간...</h1>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ display: 'block', margin: '1rem auto', padding: '0.5rem', width: '80%', borderRadius: '8px', border: '1px solid #ccc' }}
      />
      
      <section className="cards">
        {paginatedList.map((item, index) => (
          <div className="card" key={index}>
            <img
              className="cardImage"
              src={item.photoURL}
              alt="추억의 사진"
            />
            <div className="cardContent">
              <h2 className="cardTitle" style={{ fontSize: '1.0rem', fontWeight: 'normal', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.location}</h2> {/* Restrict to single line with ellipsis */}
              <h3 className="cardTitle" style={{ fontSize: '2.0rem', marginTop: '0.5rem' }}>{item.title}</h3> {/* Adjusted spacing */}
              <p className="cardText">{item.comment}</p>
              <p className="cardDate">{item.date}</p>
            </div>
            <div className="buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                className="youtubeSearchButton"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${item.title}`, '_blank')}
                style={{ flex: 1, color: 'white', backgroundColor: 'red', marginBottom: '0.5rem' }}
              >
                Search YouTube Videos
              </button>
              
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                {isLogined && (
                  <Link
                  to={`/editTrip/${docId[index]}`}
                  className="editButton"
                  style={{ flex: 1, textAlign: 'center' }}
                  >
                    Edit
                  </Link>
                )}
                {isLogined && (
                  <button
                  type="button"
                  className="deleteButton"
                  onClick={() => deleteHandle(docId[index], item.photoURL)}
                  style={{ flex: 1 }}
                  >
                    Delete
                  </button>
                )}
              </div>
          </div>
        ))}
      </section>
      <div className="pagination" style={{ textAlign: 'center', marginTop: '1rem' }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{ margin: '0 0.5rem', padding: '0.5rem 1rem', backgroundColor: currentPage === index + 1 ? 'blue' : 'gray', color: 'white', border: 'none', borderRadius: '8px' }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Photos;