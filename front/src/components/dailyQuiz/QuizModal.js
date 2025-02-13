import React,{useCallback, useContext, useEffect, useState} from 'react';
import Modal from 'react-modal';
import './QuizModal.css';
import Quiz from './Quiz'
import QuizResult from './QuizResult';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../login/context/AuthContext';
Modal.setAppElement('#root');


const QuizModal = ({isOpen, setIsOpen}) => {
    const [member, setMember] = useState(null);
    const [quizId, setQuizId] = useState(null);
    const {token, setToken} = useContext(AuthContext);

    //회원 토큰 조회
    const fetchMemberInfo = useCallback(() => {
        axios.get('/member/info', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setMember(response.data);
            })
            .catch(error => {
                console.error('회원 정보 조회 실패:', error);
            });
    }, [token]);

    // useEffect(() => {
    //     // 예시: 로컬 스토리지에서 토큰을 가져와서 상태에 설정
    //     const storedToken = localStorage.getItem('authToken');
    //     if (storedToken) {
    //         setToken(storedToken);
    //     }
    // }, []);

    useEffect(() => {
        if (isOpen && member) {
            checkQH(); // 모달이 열릴 때 퀴즈 참여 여부 확인
        }
    }, [isOpen, member]);
    
    //퀴즈풀었는지 유무
    const checkQH = async () => {
        try {
            // 서버에 POST 요청을 보내어 퀴즈풀었는지 유무 반환
            const response = await axios.post("/checkQH", null, {
                params: {
                    memId: member.memId
                }
            });
            // 응답 데이터에서 메시지를 확인
            if (response.data.message === 'done') {
                // 오늘 퀴즈에 참여한 경우 모달을 false로 설정
                alert("오늘의 퀴즈는 하루에 한번만 가능합니다")
                setIsOpen(false);
            }else if(response.data.message === 'yet'){
            }
        } catch (error) {
            // 에러 발생 시 콘솔에 에러 메시지 출력
            alert(member.memId)
            console.error("퀴즈 히스토리 호출 실패", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMemberInfo();
        }
    }, [fetchMemberInfo, token]);

    const navigate = useNavigate(); // navigate 훅 추가

    //사용자의 O,X
    const [result, setResult] = useState("ON");

    const [explanation, setExplanation] = useState("null");
    //문제의 정답 O,X
    const [answer, setAnswer] = useState("null");



    useEffect(() => {
        // 모달이 열릴 때 memId가 없으면 로그인 페이지로 이동
        if (isOpen && !member) {
            if (!token) {
                alert("로그인 한 사용자만 일일퀴즈가 가능합니다!");
                navigate("/login");
            } else {
                fetchMemberInfo(); // 토큰이 있으면 회원 정보 가져오기
            }
        }

    }, [isOpen, member, navigate, setIsOpen]);




    return (
        <>
            {/* <div>
                {answer} + {result}
            </div> */}

            <div className='bg'></div>

            <Modal
                isOpen={isOpen}
                contentLabel = "QOX"
                className={result ==='ON' ? 'Qmodal' : 'smallModal'}
            >


            {
                result === "ON" ? (
                    <Quiz setIsOpen={setIsOpen} setResult={setResult} setAnswer={setAnswer} setExplanation={setExplanation} setQuizId={setQuizId}/>

                ) : <QuizResult setIsOpen={setIsOpen} answer={answer} result={result} explanation={explanation} member={member} quizId={quizId}/>
            }
            </Modal>
        </>
    );
};

export default QuizModal;
