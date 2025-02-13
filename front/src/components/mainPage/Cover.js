// src/components/CoverPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cover.css';

const videos = [
  '/images/media/grass.mp4',
  '/images/media/water.mp4',
  '/images/media/cliff.mp4',
  '/images/media/bird.mp4'
];

const Cover = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [fade, setFade] = useState(false); // 비디오 전환 상태
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/mainpage'); // 메인 페이지로 이동
  };

  // 비디오가 끝날 때마다 다음 비디오로 전환
  const handleVideoEnd = () => {
    setFade(true); // 페이드 아웃 시작
    setTimeout(() => {
      setCurrentVideo((prevVideo) => (prevVideo + 1) % videos.length);
      setFade(false); // 페이드 인 시작
    }, 1000); // 1초 후에 다음 비디오로 전환
  };

  useEffect(() => {
    const videoElement = document.getElementById('background-video');
    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  return (
    <div className="cover-container">
      <video
        id="background-video"
        className={`bg-video ${fade ? 'fade-out' : 'fade-in'}`}
        autoPlay
        muted
        src={videos[currentVideo]} // 현재 비디오 소스
      />
      <div className="cover-content">
        <h1>WELCOME TO ZERO TOGETHER</h1>
        <h1>TO SAVE THE EARTH</h1>
        <button onClick={handleEnter}>&nbsp;입&nbsp;장&nbsp;하&nbsp;기&nbsp;</button>
      </div>
    </div>
  );
};

export default Cover;
