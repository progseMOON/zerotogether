package com.zd.back.comment.model.response;

import lombok.Data;

@Data
public class UpdateCommentResponse {

    private int updatedRecordCount; // 업데이트된 레코드 수

    // 생성자
    public UpdateCommentResponse(int updatedRecordCount) {
        this.updatedRecordCount = updatedRecordCount;
    }
}