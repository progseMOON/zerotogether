import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import "./Card.css"
import { AuthContext } from '../login/context/AuthContext';

const OrgApp = () => {
    const [orgList, setOrgList] = useState([]);
    const [globalOrgList, setGlobalOrgList] = useState([]);
    const [visibleCount, setVisibleCount] = useState(15); // 처음에 보이는 항목 수

    const { role } = useContext(AuthContext);

    const fetchOrgData = async () => {
        try {
            const response = await axios.get('/api/org/list');
            setOrgList(response.data);
        } catch (error) {
            console.error("Error fetching organization data:", error);
        }
    };

    const fetchGlobalOrgData = async () => {
        try {
            const response = await axios.get('/api/org/globalList');
            setGlobalOrgList(response.data);
        } catch (error) {
            console.error("Error fetching organization data:", error);
        }
    };

    const handleCrawl = async () => {
        try {
            await axios.post('/api/org/crawl');
            alert("크롤링이 완료되었습니다.");
            fetchOrgData();  // 갱신된 데이터를 가져옵니다.
        } catch (error) {
            console.error("Error during crawling:", error);
            alert("크롤링 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        fetchOrgData();
        fetchGlobalOrgData();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 15); // 15개씩 추가
    };



    return (

        
        <section className='list'>
            <div className="list_container">
                {role === 'ADMIN' && (
                        <button onClick={handleCrawl}>Crawl News</button>
                    )}

                <h2 className='title'>국제 환경 보호 단체</h2>
                <ul className="card">
                    {globalOrgList.map((globalOrg, index) => (
                        <li key={index} className="card_list">
                            <div className="card-bg">
                                {globalOrg.imgUrl && (
                                    <img src={globalOrg.imgUrl} alt={globalOrg.name}/>
                                )}
                            </div>
                            <div className='card_container'>
                                <div className='card_content'>
                                    <h2 className='card_content-name'>{globalOrg.name}</h2>
                                    <p className='card_content-description'>{globalOrg.description}</p>
                                </div>
                                <a href={globalOrg.link} className="card-btn" target="_blank" rel="noopener noreferrer">
                                    홈페이지
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>

                
                <h2 className='title'>민간 환경 보호 단체</h2>
                <ul className="card">
                    {orgList.slice(0, visibleCount).map((org, index) => (
                        <li key={index} className="card_list">
                            <div className="card-bg">
                                {org.imgUrl && (
                                    <img src={org.imgUrl} alt={org.name}/>
                                )}
                            </div>
                            <div className='card_container'>
                                <div className='card_content'>
                                    <h2 className='card_content-name'>{org.name}</h2>
                                    <p className='card_content-description'>{org.description}</p>
                                    <p className='card_content-location'>Location: {org.location}</p>
                                </div>
                                <a
                                    href={org.link !== '#' ? org.link : '#'}
                                    className="card-btn"
                                    target={org.link !== '#' ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    >
                                    홈페이지
                                </a>
                            </div>
                        </li>
                    ))}
                    {visibleCount < orgList.length && ( // 더보기 버튼을 조건부로 렌더링
                    <button onClick={handleLoadMore} className='load-more-btn'>
                        더보기
                    </button>
                )}
                </ul>

                
                
            </div>
        </section>
    );
};

export default OrgApp;
