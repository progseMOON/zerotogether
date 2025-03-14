import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../login/context/AuthContext';
import '../board/bbs.css';
import '../board/page.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

//토큰(+)
const ExArticle = () => {
    const { token } = useContext(AuthContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const exchangeId = queryParams.get('exchangeId');

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();   


    // token에서 memId와 role 가져오기
    const getTokenInfo = (token) => {
        if (token) { 
            const payloadBase64 = token.split('.')[1]; 
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

        const fetchArticle = async () => {
            try {
                const response = await axios.get('/exchange/article', {
                    params: { exchangeId },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setArticle(response.data);                
                setLoading(false);
            } catch (error) {
                console.error('게시물을 가져오는 데 오류가 발생했습니다!!', error);
                setLoading(false);
                navigate('/exchange/list');
            }
        };

        fetchArticle();
    }, [token, exchangeId, navigate]);



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

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/exchange/deleted`, {
                params: { exchangeId }
            });
            alert(response.data);
            navigate('/exchange/list');
        } catch (error) {
            console.error('게시물을 삭제하는 데 오류가 발생했습니다.', error);
            const errorMessage = error.response && error.response.data 
                ? error.response.data 
                : '알 수 없는 오류가 발생했습니다.';
            alert('게시물 삭제에 실패했습니다: ' + errorMessage);
        }
    };

//여기부터 조준영 11-06/19:32 추가
//포인트 상승
const uppoint = async () => {
    try {
        const response = await axios.post('/api/point/update', {
            memId: article.memId,
            oper: '-',  // 또는 '-'
            updown: 300, // 추가하거나 차감할 포인트 수
            reason:  "장바구니 교환"// 변경 사유
        });
        console.log('포인트 업데이트 성공:', response.data);

    } catch (error) {
        console.error('포인트 업데이트 실패:', error.response ? error.response.data : error.message);
    }
};
//여기까지 조준영 11-06/19:32 추가
                   
 /*  ##### 인증 승인 auth 부분  */
    const handleAuth = async () => {
        try {
            const response = await axios.post(`/exchange/auth`, null, {
                params: { exchangeId }
            });
            alert(response.data);
            uppoint();

            // 게시글 데이터 다시 불러오기
            const updatedArticle = await axios.get('/exchange/article', {
                params: { exchangeId }
            });
            setArticle(updatedArticle.data);
            
        } catch (error) {
            console.error('인증 승인 시 오류가 발생했습니다.', error);
            const errorMessage = error.response && error.response.data 
                ? error.response.data 
                : '알 수 없는 오류가 발생했습니다.';
            alert('인증 승인에 실패했습니다: ' + errorMessage);
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
                <p>로딩 중...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <p>게시물을 찾을 수 없습니다.</p>
            </div>
        );
    }

return (
    <div className="container" style={{ maxWidth: "900px" }}>
        <div className="card mb-4" >
            <div className="card-body">
                <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                    <div className="col-2" style={{ backgroundColor: '#F5F3F0' }} py-2>제목</div>
                    <div className="col-10 py-2 d-flex justify-content-between align-items-center">
                        <span>{article.title}</span>
                        {(role === 'ADMIN' || (memId === article.memId && article.auth === 0)) && (
                            <button className="btn btn-outline-danger" onClick={handleDelete}>
                                <i className="fas fa-trash-alt"></i> 삭제
                            </button>
                        )}
                    </div>
                </div>

                <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                    <div className="col-2" style={{ backgroundColor: '#F5F3F0' }} py-2>작성자</div>
                    <div className="col-10 py-2">{article.memId}</div>
                </div>

                <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                    <div className="col-2" style={{ backgroundColor: '#F5F3F0' }} py-2>작성일</div>
                    <div className="col-10 py-2">{new Date(article.created).toLocaleDateString()}</div>
                </div>
                
                <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                    <div className="col-2" style={{ backgroundColor: '#F5F3F0' }} py-2>승인여부</div>
                    <div className="col-10 py-2 d-flex align-items-center">
                        {role === 'ADMIN' && article.auth === 0 ? (
                            <button 
                                onClick={handleAuth}
                                style={{
                                    display: 'inline-block',
                                    border: '3px solid #D2D2D2',
                                    borderRadius: '5px',
                                    backgroundColor: '#D2D2D2',
                                    padding: '5px 15px',
                                    textAlign: 'center',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    border: 'none'
                                }}
                            >
                                미승인
                            </button>
                        ) : (
                            <div style={{
                                display: 'inline-block',
                                border: article.auth === 0 ? '3px solid #D2D2D2' : '3px solid #008000',
                                borderRadius: '5px',
                                backgroundColor: article.auth === 0 ? '#D2D2D2' : '#008000',
                                padding: '5px 15px',
                                textAlign: 'center'
                            }}>
                                <span style={{
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    {getAuthLabel(article.auth)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                    <div className="col-2" style={{ backgroundColor: '#F5F3F0' }} py-2>배송 정보</div>
                    <div className="col-10 py-2">
                        <div className="mb-2"><strong>보내는 분:</strong> {article.sender}</div>
                        <div className="mb-2"><strong>받는 분:</strong> {article.receiver}</div>
                        <div className="mb-2"><strong>우편번호:</strong> {article.post}</div>
                        <div className="mb-2"><strong>주소:</strong> {article.addr1}</div>
                        <div className="mb-2"><strong>상세주소:</strong> {article.addr2}</div>
                        <div className="mb-2"><strong>전화번호:</strong> {article.tel}</div>
                    </div>
                </div>

                < div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6', borderTop: '1px solid #dee2e6' }}>
                
                    <div className="col-2" style={{ backgroundColor: '#F5F3F0' }} py-2>요청 및 <br/> 배송 메세지</div>
                    <div className="col-10 py-2" style={{ whiteSpace: "pre-line" }}>
                        {article.content}
                    </div>
                </div>

                <div className="row mb-3" style={{ borderTop: '1px solid #dee2e6' }}>
                <div className="col-2" style={{ backgroundColor: '#F7F5F2' }} py-2>
                        선택한 상품</div>
                    <div className="col-10 py-2">
                        {article.selec && (
                            <img 
                                src={`/exchange/ex${article.selec}.png`}
                                alt={`선택된 교환 이미지 ${article.selec}`}
                                style={{ maxWidth: "50%" }}
                                className="mt-2"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="my-3 d-flex justify-content-center">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/exchange/list')}>
                <i className="fas fa-list"></i> 목록
            </button>
        </div>
    </div>
    );

};

export default ExArticle;
