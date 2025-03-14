package com.zd.back.notice.model;

import java.util.Date;

import lombok.Data;

@Data
public class Notice {

   private int noticeNo;
   private String title;
   private String writer;
   private String contetnt;
   private Date created;

}

