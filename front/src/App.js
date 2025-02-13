import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/headfootside/Footer';
import SideBar from './components/headfootside/SideBar';
import { AuthProvider } from './components/login/context/AuthContext';
import AxiosInterceptor from './components/login/utils/AxiosInterceptor';
import HttpHeadersProvider from './components/context/HttpHeadersProvider';
import routes from './routes';
import HeaderSample from './components/headfootside/HeaderSample';
import { useEffect } from 'react';

function AppContent() {

  //React Router에서 경로를 가져오는 훅. 단, 이걸 사용하기 위해서는 정의되는 함수가 <BrowserRouter> 안에 있어야 한다고 합니다.
  //그래서 아래처럼 App()에서 <BrowserRouter></BrowserRouter>로 감싼 AppContent를 불러오도록 구조를 변경해야 합니다.
  const location = useLocation();
  const isMainPage = location.pathname === '/mianpage'; // 메인 페이지인지 확인
  const isLoginPage = location.pathname === '/login'; // 로그인 페이지인지 확인

  // 숨길 경로 목록. 특정 경로의 웹페이지에서 헤더와 푸터, 사이드바를 보기 싫을 때 이 배열에 경로저장해주세요.
  const hiddenPaths = ['/member-info','/','/donatehistory'];
  const isHiddenPage = hiddenPaths.includes(location.pathname); // 현재 경로가 숨길 경로 목록에 있는지 확인

  useEffect(() => {
    // 페이지 변경 시 scrollTop을 0으로 설정하여 맨 위로 스크롤
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location]);

  return (

    <div id='wrap'>
      {/* 헤더는 모든 페이지에서 공통적으로 사용 */}
      {!isHiddenPage && <HeaderSample/>}

      <div className='container'>

        {/* 사이드바가 나오는 페이지는 flex 레이아웃을 적용 */}
        <div className={isMainPage ? 'main-content' : 'main-layout'}>

          <div className={isMainPage ? 'main-content' : 'content'}>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </div>
        </div>
      </div>

      {/* 풋터는 모든 페이지에서 공통적으로 사용 */}
      {!isHiddenPage && <Footer className='footer' />}

    </div>
  );
}

//메인페이지에선 사이드바가 나오지 않고, 그 외의 페이지에서만 사이드바가 나오도록 구현하기 위해 상위App이 필요해져
//App.js의 구조를 살짝 변경했습니다. 프론트 확인은 하던대로 위쪽에서 진행하시면 됩니다.
function App() {
  return (
    <AuthProvider>
      <HttpHeadersProvider>
        <BrowserRouter>
          <AxiosInterceptor>
            <AppContent />
          </AxiosInterceptor>
        </BrowserRouter>
      </HttpHeadersProvider>
    </AuthProvider>
  );
}

export default App;
