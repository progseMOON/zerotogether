package com.zd.back.naversearchapi.model;

import java.sql.Date;

import lombok.Data;

@Data
public class News {
    private int naverId;
    private String title;
    private String link;
    private String description;
    private Date pubDate;
    
}