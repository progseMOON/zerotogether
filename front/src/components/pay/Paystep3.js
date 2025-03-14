import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import './Pay.css';
import LoginPage from '../login/LoginPage';
import { AuthContext } from '../login/context/AuthContext';

const Paystep3 = ({ setStep, requestPay, amount, memberInfo, isMember }) => {
    const {login, memId } = useContext(AuthContext);
    const navigate = useNavigate(); // navigate 훅을 사용해 페이지 이동
    const [showLogin, setShowLogin] = useState(false);
    const prevStep = () => {
        setStep(2);
    };

    const handlePayment = () => {
        if (memId) {
            // 회원일 경우 결제 요청
            requestPay();
        } else {
            // 비회원일 경우 로그인 페이지로 리다이렉트

            

            setShowLogin(true);
        }
    };

    const handleLoginSuccess = async (token, refreshToken, id, userRole) => {
        try {
            await login(token, refreshToken, id, userRole);
            setShowLogin(false);
        } catch (error) {
            console.error('Login failed:', error);
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="paystep-container">
            <div className="payment-info">
                <h3>결제 정보</h3>

                <ul>
                    <li>회원 ID: {memberInfo.memId}</li>
                    <li>후원금액: {amount} 원</li>
                    <li>이메일: {memberInfo.email}</li>
                    <li>전화번호: {memberInfo.tel}</li>
                </ul>
            </div>

            <button onClick={prevStep} className="prev-step-btn">이전단계</button>
            <button onClick={handlePayment} className="pay-btn">
                {isMember ? '결제하기' : '로그인 후 결제'}
            </button>

            {showLogin && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000
                    }}
                >
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}>
                        <LoginPage onLoginSuccess={handleLoginSuccess} />
                        <button onClick={() => setShowLogin(false)} className="btn btn-secondary mt-3">닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Paystep3;
