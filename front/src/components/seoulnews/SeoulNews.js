// src/components/NewsList.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './SeoulNews.css';
import { AuthContext } from '../login/context/AuthContext';

const SeoulNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { role } = useContext(AuthContext);

  const [itemsPerPage] = useState(10); // 페이지당 항목 수
  const [isActive, setIsActive] = useState(false);

  const pagesPerGroup = 10; // 한 번에 표시할 페이지 버튼 개수

  const location = useLocation();
  const { previousPage, previousCategory } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState(previousCategory || 'all');
  const [currentPage, setCurrentPage] = useState(previousPage || 1);

  // 추가된 searchQuery 상태
  const [searchQuery, setSearchQuery] = useState(''); // 제목 및 내용 검색을 위한 상태 추가
  const [filteredNewsList, setFilteredNewsList] = useState([]); // 검색된 뉴스 리스트 상태

  // 검색 기준을 추가하는 상태
  const [criteria, setCriteria] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('both'); // 'title', 'content', 'both'로 검색 기준 설정

  useEffect(() => {
    fetchNews(); // 컴포넌트가 마운트될 때 뉴스 데이터를 가져옵니다.
    
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/seoul/seoulNews/all');
      setNewsList(response.data);
      // 초기 상태로 전체 뉴스 리스트를 표시하도록 설정
    setFilteredNewsList(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawl = async () => {
    try {
      // 크롤링을 실행하는 API 호출
      await axios.post('/api/seoul/seoulNews/updateAll');
      // 크롤링이 완료된 후 뉴스 리스트를 다시 가져옵니다.
      fetchNews();
      alert("업데이트 완료.")
    } catch (err) {
      setError(err);
    }
  };

  // 카테고리 변경 함수 (페이지를 1로 초기화)
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
    filterNews(category, searchQuery, criteria); // 카테고리 변경 시 필터링
  };

  const handleSearch = () => {
    filterNews(selectedCategory, searchQuery, searchCriteria); // 검색 기준을 포함하여 필터링
  };

  // 카테고리 및 검색어로 뉴스 필터링 함수
  const filterNews = (category, query, criteria) => {
    let filtered = category === 'all'
      ? newsList
      : newsList.filter(news => news.seoulNewsGroup === category);

    setCriteria(criteria);
    // 검색 기준에 맞는 필터링 추가
    if (criteria === 'title') {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(query.toLowerCase())
      );
    } else if (criteria === 'content') {
      filtered = filtered.filter(news => 
        news.content.toLowerCase().includes(query.toLowerCase())
      );
    } else if (criteria === 'both') {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.content.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredNewsList(filtered); // 필터링된 뉴스 리스트 설정
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  };

  // 검색 기준 선택 시 처리
  const handleCriteriaChange = (e) => {
    setSearchCriteria(e.target.value); // select로 선택된 값에 따라 검색 기준 설정
    filterNews(selectedCategory, searchQuery, e.target.value); // 기준 변경 시 필터링
  };

  // 페이징 처리
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNewsList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredNewsList.length / itemsPerPage);
  const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousGroup = () => {
    setCurrentPage((currentPageGroup - 1) * pagesPerGroup);
  };

  const handleNextGroup = () => {
    setCurrentPage(currentPageGroup * pagesPerGroup + 1);
  };

  const getGroupDetails = (group) => {
    switch (group) {
      case 'env':
        return { text: '기후환경', className: 'env' };
      case 'eco':
        return { text: '친환경', className: 'eco' };
      case 'air':
        return { text: '공기', className: 'air' };
      case 'green':
        return { text: '녹색에너지', className: 'green' };
      default:
        return { text: '기타', className: 'default' }; // 기본 값
    }
  };

  const renderPageNumbers = () => {
    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button 
          className={`PageButton ${currentPage === i ? 'active' : ''}`}
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='seoul_container'>
      <h1>서울시 환경소식</h1>
      <div className='seoul-tab-bar'>
        <div className='seoul-tab-bar'>
          <button className={`seoul_tab_btn ${selectedCategory === 'all' ? 'active' : ''}`}
           onClick={() => handleCategoryChange('all')}>전체</button>
          <button className={`seoul_tab_btn ${selectedCategory === 'env' ? 'active-env' : ''}`}
           onClick={() => handleCategoryChange('env')}>기후환경</button>
          <button className={`seoul_tab_btn ${selectedCategory === 'eco' ? 'active-eco' : ''}`}
           onClick={() => handleCategoryChange('eco')}>친환경</button>
          <button className={`seoul_tab_btn ${selectedCategory === 'air' ? 'active-air' : ''}`}
           onClick={() => handleCategoryChange('air')}>공기</button>
          <button className={`seoul_tab_btn ${selectedCategory === 'green' ? 'active-green' : ''}`}
           onClick={() => handleCategoryChange('green')}>녹색에너지</button>
        </div>
      </div>
      {role === 'ADMIN' && (
                        <button onClick={handleCrawl}>Crawl News</button>
                    )}
      <div className='seoul-search-line'>
        <ul>
          <li>게시글 : {filteredNewsList.length}, 페이지 : {currentPage} / {totalPages}</li>
        </ul>
        {/* 검색 기능 추가 부분 */}
        <div className="search-box">
          {/* form 태그로 묶어서 submit 기능 추가 */}
          <form onSubmit={(e) => {
            e.preventDefault(); // 페이지 리로드 방지
            handleSearch(); // 검색 기능 실행
          }}>
            {/* 검색 기준 선택을 위한 select 추가 */}
            <select value={searchCriteria} onChange={handleCriteriaChange}>
              <option value="both">제목 + 내용</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>

            <input
              type="text"
              placeholder="검색어 입력"
              value={searchQuery} // 검색어 바인딩
              onChange={(e) => setSearchQuery(e.target.value)} // 검색어 변경 시 상태 업데이트
            />
            <button type="submit">검색</button> {/* 버튼 클릭 시 검색 */}
          </form>
        </div>
      </div>
      <ul className='NewsListContainer'>
        {currentItems.map((news) => {
          const { text, className } = getGroupDetails(news.seoulNewsGroup);

          return (
            <li className='NewsItem' key={news.title}>
              <div className={`NewsGroup ${className}`}>
                <p>{text}</p>
              </div>
              <Link 
                to={`/seoulNewsArticle/${news.seoulId}`} 
                state={{ previousPage: currentPage, previousCategory : selectedCategory }}
              >
                <h2 className='NewsLink'>{news.title}</h2>
              </Link>
              <Link 
                to={`/seoulNewsArticle/${news.seoulId}`} 
                state={{ previousPage: currentPage, previousCategory : selectedCategory }}
              >
                <p className='NewsDescription'>{news.content}</p>
              </Link>
              <p className='NewsDate'>{news.publishedDate}</p>
            </li>
          );
        })}
      </ul>

      <div className='PaginationContainer'>
        {currentPageGroup > 1 && (
          <button className='PaginationButton' onClick={handlePreviousGroup}>이전</button>
        )}
        {renderPageNumbers()}
        {currentPageGroup < Math.ceil(totalPages / pagesPerGroup) && (
          <button className='PaginationButton' onClick={handleNextGroup}>다음</button>
        )}
      </div>
    </div>
  );
};

export default SeoulNews;