package com.zd.back.JY.domain.dailyQuiz;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.transaction.annotation.Transactional;


@Mapper
public interface QuizHistoryMapper{

    public int QHMaxNum();

    @Transactional
    public void insertQH(QuizHistoryDTO dto);  //결과, sysdate, memid

    public int checkToday(String memId);
}
