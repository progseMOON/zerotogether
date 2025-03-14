import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './RssData.css'
import { AuthContext } from '../login/context/AuthContext';

function RssData() {
    const [rssItems, setRssItems] = useState([]);
    const [filteredRssItems, setFilteredRssItems] = useState([]); // 검색된 결과 상태 추가
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 추가
    const [searchCriteria, setSearchCriteria] = useState('title'); // 검색 기준 상태 추가 (title, description, both)

    const { role } = useContext(AuthContext);

    const location = useLocation();
    const { previousPage } = location.state || {};

    const [currentPage, setCurrentPage] = useState(previousPage || 1);
    const [itemsPerPage] = useState(10); // 페이지당 항목 수

    const pagesPerGroup = 5; // 한 번에 표시할 페이지 버튼 개수

    // 데이터 fetch 함수
    const fetchRssData = async () => {
        try {
            const response = await axios.get('/api/rss/env/list');
            setRssItems(response.data); // 데이터 저장
            setFilteredRssItems(response.data);
        } catch (error) {
            console.error('Error fetching RSS data:', error);
        }
    };

    // 컴포넌트 마운트 시 데이터 fetch
    useEffect(() => {
        fetchRssData();
    }, []);

    // 데이터 업데이트 핸들러
    const handleUpdate = async () => {
        try {
            await axios.post('/api/rss/env'); // 데이터 업데이트 요청
            fetchRssData(); // 업데이트 후 데이터 다시 fetch
            alert("업데이트 완료.")
        } catch (error) {
            console.error('Error updating RSS data:', error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            // 검색어가 비어있으면 전체 리스트로 복원
            setFilteredRssItems(rssItems);
            return;
        }

        const filteredResults = rssItems.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const descriptionMatch = item.description.toLowerCase().includes(searchQuery.toLowerCase());

            switch (searchCriteria) {
                case 'title':
                    return titleMatch;
                case 'description':
                    return descriptionMatch;
                case 'both':
                    return titleMatch || descriptionMatch;
                default:
                    return false;
            }
        });

        // rssId 내림차순으로 정렬
        filteredResults.sort((a, b) => b.rssId - a.rssId);
        
        setFilteredRssItems(filteredResults);
        setCurrentPage(1); // 검색 후 1페이지로 이동
    };

    // 현재 페이지에 해당하는 항목들만 가져옴
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRssItems.slice(indexOfFirstItem, indexOfLastItem);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredRssItems.length / itemsPerPage);

    // 현재 페이지 그룹의 시작 및 끝 페이지 계산
    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
    const groupStart = (currentGroup - 1) * pagesPerGroup + 1;
    const groupEnd = Math.min(groupStart + pagesPerGroup - 1, totalPages);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 페이징 버튼 렌더링
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = groupStart; i <= groupEnd; i++) {
            pageNumbers.push(
                <button 
                    className={`rss-PageButton ${currentPage === i ? 'active' : ''}`}
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
    

    return (
        <div className='RSS-container'>
            <div className='RSS-main-title'>
                <h1>환경부 정책소식</h1>
                
            </div>
            {role === 'ADMIN' && (
                        <button onClick={handleUpdate}>Crawl News</button>
                    )}

            <div className='rss-search-line'>
                
                <p>게시글 : {filteredRssItems.length}, 페이지 : {currentPage} / {totalPages}</p>
                
                {/* 검색 기능 UI */}
                <div className='rss-SearchContainer'>
                    <form onSubmit={(e) => {
                        e.preventDefault(); // 페이지 리로딩 방지
                        handleSearch();
                    }}>
                        <select 
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                        >
                            <option value='both'>제목 + 내용</option>
                            <option value='title'>제목</option>
                            <option value='description'>내용</option>
                        </select>
                        <input 
                            type='text'
                            placeholder='검색어 입력'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={handleSearch}>검색</button>
                    </form>
                </div>
            </div>
            <div className='rss-NewsListContainer'>
                <ul>
                    {currentItems.map((item, index) => (
                        <li className='rss-NewsItem' key={index}>
                            <div className={`rss-NewsGroup`}>
                                <p>환경부</p>
                            </div>
                            <Link 
                                to={`/minEnv/${item.rssId}`}
                                state={{ previousPage: currentPage }}>
                                <h3 className='rss-NewsLink'>{item.title}</h3>
                            </Link>
                            <Link 
                                to={`/minEnv/${item.rssId}`}
                                state={{ previousPage: currentPage }}>
                                <p className='rss-NewsDescription'>{item.description}</p>
                            </Link>
                            <span className='rss-NewsDate'>조회수 : {item.pubDate}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 페이징 버튼 */}
            <div className='rss-PaginationContainer'>
                {groupStart > 1 && (
                    <button className='rss-PaginationButton' onClick={() => handlePageChange(groupStart - 1)}>이전</button>
                )}
                {renderPageNumbers()}
                {groupEnd < totalPages && (
                    <button className='rss-PaginationButton' onClick={() => handlePageChange(groupEnd + 1)}>다음</button>
                )}
            </div>
        </div>
    );
}

export default RssData;