package com.zd.back.board.model.response;

import lombok.Data;

@Data
public class CreateCommentResponse {

    private int boardno;

    public CreateCommentResponse(int boardno) {
        this.boardno = boardno;
    }
}