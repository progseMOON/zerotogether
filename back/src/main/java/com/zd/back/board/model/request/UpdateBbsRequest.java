package com.zd.back.board.model.request;

import lombok.Data;

@Data
public class UpdateBbsRequest {

    private String memId;
    private String title;
    private String content;
}