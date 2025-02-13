package com.zd.back.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.zd.back.board.model.Board;
import com.zd.back.board.model.param.BoardParam;

@Mapper
@Repository
public interface BoardMapper {

    void insertBoard(Board board);

    List<Board> getBbsSearchPageList(BoardParam param);
	int getBbsCount(BoardParam param);

    Board getBoard(int boardno);
	int createBbsReadCountHistory(BoardParam param);
	int increaseBbsReadCount(int boardno);

    int updateBoard(BoardParam param);

    int deleteBoard(int boardno);

    int updateBbsStep(int parentno);
	int getBbsAnswerCount(int parentno);
	void createBbsAnswer(BoardParam param);
    String getCategoryByBoardno(int parentno); //답글생성시 카테고리값 지정

    void updateFileDetails(Board board);

    int findMaxBoardNo();

}
