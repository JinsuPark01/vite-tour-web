import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./Home.css";
import tourBaseImage from "./assets/tour_base.png";

const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";
const KAKAO_MAP_APP_KEY = "93baabd95e205ffbc2161eed8f8e8b7f";

const OPENWEATHER_API_KEY = "0ba6e7d71368e83252170ec20e0cc22d";

const Home = () => {
  const [posts, setPosts] = useState([]); // 전체 게시물
  const [selectedPost, setSelectedPost] = useState(null); // 마커 클릭 시 선택된 게시물 + 날씨 정보보
  const [isMapReady, setIsMapReady] = useState(false);

  // ✅ 1. 카카오 맵 스크립트 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(36.3504, 127.3845),
            level: 13,
          };
          const map = new window.kakao.maps.Map(container, options);
          window._kakaoMap = map;
          setIsMapReady(true);
        });
      }
    };

    if (!document.getElementById(KAKAO_MAP_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
      script.onload = loadKakaoMap;
      document.body.appendChild(script);
    } else {
      loadKakaoMap();
    }
  }, []);

  // ✅ 2. Firebase에서 게시물 전체 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, "tourMemo"));
      const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);
  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`
      );
      if (!res.ok) throw new Error("날씨 정보 로드 실패");
      const data = await res.json();
      return {
        temp: data.main.temp, // 현재 온도(섭씨)
        weather: data.weather[0].description, // 날씨 설명 (ex: 맑음, 흐림 등)
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // ✅ 3. 마커 생성 (location만 사용)
  useEffect(() => {
    if (!isMapReady || posts.length === 0) return;

    const map = window._kakaoMap;
    const geocoder = new window.kakao.maps.services.Geocoder();

    posts.forEach((post) => {
      geocoder.addressSearch(post.location, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const marker = new window.kakao.maps.Marker({
            map,
            position: coords,
          });

          // 마커 클릭 시 해당 post 정보 표시
          window.kakao.maps.event.addListener(marker, "click", async () => {
            // 클릭 시 해당 위치 위경도로 날씨 조회
            const weather = await fetchWeather(result[0].y, result[0].x);
            setSelectedPost({ ...post, weather });
          });
          
          // // 인포윈도우 생성
          // const infowindow = new window.kakao.maps.InfoWindow({
          //   content: `<div style="width:150px;text-align:center;padding:6px 0;">${post.title}</div>`,
          // });
          // infowindow.open(map, marker);
        }
      });
    });
  }, [isMapReady, posts]);

  const getTemperatureColor = (temp) => {
    if (temp <= -10) return "#0000FF"; // 매우 추움 (파랑)
    if (temp <= 0) return "#1E90FF"; // 추움 (밝은 파랑)
    if (temp <= 10) return "#00CED1"; // 선선함 (청록)
    if (temp <= 20) return "#32CD32"; // 적당함 (초록)
    if (temp <= 25) return "#FFD700"; // 따뜻함 (노랑)
    if (temp <= 30) return "#FFA500"; // 더움 (주황)
    if (temp <= 35) return "#FF4500"; // 매우 더움 (밝은 빨강)
    return "#FF0000"; // 극도로 더움 (빨강)
  };

  const getWeatherEmoji = (weatherDescription) => {
    const emojiMap = {
      "맑음": "☀️",
      "구름조금": "🌤️",
      "흩어진구름": "⛅",
      "튼구름": "🌥️",
      "온흐림": "☁️",
      "약한 비": "🌦️",
      "보통 비": "🌧️",
      "강한 비": "🌧️",
      "매우 강한 비": "🌧️",
      "극심한 비": "🌧️",
      "어는 비": "❄️🌧️",
      "약한 소나기": "🌦️",
      "소나기": "🌦️",
      "강한 소나기": "🌦️",
      "약한 이슬비": "🌦️",
      "이슬비": "🌦️",
      "강한 이슬비": "🌦️",
      "천둥번개": "⚡",
      "천둥 + 약한 비": "⚡🌦️",
      "천둥 + 강한 비": "⚡🌧️",
      "천둥 + 우박": "⚡❄️",
      "약한 눈": "🌨️",
      "눈": "❄️",
      "강한 눈": "❄️",
      "진눈깨비": "🌨️",
      "옅은 안개": "🌫️",
      "연기": "💨",
      "실안개": "🌫️",
      "먼지": "💨",
      "짙은 안개": "🌫️",
      "모래 폭풍": "💨",
      "화산재": "🌋",
      "돌풍": "🌬️",
      "토네이도": "🌪️",
    };
    return emojiMap[weatherDescription] || ""; // 매핑되지 않을 경우 이모티콘 없음
  };

  return (
    <div className="home-page">
      <h1 style={{ color: "purple", fontSize: "2rem", marginBottom: "1rem", fontWeight: "bold", textAlign: "center" }}>
        Home
      </h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          id="map"
          style={{
            width: "60%",
            aspectRatio: "25/16",
            border: "1px solid #ccc",
          }}
        ></div>

        {/* 마커 클릭 시 오른쪽 카드 영역 */}
        <div style={{ width: "30%", padding: "1rem", border: "1px solid #ddd", borderRadius: "10px" }}>
          {selectedPost ? (
            <div>
              <img
                src={selectedPost.photoURL}
                alt="선택된 사진"
                style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }}
              />
              <h2 style={{ fontSize: "1rem", color: "#666" }}>{selectedPost.location}</h2>
              <h3 style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>{selectedPost.title}</h3>
              <p style={{ fontWeight: "bold", color: getTemperatureColor(selectedPost.weather.temp) }}>
                현재 온도: {selectedPost.weather.temp.toFixed(1)}°C
              </p>
              <p style={{ fontWeight: "bold" }}>
                날씨: {selectedPost.weather.weather} {getWeatherEmoji(selectedPost.weather.weather)}
              </p>
              <button
                onClick={() =>
                  window.open(`https://www.youtube.com/results?search_query=${selectedPost.title}`, "_blank")
                }
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  backgroundColor: "red",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                YouTube 검색
              </button>
            </div>
          ) : (
            <div>
              <img
                src={tourBaseImage}
                alt="마커 선택 전 이미지"
                style={{ width: "100%", height: "180px", objectFit: "contain", borderRadius: "8px", marginBottom: "1rem" }}
              />
              <h2 style={{ fontSize: "1rem", color: "#666" }}>주소</h2>
              <h3 style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>마커를 클릭해주세요.</h3>
              <p style={{ fontWeight: "bold" }}>
                현재 온도:
              </p>
              <p style={{ fontWeight: "bold" }}>날씨:</p>
              <button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  backgroundColor: "gray",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                YouTube 검색
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
