package com.zd.back.JY.domain.dailyQuiz;

import java.time.LocalDateTime;
import java.util.Date;

import lombok.Data;

@Data
public class QuizHistoryDTO {
    private int quizHistoryId;  //db에 이름 변경
    private String quizResult;
    private LocalDateTime quizDate; //Date->LocalDateTime으로 변경
    private String memId;
    private int quizid;     //quizid추가 및 quiz테이블의 quizid와 fk관계 delete cascade옵션 

    public QuizHistoryDTO(int quizHistoryId, String quizResult,LocalDateTime quizDate,String memId,int quizid){
        this.quizHistoryId=quizHistoryId;
        this.quizResult=quizResult;
        this.quizDate = quizDate != null ? quizDate : LocalDateTime.now();
        this.memId=memId;
        this.quizid=quizid;
    }

    public QuizHistoryDTO(){
        this.quizDate=LocalDateTime.now();
    }
}
