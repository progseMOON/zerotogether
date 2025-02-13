import React, { useEffect, useState, useRef, useContext } from "react";
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import './GoogleMaps.css';
import axios from "axios";
import { AuthContext } from "../login/context/AuthContext";

const mapOptions = {
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }]
    }
  ],
};

// 구의 중심 좌표를 정의
const guCenters = {
  "강남구": { lat: 37.5172, lng: 127.0473 },
  "강동구": { lat: 37.5304, lng: 127.1237 },
  "강서구": { lat: 37.5502, lng: 126.8499 },
  "관악구": { lat: 37.4783, lng: 126.9519 },
  "광진구": { lat: 37.5386, lng: 127.0821 },
  "구로구": { lat: 37.4959, lng: 126.8875 },
  "금천구": { lat: 37.4540, lng: 126.8967 },
  "노원구": { lat: 37.6551, lng: 127.0567 },
  "도봉구": { lat: 37.6681, lng: 127.0344 },
  "동대문구": { lat: 37.5746, lng: 127.0398 },
  "동작구": { lat: 37.5110, lng: 126.9516 },
  "마포구": { lat: 37.5471, lng: 126.9085 },
  "서대문구": { lat: 37.5705, lng: 126.9361 },
  "서초구": { lat: 37.4844, lng: 127.0325 },
  "성동구": { lat: 37.5635, lng: 127.0369 },
  "성북구": { lat: 37.6107, lng: 127.0172 },
  "송파구": { lat: 37.5044, lng: 127.1067 },
  "양천구": { lat: 37.5164, lng: 126.8668 },
  "영등포구": { lat: 37.5267, lng: 126.9055 },
  "용산구": { lat: 37.5326, lng: 126.9938 },
  "은평구": { lat: 37.6040, lng: 126.9301 },
  "종로구": { lat: 37.5724, lng: 126.9769 },
  "중구": { lat: 37.5632, lng: 126.9970 },
  "중랑구": { lat: 37.6010, lng: 127.0913 },
};

const guOptions = [
  "전체", "강남구", "강동구", "강서구", "관악구", "광진구",
  "구로구", "금천구", "노원구", "도봉구", "동대문구",
  "동작구", "마포구", "서대문구", "서초구", "성동구",
  "성북구", "송파구", "양천구", "영등포구", "용산구",
  "은평구", "종로구", "중구", "중랑구"
];

