package com.zd.back.imgboard.model;

import java.util.List;

import lombok.Data;

@Data
public class ImgBoardResponse {

    private List<ImgBoard> content;
    private int totalElements;

    public ImgBoardResponse(List<ImgBoard> content, int totalElements) {
        this.content = content;
        this.totalElements = totalElements;
    }
}
