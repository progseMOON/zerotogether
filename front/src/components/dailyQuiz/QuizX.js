import React from 'react';
import axios from 'axios';
import './QuizModal.css';
// 퀴즈가 오답인경우
const QuizX = ({setIsOpen, explanation,member, result, quizId}) => {

// 문제 결과를 전송
const insertQH = async () => {
    console.log("퀴즈기록추가 시작")
    try{
        await axios.post('/insertQH', {
            memId: member.memId,
            quizid: quizId,
            quizResult: "오답"
        });
        console.log("퀴즈기록추가 완료")
        alert("🙌내일 또 만나요🙌")
    }catch(error){
        console.error('퀴즈 히스토리 입력 실패:', error.response ? error.response.data : error.message);
    }
    setIsOpen(false)
}

return (
    <>
    <div className="expl">
        <div className="minimodal-header">


        <div>
            <span> <h1>❌오답입니다!❌ </h1></span>
            <br/>
            <span>정답은! {result}</span>
        </div>
        <div>
        <fieldset>
            <legend>해설</legend>
            <h2>{explanation}</h2>
        </fieldset>
        </div>

        </div>
        <button onClick={insertQH} className="point-button">나가기</button>
    </div>
    </>
);
};

export default QuizX;
