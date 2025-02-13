package com.zd.back.board.model.response;

import com.zd.back.board.model.Board;

import lombok.Data;

@Data
public class BbsResponse {

    private Board board;

    public BbsResponse(Board board) {
        this.board = board;
    }
}