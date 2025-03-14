package com.zd.back.comment.model.param;

import com.zd.back.board.model.request.CreateCommentRequest;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // 기본 생성자 자동 생성
public class CommentParam {

    private int boardno; // 게시글 번호
    private int commentno; // 댓글 번호
    private String memId; // 작성자 ID
    private String content; // 댓글 내용

    
    // 생성자: 게시글 번호와 CreateCommentRequest를 받는 생성자
    public CommentParam(int boardno, CreateCommentRequest req) {
        this.boardno = boardno;
        this.memId = req.getMemId();
        this.content = req.getContent();
    }

    // 생성자: 댓글 번호와 내용을 받는 생성자
    public CommentParam(int commentno, String content) {
        this.commentno = commentno;
        this.content = content;
    }
}