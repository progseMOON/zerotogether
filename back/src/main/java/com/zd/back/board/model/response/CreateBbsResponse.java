package com.zd.back.board.model.response;

import lombok.Data;

@Data
public class CreateBbsResponse {

    private int boardno;

    public CreateBbsResponse(int boardno) {
        this.boardno = boardno;
    }
}