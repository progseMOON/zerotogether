package com.zd.back.comment.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor
public class Comment {

    private int commentno;
    private String memId;
    private String content;
    private int boardno;
    private int del;
    private Date created;
    
}
