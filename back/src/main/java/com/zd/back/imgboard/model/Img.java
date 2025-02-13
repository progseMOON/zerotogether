package com.zd.back.imgboard.model;


import lombok.Data;

@Data
public class Img {
    private int imgId; // 이미지 ID
    private int imgPostId; // 게시판 ID (FK)
    private String originalFileName; // 원래 파일 이름
    private String saveFileName; // 서버에 저장된 파일 이름
    private String filePath; // 파일 경로
    private String fileDate; // 업로드 날짜
} 
