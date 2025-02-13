import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import './ImgList.css';
import '../board/bbs.css';
import '../board/page.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthContext } from '../login/context/AuthContext';
import { Link } from 'react-router-dom';

function ImgList() {

    const { token } = useContext(AuthContext);
    const [imgPosts, setImgPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0); // 총 게시물 수
    const itemsPerPage = 8; // 한 페이지당 보여줄 게시물 수

    const [searchKey, setSearchKey] = useState('title'); // 기본 검색 항목
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]); //검색결과

    // 전체 이미지 게시물을 가져오는 함수
    const fetchImgPosts = async () => {

        try {
            const config = {
                params: { page: 1, size: 1000 },
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            };

            const response = await axios.get('/imgboard/list', config);
            setImgPosts(response.data.content);
            setSearchResults(response.data.content); // 초기 검색 결과는 전체 게시물
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error('이미지를 찾을 수 없습니다.', error);

        }
    };

    useEffect(() => {
        fetchImgPosts(); // 컴포넌트가 마운트될 때 모든 데이터 로드
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 검색
    const handleSearch = () => {
        const filtered = imgPosts.filter(board => {
            switch (searchKey) {
                case 'cate':
                    return searchValue === "" ? true : board.imgPost.cate === searchValue;
                    case 'memId':
                    return board.imgPost.memId.includes(searchValue);
                case 'title':
                    return board.imgPost.title.includes(searchValue);
                default:
                    return true;
            }
        });

        setSearchResults(filtered); // 검색 결과
        setTotalItems(filtered.length); // 검색된 결과 수로 업데이트
        setCurrentPage(1); // 검색 후 첫 페이지로 초기화
    };

    // 페이지네이션에 맞게 현재 페이지의 데이터만 추출
    const getPaginatedResults = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return searchResults.slice(startIndex, startIndex + itemsPerPage);
    };

    const getCateLabel = (cate) => {
        switch (cate) {
            case 'tum':
                return '텀블러 이용';
            case 'buy':
                return '물품 구매';
            case 'group':
                return '단체활동 참여';
            default:
                return '알 수 없음';
        }
    };

    const getAuthLabel = (auth) => {
        switch (auth) {
            case 1:
                return '인증 승인완료';
            case 0:
                return '인증 미승인';
            default:
                return '알 수 없음';
        }
    };

    return (
        <div>
            <div className="table-container">
                {/* 테이블 제목과 설명 */}
                <div className="table-header d-flex align-items-center justify-content-start">
                    <h3 className="table-title">인증게시판</h3>
                    <p className="table-description ms-3">환경 보호 활동을 인증하고 포인트를 획득하세요.</p>
                </div>

                {/* 검색 필터 */}
                <div className="filter-container">
                    <table>
                        <tbody>
                            <tr className="category-filter">
                                <td>
                                    <select
                                        value={searchKey}
                                        onChange={(e) => {
                                            setSearchKey(e.target.value);
                                            setSearchValue('');
                                        }}
                                        className="form-control"
                                        style={{ border: 0 }}
                                    >
                                        <option value="cate">인증유형</option>
                                        <option value="memId">작성자</option>
                                        <option value="title">제목</option>
                                    </select>
                                </td>
                                <td>
                                    {searchKey === 'cate' ? (
                                        <select
                                            className="form-control"
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        >
                                            <option value="">인증유형 선택</option>
                                            <option value='tum'>텀블러 이용</option>
                                            <option value='buy'>물품 구매</option>
                                            <option value='group'>단체활동 참여</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="검색어"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    )}
                                </td>
                                <td>
                                    <button type="button" className="btn btn-outline-secondary" onClick={handleSearch}>
                                        <i className="fas fa-search"></i> 검색
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <br />

                {/* 게시물 */}

                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    padding: 0,
                    gap: '20px',
                    justifyContent: 'flex-start'
                }}>
                    {getPaginatedResults().length > 0 ? (
                        getPaginatedResults().map((board, index) => (
                            <Link to={`/imgboard/article?imgPostId=${board.imgPost.imgPostId}`} 
                                  style={{ 
                                      textDecoration: 'none', 
                                      color: 'inherit', 
                                      width: 'calc(25% - 15px)',  // 너비 유지
                                      marginBottom: '20px',
                                      minWidth: '280px'  // 최소 너비 추가
                                  }} 
                                  key={`${board.imgPost.imgPostId}_${index}`}>
                                <div style={{
                                    border: '2px solid #D3D3D3',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    backgroundColor: '#F6F6F6',
                                    width: '100%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}>
                                    <div style={{
                                        width: '260px',
                                        height: '150px',
                                        overflow: 'hidden',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #E8E8E8'
                                    }}>
                                        {board.images && board.images.length > 0 ? (
                                            board.images.map((img) => (
                                                <img
                                                    key={img.imgId}
                                                    src={`/images/imgboard/${img.saveFileName}`}
                                                    alt={img.saveFileName}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        maxHeight: '200px',
                                                        margin: 0,
                                                        display: 'block',
                                                        objectFit: 'cover',
                                                        verticalAlign: 'top',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <p>등록된 이미지가 없습니다.</p>
                                        )}
                                    </div>
                                    <p></p>
                                    <div style={{
                                        border: board.imgPost.auth === 0 ? '3px solid #D2D2D2' : '3px solid #008000',
                                        borderRadius: '5px',
                                        backgroundColor: board.imgPost.auth === 0 ? '#D2D2D2' : '#008000',
                                        padding: '5px',
                                        textAlign: 'center',
                                        marginTop: '1px',
                                        width: '260px',
                                        margin: '0 auto'
                                    }}>
                                        <p style={{
                                            color:  '#fff' ,
                                            margin: 0
                                        }}>
                                       {getAuthLabel(board.imgPost.auth)}
                                        </p>
                                    </div>
                                    <p></p>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        border: 'none'
                                    }}>
                                        <tbody>
                                            <tr style={{ border: 'none' }}>
                                                <td style={{ width: '30%', padding: '5px', textAlign: 'left', border: 'none' }}>작성자</td>
                                                <td style={{ padding: '5px', textAlign: 'left', border: 'none' }}>{board.imgPost.memId}</td>
                                            </tr>
                                            <tr style={{ border: 'none' }}>
                                                <td style={{ width: '30%', padding: '5px', textAlign: 'left', border: 'none' }}>제목</td>
                                                <td style={{ 
                                                    padding: '5px', 
                                                    textAlign: 'left', 
                                                    border: 'none',
                                                    width: '70%',  // 너비 비율 설정
                                                    maxWidth: '140px'  // 최대 너비 줄임
                                                }}>
                                                    <b style={{
                                                        display: 'block',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>{board.imgPost.title}</b>
                                                </td>
                                            </tr>
                                            <tr style={{ border: 'none' }}>
                                                <td style={{ width: '30%', padding: '5px', textAlign: 'left', border: 'none' }}>인증유형</td>
                                                <td style={{ padding: '5px', textAlign: 'left', border: 'none' }}>{getCateLabel(board.imgPost.cate)}</td>
                                            </tr>
                                            <tr style={{ border: 'none' }}>
                                                <td style={{ width: '30%', padding: '5px', textAlign: 'left', border: 'none' }}>작성일</td>
                                                <td style={{ padding: '5px', textAlign: 'left', border: 'none' }}>{new Date(board.imgPost.created).toLocaleDateString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{
                            width: '100%',
                            textAlign: 'center',
                            padding: '50px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '5px',
                            margin: '20px 0'
                        }}>
                            <p style={{ fontSize: '18px', color: '#6c757d' }}>
                                <i className="fas fa-search" style={{ marginRight: '10px' }}></i>
                                해당하는 게시물을 찾을 수 없습니다.
                            </p>
                        </div>
                    )}
                </div>

                {/* 페이지네이션 및 글쓰기 버튼 */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="mx-auto">
                        <Pagination
                            className="pagination"
                            activePage={currentPage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={totalItems}
                            pageRangeDisplayed={5}
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={handlePageChange}
                        />
                    </div>
                    <Link className="btn btn-outline-secondary" to="/imgboard/created">
                        <i className="fas fa-pen"></i> 글쓰기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ImgList;
