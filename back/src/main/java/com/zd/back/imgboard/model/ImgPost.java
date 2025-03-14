package com.zd.back.imgboard.model;



import lombok.Data;

@Data
public class ImgPost {
     private int imgPostId; // 게시판 번호
    private String memId; // 사용자 ID
    private String cate; // 카테고리
    private String title; // 게시글 제목
    private String content; // 게시글 내용
    private String created; // 생성일
    private int auth; // 인증 여부 (0 또는 1)
    private String authDate; // 인증된 날짜

}
