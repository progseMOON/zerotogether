package com.zd.back.JY.domain.dailyQuiz;



import org.apache.ibatis.annotations.Mapper;



@Mapper
public interface QuizMapper {



    public int maxNum();

    public void insertquiz(QuizDTO dto);

    public QuizDTO getRandomQuiz();

    public void insetQH(QuizHistoryDTO dto);
}
