import React from 'react';
import "./QuizModal.css"
const QuizOX = ({setResult}) => {
    return (
    <div className='OX'>
        <div className='oxBox'>
            <div className='btn' onClick={()=> setResult("O")}>
                    <h1>O</h1>
            </div>
            <div className='btn' onClick={()=> setResult("X")}>
                    <h1>X</h1>
            </div>
                <span></span>
        </div>
    </div>
    );
};

export default QuizOX;
