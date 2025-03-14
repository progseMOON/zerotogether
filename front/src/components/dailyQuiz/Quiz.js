import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import QuizOX from './QuizOX';
import QuizItem from './QuizItem';
const Quiz = ({ setIsOpen,  setResult, setAnswer, setExplanation, setQuizId}) => {

    const [quiz, setQuiz,] = useState(null);
    
    useEffect(()=> {
        if(quiz){
            setQuizId(quiz.id)
            setAnswer(quiz.answer)
        
            setExplanation(quiz.explanation)
        }
    },[quiz, setAnswer, setExplanation,setQuizId])
    

    return (
        <>

            <div 
                style={{ textAlign: 'right', marginBottom: '10px' }}
            >
                <button onClick={() => setIsOpen(false)} className="close">나가기</button>
            </div>

            <QuizItem setQuiz={setQuiz} quiz={quiz}/>

            {/* 조건부 렌더링: quiz가 있을 때만 <QuizOX>를 렌더링 */}
            {quiz && <QuizOX setResult={setResult} />} 
                         
        </>
    );
};

export default Quiz;