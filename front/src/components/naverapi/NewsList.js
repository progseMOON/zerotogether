import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { AuthContext } from "../login/context/AuthContext";

const NewsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const NewsHeader = styled.h1`
  color: black;
  text-align: center;
  margin-bottom: 30px;
  font-size : 2rem;
  font-weight : bold;
  
`;

const NewsListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const NewsItem = styled.li`
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const NewsLink = styled.a`
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: #3498db;
  }
`;

const NewsDescription = styled.p`
  color: #7f8c8d;
  margin-top: 10px;
  font-size: 0.9em;
`;

const NewsDate = styled.span`
  color: #95a5a6;
  font-size: 0.8em;
  display: block;
  margin-top: 5px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: ${props => (props.$active ? '#3498db' : '#f1f1f1')};
  color: ${props => (props.$active ? 'white' : 'black')};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #f1f1f1;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #3498db;
    color: white;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90vw;
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const NewsTitle = styled.h2`
  margin: 0 0 10px 0;
  padding: 0;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IframeContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const StyledIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const Modal = ({ news, onClose }) => {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const container = containerRef.current;

    if (iframe && container) {
      const adjustIframeSize = () => {
        try {
          iframe.style.width = '100%';
          iframe.style.height = '100%';

          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          const iframeBody = iframeDocument.body;

          // 원본 콘텐츠의 너비가 iframe보다 넓은 경우 스케일 조정
          if (iframeBody.scrollWidth > container.clientWidth) {
            const scale = container.clientWidth / iframeBody.scrollWidth;
            iframeBody.style.transform = `scale(${scale})`;
            iframeBody.style.transformOrigin = 'top left';
            iframeBody.style.width = `${100 / scale}%`;
            iframe.style.height = `${iframeBody.scrollHeight * scale}px`;
          }
        } catch (e) {
          console.error("Error adjusting iframe size:", e);
        }
      };

      const handleIframeLoad = () => {
        adjustIframeSize();
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          iframeDocument.body.style.overflow = 'auto';
          iframeDocument.body.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
              e.preventDefault();
              window.open(e.target.href, '_blank');
            }
          });
        } catch (e) {
          console.error("Error handling iframe load:", e);
        }
      };

      iframe.onload = handleIframeLoad;
      window.addEventListener('resize', adjustIframeSize);

      return () => window.removeEventListener('resize', adjustIframeSize);
    }
  }, [news]);

  if (!news) return null;

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <NewsTitle>{news.title}</NewsTitle>
        <IframeContainer ref={containerRef}>
          <StyledIframe ref={iframeRef} src={news.link} title={news.title} />
        </IframeContainer>
      </ModalContent>
    </ModalBackground>
  );
};

const NewsList = () => {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const [pageGroup, setPageGroup] = useState(1);
  const itemsPerPage = 5;

  const { role } = useContext(AuthContext);

  const fetchNewsData = () => {
    axios
      .get("/api/naver/news")
      .then((response) => {
        console.log("Fetching RSS data...");
        setNewsData(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        setError(null);
      })
      .catch((error) => {
        setError("뉴스 데이터를 가져오는 데 실패했습니다.");
        console.error(error);
      });
  };

  const updateNewsData = () => {
    axios
      .post("/api/naver/news/update") // DB 갱신
      .then((response) => {
        setError(null); // 에러 초기화
        alert('갱신 완료');
        fetchNewsData();
      })
      .catch((error) => {
        setError("뉴스 DB를 갱신하는 데 실패했습니다.");
        console.error(error);
      });
  };

  useEffect(() => {
    fetchNewsData();

    // const intervalId = setInterval(() => {
    //   fetchNewsData();
    // }, 600000); // 10분마다 갱신

    // return () => clearInterval(intervalId);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPageGroup(Math.ceil(pageNumber / 5));
  };

  const openModal = (news) => {
    setSelectedNews(news);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = (pageGroup - 1) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageButton
          key={i}
          onClick={() => paginate(i)}
          $active={currentPage === i}
        >
          {i}
        </PageButton>
      );
    }
    return pageNumbers;
  };

  return (
    <NewsContainer>
      <NewsHeader>네이버 환경소식</NewsHeader>
      {role === 'ADMIN' && (
                        <button onClick={updateNewsData}>Crawl News</button>
                    )}
      {error && <p>{error}</p>}

      <div>
          <ul>
              <li>게시글 : {newsData.length}, 페이지 : {currentPage} / {totalPages}</li>
          </ul>
      </div>
      {newsData.length > 0 ? (
        <>
          <NewsListContainer>
            {currentItems.map((news, index) => (
              <NewsItem key={index} onClick={() => window.open(news.link, '_blank')}>
                <NewsLink as="span">{news.title}</NewsLink>
                <NewsDescription>{news.description}</NewsDescription>
                <NewsDate>
                  {news.pubDate} {/* 서버에서 반환된 문자열 그대로 출력 */}
                </NewsDate>
              </NewsItem>
            ))}
          </NewsListContainer>
          <PaginationContainer>
            {currentPage > 1 && (
              <PaginationButton onClick={() => paginate(currentPage - 1)}>
                이전
              </PaginationButton>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages && (
              <PaginationButton onClick={() => paginate(currentPage + 1)}>
                다음
              </PaginationButton>
            )}
          </PaginationContainer>
        </>
      ) : (
        <p>뉴스 데이터를 불러오는 중...</p>
      )}
      <Modal news={selectedNews} onClose={closeModal} />
    </NewsContainer>
  );
};


export default NewsList;
