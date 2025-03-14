package com.zd.back.comment.model.response;

import java.util.List;

import com.zd.back.comment.model.Comment;

import lombok.Data;

@Data
public class CommentResponse {

    private List<Comment> commentList; // 댓글 목록
    private int pageCnt; // 페이지 수

    // 생성자
    public CommentResponse(List<Comment> commentList, int pageCnt) {
        this.commentList = commentList;
        this.pageCnt = pageCnt;
    }
}