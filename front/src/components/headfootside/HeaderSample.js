import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../login/context/AuthContext';
import './HeaderSample.css';
import LoginPage from '../login/LoginPage';

const HeaderSample = () => {
    const { memId, logout, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

    const logos = [
        '/images/login/klogo.png',
        '/images/login/elogo.png'
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const handleMouseEnter = (menuName) => {
        setActiveMenu(menuName);
    };

    const handleMouseLeave = () => {
        setActiveMenu('');
    };

    const renderSubMenu = () => {

        return (
            <>
                <div className='header-submenu' onMouseEnter={() => handleMouseEnter('zero together')}>
                    <Link to="/zerowaste"><div className='small-menu'>제로웨이스트 소개</div></Link>
                    <Link to="/recycling"><div className='small-menu'>리사이클링 소개</div></Link>
                    <Link to="/upcycling"><div className='small-menu'>업사이클링 소개</div></Link>
                    <Link to="/zerodongheng"><div className='small-menu'>팀 제로동행</div></Link>
                </div>
                <div className='header-submenu' onMouseEnter={() => handleMouseEnter('eco-news')}>
                    <Link to="/naverNewsList"><div className='small-menu'>네이버 환경소식</div></Link>
                    <Link to="/minEnv"><div className='small-menu'>환경부 정책소식</div></Link>
                    <Link to="/seoulNews/All"><div className='small-menu'>서울시 환경소식</div></Link>
                    <Link to="/orgList"><div className='small-menu'>환경봉사단체목록</div></Link>
                </div>
                <div className='header-submenu' onMouseEnter={() => handleMouseEnter('zero-activity')}>
                    <Link to="/notices"><div className='small-menu'>공&nbsp;지&nbsp;사&nbsp;항</div></Link>
                    <Link to="/board/list"><div className='small-menu'>참여게시판</div></Link>
                    <Link to="/imgboard/list"><div className='small-menu'>인증게시판</div></Link>
                </div>
                <div className='header-submenu' onMouseEnter={() => handleMouseEnter('zero-consumer')}>
                    <Link to="/googleMap"><div className='small-menu'>서울 제로웨이스트 상점</div></Link>
                    <Link to="/exchange/list"><div className='small-menu'>친환경 장바구니 신청</div></Link>
                </div>
            </>
        );

    };


  const handleLoginClick = () => {
      if (memId) {
          logout();
          navigate('/mainpage');
      } else {
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
        <div className='header'>
            <div className='header-background header-background_one'>
                <nav className="header-content" onMouseLeave={handleMouseLeave}>
                    <div className="top-nav">
                        <h1>
                            <Link to="/">
                                <img
                                    src={logos[currentLogoIndex]}
                                    alt="로고"
                                    style={{width: '220px', height: 'auto'}}
                                />
                            </Link>
                        </h1>
                        <div>
                            <nav className="bottom-nav">
                                <ul>
                                    {['zero together', 'eco-news', 'zero-activity', 'zero-consumer'].map(menu => (
                                        <li key={menu} onMouseEnter={() => handleMouseEnter(menu)}
                                        className={activeMenu === menu ? 'active' : ''}>
                                            {menu.replace('-', ' ').toUpperCase()}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>

                        <div>
                            <Link to="/mainpage"><img src='/images/home.png' alt="홈" /></Link>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <img
                                src={memId ? '/images/login/on.png' : '/images/login/off.png'}
                                alt={memId ? "로그아웃" : "로그인"}
                                onClick={handleLoginClick}
                                style={{width: '50px', height: '50px', cursor: 'pointer'}}
                            />
                        </div>
                    </div>
                    {activeMenu && (
                        <div className='header-background_three'>
                            <div className="submenu-layer">
                                <div className="sub-menu-content">
                                    {renderSubMenu()}
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
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

export default HeaderSample;
