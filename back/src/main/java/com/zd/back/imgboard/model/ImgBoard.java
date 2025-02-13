package com.zd.back.imgboard.model;

import java.util.List;

import lombok.Data;

@Data
public class ImgBoard { 

    //ImgPsot  + Img 
    private ImgPost imgPost;
    private List<Img> images; 
 
    //페이징 처리를 위함
    private int page;
    private int size;

}
