import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../login/context/AuthContext';
import './ImgArticle.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import "react-quill/dist/quill.snow.css";

const ImgArticle = () => {
    const { token } = useContext(AuthContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const imgPostId = queryParams.get('imgPostId');
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    // token에서 memId와 role 가져오기
    const getTokenInfo = (token) => {
        if (token) {
            const payloadBase64 = token.split('.')[1]; //토큰의 2번째 인덱스 가져옴
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return {
                memId: decodedPayload.sub,
                role: decodedPayload.role
            };
        }
        return { memId: null, role: null };
    };

    const { memId, role } = getTokenInfo(token);

    useEffect(() => {
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/mainpage');
            return;
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get('/imgboard/article', {
                    params: { imgPostId },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setArticle(response.data);
                setLoading(false);
            } catch (error) {
                console.error('게시물을 가져오는 데 오류가 발생했습니다.', error);
                alert('게시물을 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        if (token) fetchArticle();
    }, [imgPostId, token, navigate]);


    if (!article || !article.imgPost) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <h4 style={{color: 'gray'}}>게시물을 찾을 수 없습니다.</h4>
            </div>
        );
    }


    const handleDelete = async () => {
        try {
            const response = await axios.delete('/imgboard/deleted', {
                params: { imgPostId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert(response.data);
            navigate('/imgboard/list');
        } catch (error) {
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/mainpage');
            } else {
                const errorMessage = error.response?.data || '알 수 없는 오류가 발생했습니다.';
                alert('게시물 삭제에 실패했습니다: ' + errorMessage);
            }
        }
    };


    const point = article.imgPost.cate === 'tum' ?  10
                :article.imgPost.cate === 'buy' ?  20
                :article.imgPost.cate === 'group' ? 30 : 0;

    const reason = article.imgPost.cate ==='tum' ? '텀블러 이용'
    :article.imgPost.cate === 'buy' ?  '물품 구매'
    :article.imgPost.cate === 'group' ?  '단체활동 참여'
    : '';

    //포인트 상승
    const uppoint = async () => {
        try {
            const response = await axios.post('/api/point/update', {
                memId: article.imgPost.memId,
                oper: '+',  // 또는 '-'
                updown: point, // 추가하거나 차감할 포인트 수
                reason:  reason// 변경 사유
            });
            console.log('포인트 업데이트 성공:', response.data);

        } catch (error) {
            console.error('포인트 업데이트 실패:', error.response ? error.response.data : error.message);
        }
    };
    const handleAuth = async () => {
        try {
            const response = await axios.post('/imgboard/auth', null, {
                params: { imgPostId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            uppoint();
            alert(response.data);
            
            // 게시글 데이터만 새로 불러오기
            const updatedArticle = await axios.get('/imgboard/article', {
                params: { imgPostId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setArticle(updatedArticle.data);
            
        } catch (error) {
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/mainpage');
            } else {
                const errorMessage = error.response?.data || '알 수 없는 오류가 발생했습니다.';
                alert('인증 승인에 실패했습니다: ' + errorMessage);
            }
        }
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
                return '승인완료';
            case 0:
                return '미승인';
            default:
                return '알 수 없음';
        }
    };


    

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <h4 style={{color: 'gray'}}>로딩 중...</h4>
                </div>
        );
    }


    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="article-container">
                <div className="my-3">
                <div className="text-center position-relative">
                <h2 className="article-title">{article.imgPost.title}</h2>
                        <div style={{ position: 'absolute', right: 0, top: 0 }}>
                            {(memId === article?.imgPost.memId && article?.imgPost.auth === 0) && (
                                <button className="btn btn-outline-secondary me-2" onClick={() => navigate(`/imgboard/updated?imgPostId=${imgPostId}`)}>
                                    <i className="fas fa-edit"></i> 수정
                                </button>
                            )}
                            {((article?.imgPost.auth === 0 && memId === article?.imgPost.memId) || role === 'ADMIN') && (
                                <button className="btn btn-outline-danger" onClick={handleDelete}>
                                    <i className="fas fa-trash-alt"></i> 삭제
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th className="col-2">승인여부</th>
                            <td>
                                {role === 'ADMIN' && article?.imgPost.auth === 0 ? (
                                    <button 
                                        onClick={handleAuth}
                                        style={{
                                            display: 'inline-block',
                                            border: '3px solid #D2D2D2',
                                            borderRadius: '5px',
                                            backgroundColor: '#D2D2D2',
                                            padding: '5px 15px',
                                            textAlign: 'center',
                                            marginRight: '10px',
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        미승인
                                    </button>
                                ) : (
                                    <div style={{
                                        display: 'inline-block',
                                        border: article.imgPost.auth === 0 ? '3px solid #D2D2D2' : '3px solid #008000',
                                        borderRadius: '5px',
                                        backgroundColor: article.imgPost.auth === 0 ? '#D2D2D2' : '#008000',
                                        padding: '5px 15px',
                                        textAlign: 'center',
                                        marginRight: '10px'
                                    }}>
                                        <span style={{
                                            color: '#fff',
                                            margin: 0
                                        }}>
                                            {getAuthLabel(article.imgPost.auth)}
                                        </span>
                                    </div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>사용자 ID</th>
                            <td>{article.imgPost.memId}</td>
                        </tr>
                        <tr>
                            <th>인증 유형</th>
                            <td>{getCateLabel(article.imgPost.cate)}</td>
                        </tr>
                        <tr>
                            <th>작성일</th>
                            <td>{new Date(article.imgPost.created).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <p style={{ whiteSpace: 'pre-wrap' }}>
                                    {article.imgPost.content.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i !== article.imgPost.content.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                                <div className="image-gallery d-flex flex-column align-items-center">
                                    {article.images && article.images.map(img => (
                                        <img
                                            key={img.imgId}
                                            src={`/images/imgboard/${img.saveFileName}`}
                                            alt='게시물 이미지'
                                            style={{
                                                width: "60%",
                                                marginBottom: "20px",
                                                maxHeight: "auto"
                                            }}
                                        />
                                    ))}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="my-3 d-flex justify-content-center">
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/imgboard/list')}>
                        <i className="fas fa-list"></i> 목록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImgArticle;
