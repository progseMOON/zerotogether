package com.zd.back.comment.model.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CommentRequest {

    private int boardno; // 게시글 번호
    private int page; // 페이지 번호

}