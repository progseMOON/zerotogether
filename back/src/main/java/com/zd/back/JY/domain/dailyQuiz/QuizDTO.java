package com.zd.back.JY.domain.dailyQuiz;

import lombok.Data;

@Data
public class QuizDTO {
    private int QUIZID;
    private String question;
    private String answer;
    private String explanation;

    public QuizDTO(int QUIZID, String question, String answer, String explanation){
        this.QUIZID = QUIZID;
        this.question = question;
        this.answer = answer;
        this.explanation = explanation;
    }

    public QuizDTO(){

    }
}
