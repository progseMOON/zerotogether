import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // 스크롤 상단으로 이동
  }, [location.pathname]); // 경로가 바뀔 때마다 실행

  return null;
};

export default ScrollToTop;
