import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './RssArticle.css'

function MinEnvArticle() {
    const { rssId } = useParams(); // URL에서 id를 추출합니다.

    const [rssItem, setRssItem] = useState([]);
    const [downloadLinks, setDownloadLinks] = useState([]); // 다운로드 링크 상태 추가

    const [previous, setPrevious] = useState([]);
    const [next, setNext] = useState([]);

    const location = useLocation();
    const { previousPage } = location.state || {};  // 전달된 state가 없으면 undefined 처리

    // Axios GET 요청을 함수로 분리
    const fetchRssItem = async (id) => {
        try {
            const response = await axios.get('/api/rss/env/article', { params: { rssId: id } });
            setRssItem(response.data); // 서버에서 받은 데이터를 상태로 설정
            setDownloadLinks(response.data.downloadLinks); // 다운로드 링크 설정
        } catch (error) {
            console.error('There was an error fetching the RSS data!', error);
        }
    };

    // useEffect에서 분리된 fetchRssItem을 호출
    useEffect(() => {
        if (rssId) {
            fetchRssItem(rssId); // 데이터 가져오기
            previousNews(rssId); // 이전/다음 뉴스 가져오기
            nextNews(rssId);
        }
    }, [rssId]); // rssId가 변경될 때마다 실행

    const previousNews = async (id) => {
        try {

            const response = await axios.get('/api/rss/env/previous', { params: { rssId : id}});
            setPrevious(response.data);
            
        } catch (error) {
            console.error('There was an error fetching the RSS data!', error);
        }
    }

    const nextNews = async (id) => {
        try {

            const response = await axios.get('/api/rss/env/next', { params: { rssId : id}});
            setNext(response.data);
            
        } catch (error) {
            console.error('There was an error fetching the RSS data!', error);
        }
    }


    
    // 여기서 id를 사용하여 해당 RSS 항목의 데이터를 불러오는 로직을 추가할 수 있습니다.
    return (
        <div className='.rss-article-wrap'>
            <div className='rss-article-title'>
                <h2>{rssItem.title}</h2>
            </div>
            <div className='rss-article-date'>
                <div className={`rss-article-NewsGroup`}>
                    <p>환경부</p>
                </div>
                <p>작성일 : {rssItem.pubDate} </p>
            </div>
            <div className='rss-article-download'>
                <ul>
                    {downloadLinks.map((linkData, index) => (
                        <li key={index}>
                            <a href={linkData.url} target="_blank" rel="noopener noreferrer">
                                <img src='/images/download.png' className='rss-download-img'></img>
                                {linkData.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='rss-article-content'>
                <p>{rssItem.description} </p>
            </div>

            <div className='rss-list-button'>
                <Link to="/minEnv" state={{previousPage}}>목록</Link>
            </div>

            <div className='rss-list-prev-next'>
                {previous ? (
                    <Link to={`/minEnv/${previous.rssId}`}>
                        <img src='/images/left2.png' className='prev-img'></img>
                        <div className='rss-prev-text'>
                            <p style={{fontWeight : 'bold'}}>이전글</p>
                            <p>{previous.title}</p>
                        </div>
                    </Link>
                ) : (
                    <div className='rss-prev-text'>
                        <p></p>
                    </div>
                )}

                {next ? (
                    <Link to={`/minEnv/${next.rssId}`}>
                        <div className='rss-next-text'>
                            <p style={{fontWeight : 'bold'}}>다음글</p>
                            <p>{next.title}</p>
                        </div>
                        <img src='/images/right2.png' className='next-img'></img>
                    </Link>
                ) : (
                    <div className='rss-next-text'>
                        <p></p>
                    </div>
                )}
            </div>
            
        </div>
    );
}

export default MinEnvArticle;