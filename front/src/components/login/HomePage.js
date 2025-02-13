import React, { useState, useEffect, useContext, useCallback } from 'react';
import LoginPage from './LoginPage';
import FindIdModal from './FindIdModal';
import FindPasswordModal from './FindPasswordModal';
import PointInfoModal from './PointInfoModal';
import { AuthContext } from './context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'
import './FindModal.css'
import QuizModal from '../dailyQuiz/QuizModal';
import { adjustWindowSize } from './utils/Sizing';

const HomePage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showFindIdModal, setShowFindIdModal] = useState(false);
    const [showFindPasswordModal, setShowFindPasswordModal] = useState(false);
    const [showPointInfoModal, setShowPointInfoModal] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const { token, logout, login, memId, role } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        logout();
        setIsLoggedIn(false);
    }, [logout]);

    useEffect(() => {
        if (token) {
            try {
                jwtDecode(token);
                setIsLoggedIn(true);
            } catch (e) {
                console.error('Token decoding failed:', e);
                handleLogout();
            }
        } else {
            setIsLoggedIn(false);
        }
    }, [token, handleLogout]);

    const openQuizModal = () => {
        if (token) {
            alert('🙌환영합니다🙌')
            setIsQuizModalOpen(true);
        } else {
            alert("로그인 한 사용자만 일일퀴즈가 가능합니다!");
            setShowLogin(true);
        }
    };

    const handleMemberInfo = () => {
        window.open('/member-info', 'MemberInfo', 'width=1000,height=800,resizable=yes');
    };

    const handlePointInfo = () => {
        setShowPointInfoModal(true);
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLoginSuccess = useCallback(() => {
        setShowLogin(false);
        setIsLoggedIn(true);
    }, []);

    return (
        <div className='mini_login_wrap'>
            {!isLoggedIn ? (
                <div style={{ height: 160, alignItems: 'center' }}>
                    <h5
                        className="login-text"
                        style={{
                            fontWeight: 'bold',
                            textShadow: '3px 3px 5px rgba(0, 0, 0, 0.4)'
                        }}
                    >
                        제로동행을 더 안전하고 편리하게 이용하세요
                    </h5>

                    <button
                        onClick={() => setShowLogin(true)}
                        className="btn btn-primary btn-lg"
                        style={{
                            backgroundColor: '#0080000',
                            borderColor: '#0080000',
                            marginBottom: '15px',
                            fontWeight: 'bold',
                            textShadow: '3px 3px 5px rgba(0, 0, 0, 0.4)',
                            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.5)',
                            transition: 'box-shadow 0.3s ease-in-out'
                        }}
                    >
                        ZERO TOGATHER 로그인
                    </button>
                    {showLogin && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100px',
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
                    <div className="button-group">
                        <button type="button" className="btn btn-link" onClick={() => setShowFindIdModal(true)}>아이디 찾기</button>
                        <button type="button" className="btn btn-link" onClick={() => setShowFindPasswordModal(true)}>비밀번호 찾기</button>
                        <button type="button" className="btn btn-link" onClick={handleRegister}>회원가입</button>
                    </div>
                    <FindIdModal show={showFindIdModal} onHide={() => setShowFindIdModal(false)}/>
                    <FindPasswordModal show={showFindPasswordModal} onHide={() => setShowFindPasswordModal(false)}/>
                </div>
            ) : (
                <div>
                    <h5
                        className="login-text"
                        style={{
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        안녕하세요 <span style={{ color: '#008000' }}>{memId}</span> 님, 오늘도 행복한 하루되세요
                    </h5>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        {/* 이미지 */}
                        <img
                            src={role === 'ADMIN' ? '/images/login/admin.png' : '/images/login/user.png'}
                            alt={role === 'ADMIN' ? '관리자' : '사용자'}
                            style={{ width: '80px', height: '80px', marginRight: '10px' }} // 이미지 높이를 두 줄 크기로 설정
                        />

                        {/* 버튼 그룹 */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', marginBottom: '5px' }}>
                                <button onClick={handleMemberInfo} className="btn btn-info" style={{border:'none'}}>회&nbsp;원&nbsp;정&nbsp;보&nbsp;</button>&nbsp;
                                <button onClick={handlePointInfo} className="btn btn-success" style={{border:'none'}}>회원포인트</button>&nbsp;
                            </div>
                            <div style={{ display: 'flex' }}>
                                <button onClick={openQuizModal} className="btn btn-primary" style={{border:'none'}}>오늘의퀴즈</button>&nbsp;
                                <button onClick={handleLogout} className="btn btn-danger" style={{border:'none'}}>로&nbsp;그&nbsp;아&nbsp;웃&nbsp;</button>&nbsp;
                                {/* 관리자 페이지 버튼 */}
                                {role === 'ADMIN' && (
                                    <button onClick={() => navigate('/admin')} className="btn btn-warning">관리자모드</button>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* 모달 */}
                    <QuizModal isOpen={isQuizModalOpen} setIsOpen={setIsQuizModalOpen} />
                    {showPointInfoModal && (
                        <PointInfoModal
                            show={showPointInfoModal}
                            onHide={() => setShowPointInfoModal(false)}
                            memId={memId}
                        />
                    )}
                </div>
            )}
        </div>
    );

};

export default HomePage;
