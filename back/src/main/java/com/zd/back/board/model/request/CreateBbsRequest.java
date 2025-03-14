package com.zd.back.board.model.request;

import lombok.Data;

@Data
public class CreateBbsRequest {

    private int boardno;
    private String memId;
    private String title;
    private String content;
}