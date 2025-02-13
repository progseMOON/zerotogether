package com.zd.back.board.model.request;

import lombok.Data;

@Data
public class CreateCommentRequest {

    private String memId;
    private String content;
}