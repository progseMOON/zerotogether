package com.zd.back.seoulcrawler.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeoulNews {

    private int seoulId;    //pk
    private String title; // 제목
    private String link; // 뉴스 링크
    private String content; // 내용
    private LocalDate publishedDate; // 작성일
    private String seoulNewsGroup;
    
    
}
