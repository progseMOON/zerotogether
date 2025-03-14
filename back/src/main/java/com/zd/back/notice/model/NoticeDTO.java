package com.zd.back.notice.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoticeDTO {
    private Long noticeId;
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int views;

    // 기본 생성자 추가
    public NoticeDTO() {}

    // 모든 필드를 포함하는 생성자 추가
    public NoticeDTO(Long noticeId, String title, String content, String author, LocalDateTime createdAt, LocalDateTime updatedAt, int views) {
        this.noticeId = noticeId;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.views = views;
    }
}
