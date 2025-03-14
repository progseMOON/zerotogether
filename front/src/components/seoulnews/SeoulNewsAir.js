// src/components/NewsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SeoulNewsAir = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews(); // 컴포넌트가 마운트될 때 뉴스 데이터를 가져옵니다.
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/seoul/seoulNews/air');
      setNewsList(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawl = async () => {
    const group = 'air'; // 예시로 'env' 값을 사용
    try {
      await axios.post('/api/seoul/seoulNews/update', null, {
        params: { group } // group이라는 파라미터로 보냄
      });
      fetchNews();
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Seoul News</h1>
      <button onClick={handleCrawl}>Crawl News</button> {/* 크롤링 버튼 추가 */}
      <ul>
        {newsList.map((news) => (
          <li key={news.title}>
            <h2>{news.title}</h2>
            <p>{news.content}</p>
            <Link to={`/seoulNewsArticle/${news.seoulId}`}>Read more</Link>
            <p>{news.publishedDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeoulNewsAir;