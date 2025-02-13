import ImgArticle from "./components/imgboard/ImgArticle";
import ImgList from "./components/imgboard/ImgList";
import HomePage from "./components/login/HomePage";
import MainPageApp from "./components/mainPage/MainPageApp";
import NewsList from "./components/naverapi/NewsList";
import Pay from "./components/pay/Pay";
import BbsWrite from "./components/board/BbsWrite";
import BbsList from "./components/board/BbsList";
import BbsDetail from "./components/board/BbsDetail";
import BbsUpdate from "./components/board/BbsUpdate";
import BbsAnswer from "./components/board/BbsAnswer";
import OrgApp from "./components/org/OrgApp";
import MinEnvArticle from "./components/rss/MinEnvArticle";
import RssData from "./components/rss/RssData";
import SeoulNewsAir from "./components/seoulnews/SeoulNewsAir";
import SeoulNewsArticle from "./components/seoulnews/SeoulNewsArticle";
import SeoulNewsEco from "./components/seoulnews/SeoulNewsEco";
import SeoulNewsEnv from "./components/seoulnews/SeoulNewsEnv";
import SeoulNewsGreen from "./components/seoulnews/SeoulNewsGreen";
import GoogleMaps from "./components/smartmap/GoogleMaps";
import ImgCreated from "./components/imgboard/ImgCreated";
import MemberInfoPage from "./components/login/MemberInfoPage";
import RegisterPage from "./components/login/RegisterPage";
import FindIdModal from "./components/login/FindIdModal";
import FindPasswordModal from "./components/login/FindPasswordModal";
import PointInfoModal from "./components/login/PointInfoModal";
import Calendar from "./components/login/Calendar";
import AdminPage from "./components/login/AdminPage";
import SuccessPage from "./components/pay/SuccessPage ";
import FailurePage from "./components/pay/FailurePage";
import ProtectedRoute from './components/login/utils/ProtectedRoute';
import SeoulNews from "./components/seoulnews/SeoulNews";
import NoticeList from "./components/notice/NoticeList";
import NoticeDetail from "./components/notice/NoticeDetail";

import Cover from "./components/mainPage/Cover";

import Zerodongheng from './components/zerodongheng/Zerodongheng';
import Recycling from "./components/zerodongheng/Recycling";
import Upcycling from "./components/zerodongheng/Upcycling";
import Zerowaste from "./components/zerodongheng/Zerowaste";
import ExCreated from "./components/exchange/ExCreated";
import ExList from "./components/exchange/ExList";
import ExArticle from "./components/exchange/ExArticle";
import DonateHistory from "./components/login/DonateHistory";

//링크 경로를 기록하는 파일입니다.
//공용 파일이니 보기 쉽도록 App.js와 같은 위치에 만들었습니다.
//가장 상위 Router인 App에서 실행되므로, 여기다가 경로 기록하시면 어디서든 원하는 경로로 들어갈 수 있습니다.
//헷갈릴 수 있으니, 주석처리로 어느 페이지인지 기록한 뒤 링크 경로를 기록해두시면 될 것 같습니다.

export const routes = [

    { path:'/', element:<Cover/>},    //커버
    { path:'/mainpage', element:<MainPageApp/>},    //메인페이지

    { path: '/login', element: <HomePage /> },  // 로그인 페이지
    { path: '/member-info', element: <MemberInfoPage/> },//회원정보조회
    { path: '/register', element: <RegisterPage/> },//회원가입
    { path: '/find-id', element: <FindIdModal /> },
    { path: '/find-password', element: <FindPasswordModal /> },
    { path: '/point-info', element: <PointInfoModal /> },
    { path: '/attendance', element: <Calendar /> },
    { path: '/admin', element: <AdminPage />},
    { path: '/admin',
        element: (
            <ProtectedRoute roles={['ADMIN']}>
                <AdminPage />
            </ProtectedRoute>
        )
    },


    { path:'/naverNewsList', element:<NewsList/>},   //네이버api 뉴스리스트

    { path:'/seoulNews/Env', element:<SeoulNewsEnv/>},   //서울env 뉴스리스트
    { path:'/seoulNews/Eco', element:<SeoulNewsEco/>},   //서울eco 뉴스리스트
    { path:'/seoulNews/Air', element:<SeoulNewsAir/>},   //서울air 뉴스리스트
    { path:'/seoulNews/Green', element:<SeoulNewsGreen/>},   //서울green 뉴스리스트
    { path:'/seoulNews/All', element:<SeoulNews/>},   //서울 뉴스리스트
    { path:'/seoulNewsArticle/:seoulId', element:<SeoulNewsArticle/>},   //서울 뉴스 상세페이지


    { path:'/orgList', element:<OrgApp/>},   //봉사단체 리스트
    { path:'/minEnv', element:<RssData/>},   //환경부 Rss 배포 환경정책 리스트
    { path:'/minEnv/:rssId', element:<MinEnvArticle/>},   //환경부 Rss 상세 페이지

    { path:'/googleMap', element:<GoogleMaps/>},   //구글맵 api

    //결제(후원) 경로
    {path:'/donatehistory', element: <DonateHistory/>},
    { path: '/donate', element: <Pay/> },   
    { path: '/success', element: <SuccessPage /> },
    { path: '/failure', element: <FailurePage /> },

    //zerodongheng
    { path: '/zerodongheng', element: <Zerodongheng /> },
    { path: '/zerowaste', element: <Zerowaste /> },
    { path: '/recycling', element: <Recycling /> },
    { path: '/upcycling', element: <Upcycling /> },

    //ImgBoard
    { path: '/imgboard/created', element: <ImgCreated/> },
    { path: '/imgboard/updated', element: <ImgCreated/> }, // ImgCreated.js에서 Mode바꿔서 사용
    { path: '/imgboard/list', element: <ImgList /> },
    { path: '/imgboard/article', element: <ImgArticle/> }, //QueryParameter 사용

    //TipBoard
    { path: '/board/list', element: <BbsList /> },
    { path: '/board/write', element: <BbsWrite /> },
    { path: '/board/:boardno', element: <BbsDetail /> },
    { path: '/board/update/:boardno', element: <BbsUpdate /> },
    { path: '/board/answer/:parentno', element: <BbsAnswer /> },

    //notice
    { path: '/notices', element: <NoticeList /> },
    { path: '/notices/:noticeId', element: <NoticeDetail /> },

     //Exchange
    { path: '/exchange/created', element: <ExCreated/> },
    { path: '/exchange/list', element: <ExList/> },
    { path: '/exchange/article', element: <ExArticle/> },

]

export default routes
