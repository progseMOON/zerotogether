import React from 'react';
import { useLocation } from 'react-router-dom';
import './SuccessFailurePage.css'; // 스타일을 불러옵니다.

const FailurePage = () => {
  const location = useLocation();
  const { error, response } = location.state;

  return (
    <div className="failure-page">
      <h1 className="title">결제 실패</h1>
      <p className="info">실패 원인: <span className="highlight">{error}</span></p>

      <a href="http://localhost:3000/mainpage" className="back-btn">메인 페이지로 돌아가기</a>
    </div>
  );
};

export default FailurePage;
