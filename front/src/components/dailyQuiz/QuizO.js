import React, { useState } from 'react';
import './QuizModal.css';
import axios from 'axios';
//퀴즈가 정답인 경우
const QuizO = ({setIsOpen, explanation, member, result, quizId}) => {


    //정답: 5포인트 상승
    const uppoint = async () => {
        console.log("포인트 변동 시작")
        try {
            const response = await axios.post('/api/point/update', {
                memId: member.memId,
                oper: '+',  // 또는 '-'
                updown: 5, // 추가하거나 차감할 포인트 수
                reason: '일일 퀴즈 정답' // 변경 사유
            });
            alert("정답!!  [+5p]")
            console.log('포인트 업데이트 성공:', response.data);

            insertQH();

            setIsOpen(false)    //퀴즈 정답 후 모달 닫기
        } catch (error) {
            console.error('포인트 업데이트 실패:', error.response ? error.response.data : error.message);
        }
    };

    // 문제 결과를 전송
    const insertQH = async () => {
        console.log("퀴즈기록추가 시작")
        try{
            await axios.post('/insertQH', {
                memId: member.memId,
                quizid: quizId,
                quizResult: "정답"
            });
            console.log("퀴즈기록 추가 완료")
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
                    <span> <h1>⭕정답입니다!⭕</h1></span>
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
                <div style={{width:'80%',display:'felx', justifyContent:'center', alignContent:'center'}}>
                    <button onClick={() => {uppoint()}} 
                className="point-button">포인트 받기</button>
                </div>
            </div>
        </>
    );
};

export default QuizO;