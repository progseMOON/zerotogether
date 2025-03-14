package com.zd.back.comment.model.param;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CommentListParam extends PageParam {

    private int boardno;

    // boardno를 파라미터로 받는 생성자 추가
    public CommentListParam(int boardno) {
        this.boardno = boardno;
    }
}
