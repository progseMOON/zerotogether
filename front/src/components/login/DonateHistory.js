import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // date-fns에서 format 함수 임포트

const DonateHistory = () => {
    const { token, memId } = useContext(AuthContext);
    const [donateHistory, setDonateHistory] = useState([]); // 전체 후원 기록
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const [page, setPage] = useState(1); // 현재 페이지 (기본값: 1)
    const [size] = useState(5); // 페이지당 표시할 후원 내역 수
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const navigate = useNavigate();
    const buyerId = 'someBuyerId'; // 실제로는 로그인된 사용자의 ID를 사용해야 함

    const backMemberInfoPage=()=> {
        navigate('/member-info')
    }

    // 전체 후원 내역을 불러오는 API 요청
    useEffect(() => {
        axios
        .get('/payment/getDonateHistory', {
            headers: {
                Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            },
            params: {
                buyerId: memId,
            },
        })
        .then((response) => {
            // 응답 값 확인
            console.log('응답 데이터:', response);
            const data = response.data;
            setDonateHistory(data); // 전체 후원 내역 저장
            setTotalPages(Math.ceil(data.length / size)); // 총 페이지 수 계산
            setLoading(false); // 로딩 완료
        })
        .catch((error) => {
            // 에러 메시지 출력
            console.error('후원 기록 불러오기 오류', error);
            if (error.response) {
                // 서버에서 응답한 에러가 있을 경우
                console.error('응답 데이터:', error.response.data);
                setError(`에러: ${error.response.data}`);
            } else {
                // 네트워크 에러 등의 경우
                setError('후원 기록을 불러오는 데 실패했습니다');
            }
            setLoading(false); // 로딩 완료
        });
        console.log('현재 멤버 ID:', memId);
    }, [buyerId, memId, size, token]); // buyerId와 size가 바뀔 때마다 데이터 갱신

    // 현재 페이지에 해당하는 데이터만 추출
    const currentData = donateHistory.slice((page - 1) * size, page * size);

    // 페이지 변경 함수
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage); // 페이지 변경
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return (
            <div>{error}</div>
        );
    }

    return (
        <div>
            <h2><b>후원 내역</b></h2>
            {currentData.length > 0 ? (
                <table >
                    <thead>
                        <tr >
                            <th style={{backgroundColor:'#008000', color:"white"}}>후원일</th>
                            <th style={{backgroundColor:'#008000', color:"white"}}>구매자 이름</th>
                            <th style={{backgroundColor:'#008000', color:"white"}}>금액(원)</th>
                            <th style={{backgroundColor:'#008000', color:"white"}}>결제 방법</th>
                            <th style={{backgroundColor:'#008000', color:"white"}}>주문 ID</th>
                            <th style={{backgroundColor:'#008000', color:"white"}}>결제 ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((donate, index) => (
                            <tr key={index}>
                                {/* 결제일 포맷팅 */}
                                <td>{format(new Date(donate.createdAt), 'yyyy년 MM월 dd일 HH시 mm분')}</td>
                                <td>{donate.buyerName}</td>
                                <td>{donate.amount}</td>
                                <td>{donate.paymentMethod}</td>
                                <td>{donate.orderId}</td>
                                <td>{donate.paymentId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding:'10px', border:'solid 1px'}}>후원 기록이 없습니다.</p>
            )}

            {/* 페이지 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    이&nbsp;&nbsp;전
                </button>
                <span> 페이지 {page} </span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                    다&nbsp;&nbsp;음
                </button>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <button onClick={backMemberInfoPage} style={{ padding: '5px 10px 5px 10px', backgroundColor:'#008000', color:'white'}}>회원정보로 돌아가기</button>
            </div>
        </div>
    );
};

export default DonateHistory;