const GoogleMaps = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedGu, setSelectedGu] = useState('전체'); // 기본적으로 전체 선택
  const [mapLoaded, setMapLoaded] = useState(false); // 맵 로딩 상태
  const [visibleCount, setVisibleCount] = useState(9); // 보여줄 스토어 개수

  const { role } = useContext(AuthContext);
  
  const mapRef = useRef(null);

  useEffect(() => {
    fetchStore();
  }, []);

  const updateMap = async () => {
    try {
      // 크롤링을 실행하는 API 호출
      await axios.post('/api/smartMap/save');
      alert('완료')
      fetchStore();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStore = async () => {

    fetch('/api/smartMap/load')
      .then(response => response.json())
      .then(data => setStores(data))
      .catch(error => console.error('Error fetching data:', error));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    }
    
  }

  const handleGuChange = (event) => {

    const selectedValue = event.target.value; // 선택된 구의 값

    setSelectedGu(event.target.value);
    setSelectedStore(null); // 구 변경 시 InfoWindow 닫기

    // 구가 선택될 때 해당 구의 중심으로 맵 이동
    if (selectedValue === "전체" && mapRef.current) {
        mapRef.current.panTo({ lat: 37.5665, lng: 126.9780 }); // 서울 중심으로 이동
    } else if (selectedValue in guCenters && mapRef.current) {
        mapRef.current.panTo(guCenters[selectedValue]);
    }
    // 스토어 개수 초기화
    setVisibleCount(9);

  };

  const buttonGuChange = (value) => {

    setSelectedGu(value);
    setSelectedStore(null); // 구 변경 시 InfoWindow 닫기

    // 구가 선택될 때 해당 구의 중심으로 맵 이동
    if (value === "전체" && mapRef.current) {
        mapRef.current.panTo({ lat: 37.5665, lng: 126.9780 }); // 서울 중심으로 이동
    } else if (value in guCenters && mapRef.current) {
        mapRef.current.panTo(guCenters[value]);
    }

    // 스토어 개수 초기화
    setVisibleCount(9);
  };

  const filteredStores = selectedGu === '전체'
    ? stores
    : stores.filter(store => store.guName === selectedGu);

  const storesToDisplay = selectedStore ? [selectedStore] : filteredStores;

  const handleMarkerClick = (store) => {
    setSelectedStore(store);
    // 구글 맵으로 스크롤
    const mapContainer = document.querySelector('.map-container'); // 구글 맵을 포함하는 컨테이너
    if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePanToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.panTo(currentLocation);
    }
  };

  const handleLoad = (map) => {
    mapRef.current = map; // 맵 인스턴스를 저장
    setMapLoaded(true); // 맵이 로드되었음을 설정
  };

  const loadMoreStores = () => {
    setVisibleCount(prevCount => prevCount + 9); // 9개씩 증가
  };



  

  return (
    <div className="map-container">
      
      <div className="map-item">
        <LoadScript googleMapsApiKey="AIzaSyAXBLeEgcEIgMJkKLamUtOFbfsEqtvHgYA">
          <select className="gu-dropdown" value={selectedGu} onChange={handleGuChange}>
            {guOptions.map(gu => (
              <option key={gu} value={gu}>{gu}</option>
            ))}
          </select>

          <GoogleMap
            options={mapOptions}
            mapContainerStyle={{ width: '100%', height: '600px' }}
            center={currentLocation || { lat: 37.5665, lng: 126.9780 }}
            zoom={12}
            onLoad={handleLoad}
          >
            
            {mapLoaded && storesToDisplay.map((store, index) => {
              const lat = parseFloat(store.coordY);
              const lng = parseFloat(store.coordX);
              const isSelectedStore = selectedStore && store.name === selectedStore.name;

              // 선택된 마커만 표시
              if (!selectedStore || isSelectedStore) {
                return (
                  <Marker
                    key={index}
                    position={{ lat, lng }}
                    title={store.name}
                    onClick={() => handleMarkerClick(store)}
                  >
                    {selectedStore && isSelectedStore && (
                      <InfoWindow onCloseClick={() => setSelectedStore(null)}>
                        <div className="info-window">
                          <h2>{selectedStore.name}</h2>
                          <p>전화번호 : {selectedStore.telNo}</p>
                          <p>주소 : {selectedStore.addrNew}</p>
                          <p>운영시간 : {selectedStore.openingHours}</p>
                          <p>판매물품 : {selectedStore.sales}</p>
                          
                          {/* 홈페이지 링크 */}
                          {selectedStore.link && selectedStore.link !== "null" && (
                            <p>
                              홈페이지 : <a href={selectedStore.link} target="_blank" rel="noopener noreferrer">{selectedStore.link}</a>
                            </p>
                          )}

                          {/* 인스타그램 링크 */}
                          {selectedStore.instaUrl && selectedStore.instaUrl !== "null" && (
                            <p>
                              인스타 : <a href={selectedStore.instaUrl} target="_blank" rel="noopener noreferrer">{selectedStore.instaUrl}</a>
                            </p>
                          )}
                          <p> 
                            <a 
                              href={`https://www.google.com/maps?q=${encodeURIComponent(selectedStore.addrNew)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              구글맵에서 위치 보기
                            </a>
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              }
              return null;
            })}

            {/* {currentLocation && mapLoaded && (
              <Marker
                position={currentLocation}
                title="현재 위치"
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "blue",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "white"
                }}
              />
            )}

            <button className="current-location-button" onClick={handlePanToCurrentLocation}>
              홈
            </button> */}
          </GoogleMap>
        
        
          <div className="gu-list">
            {guOptions.map((gu) => (
              <button
                  key={gu}
                  onClick={() => buttonGuChange(gu)}
                  className={`gu-button ${selectedGu === gu ? 'selected' : ''}`} // CSS 클래스 적용
              >
                  {gu}
              </button>
          ))}
          </div>

          {role === 'ADMIN' && (
                        <button onClick={updateMap}>Crawl News</button>
                    )}
          <div className="store-list">
            {filteredStores.slice(0, visibleCount).map((store, index) => (
              <div key={index} className="store-card" onClick={() => handleMarkerClick(store)}>
                <h2>{store.name}</h2>
                <p>주소 : {store.addrNew}</p>
                <p>전화번호 : {store.telNo}</p>
                {store.openingHours && store.openingHours !== "null" && (
                  <p>
                    운영시간 : {store.openingHours}
                  </p>
                )}

                {store.sales && store.sales !== "null" && (
                  <p>
                    판매물품 : {store.sales}
                  </p>
                )}
              </div>
            ))}
          </div>
          {filteredStores.length > visibleCount && (
            <div className="load-more-container"> {/* 추가된 div */}
              <button className="load-more-button" onClick={loadMoreStores}>
                더보기
              </button>
            </div>
          )}
        </LoadScript>
      </div>
    </div>
  );
};

export default GoogleMaps;
