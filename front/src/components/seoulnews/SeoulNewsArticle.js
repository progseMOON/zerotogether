import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import "./SeoulArticle.css";

function SeoulNewsArticle() {
    const { seoulId } = useParams(); // URL에서 id를 추출합니다.

    const [seoulNews, setSeoulNews] = useState([]);
    const [contentHtml, setContentHtml] = useState('');

    const [previous, setPrevious] = useState([]);
    const [next, setNext] = useState([]);

    const location = useLocation();
    const { previousPage, previousCategory } = location.state || {};  // 전달된 state가 없으면 undefined 처리

    // Axios GET 요청을 함수로 분리
    const fetchSeoulNews = async (id) => {
        try {
            const response = await axios.get('/api/seoul/seoulNews/article', { params: { seoulId: id } });

            const { seoulNews, contentHtml } = response.data
            setSeoulNews(seoulNews); // seoulNews 상태 설정
            setContentHtml(contentHtml); // contentHtml 상태 설정 (setContentHtml은 별도로 정의해야 함)
            
        } catch (error) {
            console.error('There was an error fetching the RSS data!', error);
        }
    };

    const previousNews = async (id) => {
        try {

            const response = await axios.get('/api/seoul/seoulNews/previous', { params: { seoulId : id}});
            setPrevious(response.data);
            
        } catch (error) {
            console.error('There was an error fetching the RSS data!', error);
        }
    }

    const nextNews = async (id) => {
        try {

            const response = await axios.get('/api/seoul/seoulNews/next', { params: { seoulId : id}});
            setNext(response.data);
            
        } catch (error) {
            console.error('There was an error fetching the RSS data!', error);
        }
    }

    // useEffect에서 분리된 fetchRssItem을 호출
    useEffect(() => {
        
        if (seoulId) {
            fetchSeoulNews(seoulId); // rssId가 있을 때만 호출
            previousNews(seoulId)
            nextNews(seoulId)
            window.scrollTo(0, 0); // 페이지가 변경될 때 스크롤을 맨 위로 이동
        }
    }, [seoulId]); // rssId가 변경될 때마다 실행

    // 그룹별 텍스트와 CSS 클래스를 반환하는 함수
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
                return { text: '기타', className: 'default' };
        }
    };

    const { text, className } = getGroupDetails(seoulNews.seoulNewsGroup);

    
    // 여기서 id를 사용하여 해당 RSS 항목의 데이터를 불러오는 로직을 추가할 수 있습니다.
    return (
        <div className='seoul-article-wrap'>
            {seoulNews && (
                <div className='seoul-article-title'>
                    <h2>{seoulNews.title}</h2>
                    {/* 다른 seoulNews 필드들... */}
                </div>
            )}

            {seoulNews && (
                <div className="seoul-article-date">
                    <div className={`Article-NewsGroup ${className}`}>
                        <Link 
                            to="/seoulNews/All" 
                            state={{ previousCategory }}
                        >
                            <p>{text}</p>
                        </Link>
                    </div>
                    <p>{seoulNews.publishedDate}</p>
                </div>
            )}
            
            <div className='post_content' dangerouslySetInnerHTML={{ __html: contentHtml }} />

            <div className='seoul-list-button'>
                <Link 
                    to="/seoulNews/All" 
                    state={{ previousPage, previousCategory }}
                >
                    목록
                </Link>
            </div>

            <div className='seoul-list-prev-next'>
                {previous && (
                    <Link to={`/seoulNewsArticle/${previous.seoulId}`}>
                        <img src='/images/left2.png' className='prev-img'></img>
                        <div className='seoul-prev-text'>
                            <p style={{fontWeight : 'bold'}}>이전글</p>
                            <p>{previous.title}</p>
                        </div>
                    </Link>
                )}
                {!previous && (
                    <div className='seoul-prev-text'>
                        <p></p>
                    </div>
                )}

                {next && (
                    <Link to={`/seoulNewsArticle/${next.seoulId}`}>
                        <div className='seoul-next-text'>
                            <p style={{fontWeight : 'bold'}}>다음글</p>
                            <p>{next.title}</p>
                        </div>
                        <img src='/images/right2.png' className='next-img'></img>
                    </Link>
                )}
                {!next && (
                    <div className='seoul-next-text'>
                        <p></p>
                    </div>
                )}
            </div>
                    
        </div>
    );
}

export default SeoulNewsArticle;