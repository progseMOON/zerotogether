package com.zd.back.comment.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.zd.back.comment.model.Comment;
import com.zd.back.comment.model.param.CommentListParam;
import com.zd.back.comment.model.param.CommentParam;

@Mapper
@Repository
public interface CommentMapper {
    
    void createComment(CommentParam param); //boardno

    List<Comment> getCommentPageList(CommentListParam param); //boardno
    int getCommentCount(int boardno); //boardno

    Comment getCommentBySeq(int commentno); //commentno
    int updateComment(CommentParam param); //commentno

    int deleteComment(int commentno); //commentno
}
