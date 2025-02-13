package com.zd.back.board.model.response;

import lombok.Data;

@Data
public class DeleteBbsResponse {

    private int deletedRecordCount;

    public DeleteBbsResponse(int deletedRecordCount) {
        this.deletedRecordCount = deletedRecordCount;
    }
}