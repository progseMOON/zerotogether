import React, { useEffect, useState } from 'react';
import "./MainPageNews.css"
import axios from 'axios';
import { Link } from 'react-router-dom';

const MainPageNewsCopy = () => {
    // 탭 상태 관리
    const [activeTab, setActiveTab] = useState('tab1');

    const [naverNews, setNaverNews] = useState([])
    const [seoulNews, setSeoulNews] = useState([])
    const [notices, setNotices] = useState([])
    const [envLaw, setEnvLaw] = useState([])

    // 탭 클릭 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // 날짜 유효성 검사 함수
    const validateDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    // 날짜 포맷팅 함수
    const formatDate = (date) => {
        if (!date) return '날짜 없음';
        return date instanceof Date ? date.toISOString().split('T')[0] : '유효하지 않은 날짜';
    };


    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/notices', {
                    params: { page: 1, size: 6 } // 최근 6개의 공지사항만 가져옵니다.
                });
                const validatedNotices = response.data.notices.map(notice => ({
                    ...notice,
                    created: validateDate(notice.created)
                }));
                setNotices(validatedNotices);
            } catch (error) {
                console.error('Error fetching notices:', error);
            }
        };


        const fetchNaverNews = async () => {
            try {
                const response = await axios.get('/api/naver/news/miniNews');
                console.log('NaverNews data:', response.data); // 데이터가 제대로 받아졌는지 콘솔에 출력
                setNaverNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        const fetchSeoulNews = async () => {
            try {
                const response = await axios.get('/api/seoul/seoulNews/mini');
                console.log('SeoulNews data:', response.data); // 데이터가 제대로 받아졌는지 콘솔에 출력
                setSeoulNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        const fetchEnvLaw = async () => {
            try {
                const response = await axios.get('/api/rss/env/mini');
                console.log('EnvLaw data:', response.data); // 데이터가 제대로 받아졌는지 콘솔에 출력
                setEnvLaw(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };


        fetchNotices();
        fetchNaverNews();
        fetchSeoulNews();
        fetchEnvLaw();
    },[])



    return (
        <div className="board_tab_wrap">
            <ul className="tabs" id="tabs">
                <li className={`tab ${activeTab === 'tab1' ? 'active' : ''}`}>
                    <button onClick={() => handleTabClick('tab1')} title="">공지사항</button>
                </li>
                <li className={`tab ${activeTab === 'tab2' ? 'active' : ''}`}>
                    <button onClick={() => handleTabClick('tab2')} title="">네이버 환경소식</button>
                </li>
                <li className={`tab ${activeTab === 'tab3' ? 'active' : ''}`}>
                    <button onClick={() => handleTabClick('tab3')} title="">서울시 환경소식</button>
                </li>
                <li className={`tab ${activeTab === 'tab4' ? 'active' : ''}`}>
                    <button onClick={() => handleTabClick('tab4')} title="">환경부 정책소식</button>
                </li>
            </ul>

            <div className="tab_container">
    {activeTab === 'tab1' && (
        <div id="tab1" className="tab_content">
            {/* 공지사항 제목과 더 보기 링크를 한 줄에 배치 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', marginBottom: '20px' }}>
                <h3 className="hidden_only" style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '600', color: '#454545' }}>공지사항</h3>
                <Link to="/notices" className="more-link" style={{ color: '#008000', fontWeight: 'bold', textDecoration: 'none' }}>더 보기</Link>
            </div>

            <ul className="board_list">
                {notices.map((notice, index) => (
                    <li key={index}>
                        <Link to={`/notices/${notice.noticeId}`}>{notice.title}</Link>
                        <span className="board_date">{new Date(notice.createdAt).toISOString().split('T')[0]}</span>
                    </li>
                ))}
            </ul>
        </div>
    )}
    
    {activeTab === 'tab2' && (
        <div id="tab2" className="tab_content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', marginBottom: '20px' }}>
                <h3 className="hidden_only" style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '600', color: '#454545' }}>네이버 환경소식</h3>
                <Link to="/naverNewsList" className="more-link" style={{ color: '#008000', fontWeight: 'bold', textDecoration: 'none' }} >더 보기</Link>
            </div>

            <ul className="board_list">
                {naverNews.map((news, index) => (
                    <li key={index}>
                        <a href={news.link} target="_blank" rel="noopener noreferrer">{news.title}</a>
                        <span className="board_date">{new Date(news.pubDate).toISOString().split('T')[0]}</span>
                    </li>
                ))}
            </ul>
        </div>
    )}
    
    {activeTab === 'tab3' && (
        <div id="tab3" className="tab_content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', marginBottom: '20px' }}>
                <h3 className="hidden_only" style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '600', color: '#454545' }}>서울시 환경소식</h3>
                <Link to="/seoulNews/All" className="more-link" style={{ color: '#008000', fontWeight: 'bold', textDecoration: 'none' }}>더 보기</Link>
            </div>

            <ul className="board_list">
                {seoulNews.map((news, index) => (
                    <li key={index}>
                        <Link to={`/seoulNewsArticle/${news.seoulId}`}>{news.title}</Link>
                        <span className="board_date">{new Date(news.publishedDate).toISOString().split('T')[0]}</span>
                    </li>
                ))}
            </ul>
        </div>
    )}
    
    {activeTab === 'tab4' && (
        <div id="tab4" className="tab_content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', marginBottom: '20px' }}>
                <h3 className="hidden_only" style={{ fontFamily: '"Noto Sans KR", "나눔고딕", "맑은 고딕", sans-serif', fontWeight: '600', color: '#454545' }}>환경부 정책소식</h3>
                <Link to="/minEnv" className="more-link" style={{ color: '#008000', fontWeight: 'bold', textDecoration: 'none' }}>더 보기</Link>
            </div>

            <ul className="board_list">
                {envLaw.map((law, index) => (
                    <li key={index}>
                        <Link to={`/minEnv/${law.rssId}`}>{law.title}</Link>
                        <span className="board_date">{law.pubDate}</span>
                    </li>
                ))}
            </ul>
        </div>
    )}
</div>

        </div>
    );
};

export default MainPageNewsCopy;
