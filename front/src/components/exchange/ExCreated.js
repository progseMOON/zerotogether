import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../login/context/AuthContext';

//토큰에러해결(+)
const ExCreated = () => {
    const navigate = useNavigate();
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const senderRef = useRef(null); 
    const receiverRef = useRef(null);
    const telRef = useRef(null);    
    const postRef = useRef(null);
    const { token } = useContext(AuthContext);
    const [memId, setMemId] = useState('');

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('상품을 선택하지 않으면 무작위로 배송 됩니다.\n원하시는 상품이 있다면 위 이미지를 클릭해 주세요.\n');
    const [sender, setSender] = useState('제로동행');   
    const [receiver, setReceiver] = useState('');   

    const [post, setPost] = useState('');
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [tel, setTel] = useState('');
    const [selec, setSelec] = useState(null);

    const [loading, setLoading] = useState(true);

    const defaultMessage = '상품을 선택하지 않으면 무작위로 배송 됩니다.\n원하시는 상품이 있다면 위 이미지를 클릭해 주세요.\n';


    const getTokenInfo = (token) => {
        if (!token) return null;
        try {
            const payloadBase64 = token.split('.')[1]; 
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return decodedPayload.sub;
        } catch (error) {
            console.error('토큰 디코딩 실패:', error);
            return null;
        }
    };

    const checkUserPoint = async (token, extractedMemId) => {
        try {
            const response = await axios.get(`/api/point/info/${extractedMemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('포인트 정보 조회 중 오류:', error);
            throw error;
        }
    };

    useEffect(() => {
        const validateAndCheckPoint = async () => {
            if (!token) { 
                alert('로그인이 필요합니다.');
                navigate('/mainpage');
                return;
            }

            const extractedMemId = getTokenInfo(token);
            if (!extractedMemId) {
                alert('사용자 정보를 확인할 수 없습니다.');
                navigate('/mainpage');
                return;
            }

            setMemId(extractedMemId);

            try {
                const pointInfo = await checkUserPoint(token, extractedMemId);
                if (pointInfo.usedPoint < 300) {
                    alert('포인트가 300 이상일 때 신청 가능합니다.');
                    navigate('/exchange/list');
                    return;
                }
                setLoading(false);
            } catch {
                navigate('/mainpage');
            }
        };

        validateAndCheckPoint();
    }, [token, navigate]);

        const handleReceiverInfo = async () => {

            try {
                const response = await axios.get('/exchange/info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const memberData = response.data;
                console.log(memberData);
                setSender('제로동행');
                setReceiver(memberData.memName);
                setPost(memberData.post);
                setAddr1(memberData.addr1);
                setAddr2(memberData.addr2);
                setTel(memberData.tel);
      
            } catch (error) {
                console.error('회원 정보 가져오기 오류:', error);
            }
        };

    const handleTextReset = () => {
        setTitle('');
        setReceiver('');
        setContent(defaultMessage);
        setPost('');
        setAddr1('');
        setAddr2('');
        setTel('');
        setSelec(null);
    };

    const handleInsertSubmit = async (evt) => {
        evt.preventDefault();

        if (validateForm()) {
            const formData = new FormData();        
            formData.append('memId', memId);
            formData.append('title', title);
            formData.append('sender', sender);
            formData.append('receiver', receiver);
            formData.append('content', content);
            formData.append('post', post);
            formData.append('addr1', addr1);
            formData.append('addr2', addr2);
            formData.append('tel', tel);
            formData.append('selec', selec === null ? 3 : selec);

            try {
                const response = await axios.post('/exchange/created', formData);
                alert(response.data);
                window.location.href = '/exchange/list';
            } catch (error) {
                alert('게시물 등록 중 오류가 발생했습니다: ' + error.message);
            }
        }
    };

    const validateForm = () => {
        if (!title) {
            titleRef.current.focus();
            return false;
        }
        if(!sender){
            senderRef.current.focus();
            return false;
        }
        if(!receiver){
            receiverRef.current.focus();
            return false;
        }   
        if (!post) {
            alert("우편번호를 입력해야합니다.");
            postRef.current.focus();
            return false;
        }

        if (!tel) {
            telRef.current.focus();
            return false;
        }   
        return true;
    };

    const handleDaumPost = async () => {
        if (!window.daum) {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
                script.onload = resolve;
                document.body.appendChild(script);
            });
        }

        new window.daum.Postcode({
            oncomplete: function(data) {
                setPost(data.zonecode);
                setAddr1(data.address);
            }
        }).open();
    };

    const handleImageClick = (imageNumber) => {
        setSelec(imageNumber);
        switch(imageNumber) {
            case 1:
                setContent("1번 : 돌고래 장바구니 ||\n\n");
                break;
            case 2:
                setContent("2번 : 판다 장바구니 ||\n\n");
                break;
            case 3:
                setContent("3번 : 펭귄 장바구니 ||\n\n");
                break;
            default:
                setContent(defaultMessage);
                break;
        }
        contentRef.current?.focus();
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <h4 style={{color: 'gray'}}>교환신청 게시판으로 돌아갑니다.</h4>
                </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: "900px" }}>
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="mb-4 text-center">장바구니 교환 신청하기</h4>
                    <form onSubmit={handleInsertSubmit} method='post'>
                        <div className="row mb-3" style={{ borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}>
                            <div className="col-2 py-2" style={{ backgroundColor: '#F5F3F0' }}>사용자 ID</div>
                            <div className="col-10 py-2">
                                <input type="text" value={memId} readOnly className="form-control" />
                            </div>
                        </div>

                        <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                            <div className="col-2 py-2" style={{ backgroundColor: '#F5F3F0' }}>제목</div>
                            <div className="col-10 py-2">
                                <input type="text" value={title} onChange={(evt) => setTitle(evt.target.value)} ref={titleRef} className="form-control" required/>
                            </div>
                        </div>

                        <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                            <div className="col-2 py-2" style={{ backgroundColor: '#F5F3F0' }}>상품 선택</div>
                            <div className="col-10 py-2">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <img 
                                        src="/exchange/ex1.png" 
                                        alt="교환 이미지 1" 
                                        onClick={() => handleImageClick(1)}
                                        style={{ 
                                            width: '32%', 
                                            cursor: 'pointer',
                                            border: selec === 1 ? '3px solid #007bff' : '1px solid #dee2e6',
                                            borderRadius: '5px'
                                        }}
                                    />
                                    <img 
                                        src="/exchange/ex2.png" 
                                        alt="교환 이미지 2" 
                                        onClick={() => handleImageClick(2)}
                                        style={{ 
                                            width: '32%', 
                                            cursor: 'pointer',
                                            border: selec === 2 ? '3px solid #007bff' : '1px solid #dee2e6',
                                            borderRadius: '5px'
                                        }}
                                    />
                                    <img 
                                        src="/exchange/ex3.png" 
                                        alt="교환 이미지 3" 
                                        onClick={() => handleImageClick(3)}
                                        style={{ 
                                            width: '32%', 
                                            cursor: 'pointer',
                                            border: selec === 3 ? '3px solid #007bff' : '1px solid #dee2e6',
                                            borderRadius: '5px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                            <div className="col-2 py-2" style={{ backgroundColor: '#F5F3F0' }}>배송 정보</div>
                            <div className="col-10 py-2">
                                <button type='button' onClick={handleReceiverInfo} className="btn btn-outline-secondary mb-3">
                                    내 정보 불러오기
                                </button>
                                <div className="mb-2">
                                    <label className="form-label"><strong>보내는 분</strong></label>
                                    <input type="text" value={sender} onChange={(evt) => setSender(evt.target.value)} ref={senderRef} className="form-control" required/>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label"><strong>받는 분</strong></label>
                                    <input type="text" value={receiver} onChange={(evt) => setReceiver(evt.target.value)} ref={receiverRef} className="form-control" required/>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label"><strong>우편번호</strong></label>
                                    <div className="input-group">
                                        <input type="text" value={post} readOnly className="form-control" ref={postRef}/>
                                        <button type="button" onClick={handleDaumPost} className="btn btn-outline-secondary">우편번호 찾기</button>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label"><strong>주소</strong></label>
                                    <input type="text" value={addr1} readOnly className="form-control"/>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label"><strong>상세주소</strong></label>
                                    <input type="text" value={addr2} onChange={(evt) => setAddr2(evt.target.value)} className="form-control"/>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label"><strong>전화번호</strong></label>
                                    <input type="text" value={tel} onChange={(evt) => setTel(evt.target.value)} ref={telRef} className="form-control" required/>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                            <div className="col-2 py-2" style={{ backgroundColor: '#F5F3F0' }}>요청 및<br/>배송 메세지</div>
                            <div className="col-10 py-2">
                                <textarea 
                                    value={content} 
                                    onChange={(evt) => {
                                        const newContent = evt.target.value;
                                        if (!newContent.trim()) {
                                            setContent(defaultMessage);
                                        } else if (newContent !== defaultMessage) {
                                            setContent(newContent);
                                        }
                                    }}
                                    ref={contentRef} 
                                    className="form-control"
                                    style={{ 
                                        minHeight: '100px',
                                        color: content === defaultMessage ? '#888' : '#000'
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-center gap-2">
                            <button type="submit" className="btn btn-primary">등록하기</button>
                            <button type='button' onClick={handleTextReset} className="btn btn-secondary">다시작성</button>
                            <button type='button' onClick={() => window.location.href = '/exchange/list'} className="btn btn-outline-secondary">
                                작성취소
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExCreated;
