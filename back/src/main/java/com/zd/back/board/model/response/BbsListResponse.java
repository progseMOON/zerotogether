package com.zd.back.board.model.response;

import java.util.List;

import com.zd.back.board.model.Board;

import lombok.Data;

@Data
public class BbsListResponse {

    private List<Board> bbsList;
    private int pageCnt;

    public BbsListResponse(List<Board> bbsList, int pageCnt) {
        this.bbsList = bbsList;
        this.pageCnt = pageCnt;
    }
}